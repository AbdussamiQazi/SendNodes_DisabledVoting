const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongodb connection-successful");
});

// Schema for voting assistance form submissions
const votingAssistanceSchema = new mongoose.Schema({
    name: String,
    email: String,
    voter_id: String,  // Changed from regd_no to voter_id
    phno: String,
    reason: String,    // Added reason field
});

const VotingAssistance = mongoose.model("VotingAssistance", votingAssistanceSchema);

// Schema for registration
const registerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Register = mongoose.model("Register", registerSchema);

// Schema for feedback
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    feedback: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Serve the original form for user data collection
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle form submission for the original user data collection
app.post('/form', async (req, res) => {
    const { regd_no, name, email, disability, phno } = req.body;
    const user = new Users({
        name,
        email,
        regd_no,
        disability,
        phno,
    });
    await user.save();
    console.log(user);
    res.send("Form Submission Successful");
});

// Serve the voting assistance form
app.get('/form2', (req, res) => {
    res.sendFile(path.join(__dirname, 'form2.html')); // Updated to serve the new form
});

// Handle form submission for voting assistance
app.post('/form2', async (req, res) => {
    const { name, email, voter_id, phno, reason } = req.body;  // Update to extract new fields
    const votingAssistance = new VotingAssistance({
        name,
        email,
        voter_id,  // Updated to use voter_id
        phno,
        reason,    // Include the reason field
    });
    await votingAssistance.save();
    console.log(votingAssistance);
    res.send("Voting Assistance Form Submission Successful");
});

// Serve the registration form
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const register = new Register({
        name,
        email,
        password,
    });
    await register.save();
    console.log(register);
    res.send("Registration Successful");
});

// Serve the login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Serve the login page
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Check if the user is registered
    const user = await Register.findOne({ email });
    if (!user) {
        return res.send("You do not have an account. Please register first."); // No account found
    }
    
    // Check if the password is correct
    if (user.password !== password) {
        return res.send("Invalid password. Please try again."); // Password incorrect
    }
    
    res.send("Login Successful. Welcome!"); // Successful login
});

// Serve the feedback form
app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'feedback.html')); // Serve the feedback page
});

// Handle feedback form submission
app.post('/feedback', async (req, res) => {
    const { name, email, feedback } = req.body;
    const userFeedback = new Feedback({
        name,
        email,
        feedback,
    });
    await userFeedback.save();
    console.log(userFeedback);
    res.send("Feedback Submitted Successfully");
});

// Start the server
app.listen(port, () => {
    console.log("Server started on port " + port);
});
