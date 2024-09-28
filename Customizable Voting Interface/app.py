# app.py (Flask Backend)
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        font_size = request.form.get('font-size')
        contrast = request.form.get('contrast')
        return render_template('index.html', font_size=font_size, contrast=contrast)
    return render_template('index.html', font_size='16px', contrast='default')

if __name__ == "__main__":
    app.run(debug=True)
