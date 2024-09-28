from flask import Flask, render_template, Response, request, redirect, url_for, session
import cv2
import pickle
import numpy as np
import os
import time
from datetime import datetime
from sklearn.neighbors import KNeighborsClassifier
import csv
from win32com.client import Dispatch
import jwt

SECRET_KEY="d2b861a623b1d0e89f7c91c313bce1db34fbce8356ca80cf38b72e4c5a832ed5f0fa7136ef0ed5c32641308daa88c29c108d85835afcf37e5385c8e2c4cacee6"

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Load face detection model
facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load stored data for face recognition
def load_data():
    if os.path.exists('data/names.pkl'):
        with open('data/names.pkl', 'rb') as f:
            labels = pickle.load(f)
    else:
        labels = []
        with open('data/names.pkl', 'wb') as f:
            pickle.dump(labels, f)

    if os.path.exists('data/faces_data.pkl'):
        with open('data/faces_data.pkl', 'rb') as f:
            faces = pickle.load(f)
    else:
        faces = np.empty((0, 2500))  # Assuming face data is resized to (50, 50)
        with open('data/faces_data.pkl', 'wb') as f:
            pickle.dump(faces, f)

    return labels, faces

LABELS, FACES = load_data()

# Train KNN model with available faces and labels
knn = None
if len(LABELS) > 0 and FACES.shape[0] > 0:
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(FACES, LABELS)

# Function to synthesize speech
def speak(message):
    speak = Dispatch("SAPI.SpVoice")
    speak.Speak(message)

# Video feed generator for voting and registering
def generate_frames():
    video = cv2.VideoCapture(0)
    imgBackground = cv2.imread("background.png")

    while True:
        ret, frame = video.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop_img = frame[y:y + h, x:x + w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)

            if knn is not None:  # Only predict if the model is trained
                output = knn.predict(resized_img)
                cv2.putText(frame, str(output[0]), (x, y - 10), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

        imgBackground[370:370 + 480, 225:225 + 640] = frame
        ret, buffer = cv2.imencode('.jpg', imgBackground)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Video feed generator for face registration
def generate_register_frames():
    video = cv2.VideoCapture(0)
    faces_data = []

    while len(faces_data) < 100:  # Collect 150 face samples
        ret, frame = video.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop_img = frame[y:y + h, x:x + w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten()
            faces_data.append(resized_img.flatten().reshape(1, -1))

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, f"Capturing {len(faces_data)}/1", (x, y - 10), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def generate_login_frames():
    video = cv2.VideoCapture(0)

    while True:
        ret, frame = video.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop_img = frame[y:y + h, x:x + w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
            if knn is not None:
                output = knn.predict(resized_img)
                cv2.putText(frame, str(output[0]), (x, y - 10), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/register_face')
def register_face():
    return render_template('register_vote.html')

@app.route('/register_face_feed')
def register_face_feed():
    return Response(generate_register_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/save_face', methods=['POST'])
def save_face():
    aadhaar_number = request.form['aadhaar_number']
    
    # Generate face data again
    video = cv2.VideoCapture(0)
    faces_data = []

    while len(faces_data) < 100:  # Collect 100 face samples
        ret, frame = video.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop_img = frame[y:y + h, x:x + w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten()  # Resize and flatten to (2500,)
            faces_data.append(resized_img)

    faces_data = np.asarray(faces_data)  # Shape will be (100, 2500)

    if os.path.exists('data/faces_data.pkl'):
        with open('data/faces_data.pkl', 'rb') as f:
            faces = pickle.load(f)
        
        # Debug: Check shapes
        print(f"Loaded faces shape: {faces.shape}")
        print(f"New faces_data shape: {faces_data.shape}")

        # Check for shape mismatch
        if faces_data.shape[1] == faces.shape[1]:  # Ensure both have the same number of features
            faces = np.append(faces, faces_data, axis=0)
        else:
            print(f"Shape mismatch: faces_data shape is {faces_data.shape}, existing faces shape is {faces.shape}")
            return "Error: Shape mismatch", 500
    else:
        faces = faces_data

    # Save the updated faces data
    with open('data/faces_data.pkl', 'wb') as f:
        pickle.dump(faces, f)

    # Handle names
    if os.path.exists('data/names.pkl'):
        with open('data/names.pkl', 'rb') as f:
            names = pickle.load(f)
        names += [aadhaar_number] * 100
    else:
        names = [aadhaar_number] * 100
        with open('data/names.pkl', 'wb') as f:
            pickle.dump(names, f)

    # Save the updated names data
    with open('data/names.pkl', 'wb') as f:
        pickle.dump(names, f)

    speak(f"Face data for Aadhaar {aadhaar_number} has been registered.")
    
    return redirect(url_for('index'))



@app.route('/login')
def login():
    return render_template('login_vote.html')

@app.route('/login_feed')
def login_feed():
    return Response(generate_login_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/verify_face', methods=['POST'])
def verify_face():
    video = cv2.VideoCapture(0)
    ret, frame = video.read()
    if not ret:
        return "Camera not working", 500

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        crop_img = frame[y:y + h, x:x + w]
        resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
        if knn is not None:  # Check if model is available before predicting
            output = knn.predict(resized_img)

            # If a face matches, log in the user
            if output[0] in LABELS:
                session['user'] = output[0]  # Store the user in the session

                # Generate a JWT token for the user
                token = jwt.encode({'aadhaar': output[0]}, SECRET_KEY, algorithm='HS256')

                # Redirect to the index.js (voting system) with the token
                voting_system_url = f"http://localhost:8080/index.html?Authorization=Bearer {token}"
                return redirect(voting_system_url)

    return "Face not recognized", 401


# Voter form route
@app.route('/voter_form')
def voter_form():
    if 'user' in session:
        return redirect(url_for('login'))  # Ensure the user is logged in

    return render_template('voter_form.html', user=session['user'])

@app.route('/submit_vote', methods=['POST'])
def submit_vote():
    if 'user' not in session:  # Check if the user is logged in
        return redirect(url_for('login'))

    candidate = request.form['candidate']
    user = session['user']  # Get the logged-in user's information
    ts = time.time()
    date = datetime.fromtimestamp(ts).strftime("%d-%m-%Y")
    timestamp = datetime.fromtimestamp(ts).strftime("%H:%M:%S")

    # Save vote to CSV
    exist = os.path.isfile("Votes.csv")
    attendance = [user, candidate, date, timestamp]

    with open("Votes.csv", "a" if exist else "w", newline='') as csvfile:
        writer = csv.writer(csvfile)
        if not exist:
            writer.writerow(['NAME', 'VOTE', 'DATE', 'TIME'])  # Header
        writer.writerow(attendance)

    speak("Your vote has been recorded")  # This should be a call to TTS
    return "Vote recorded successfully!"


if __name__ == "__main__":
    app.run(debug=True)
