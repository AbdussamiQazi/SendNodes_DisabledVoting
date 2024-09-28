// index.js

// Check if the user is logged in via JWT token
const checkLogin = () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        alert("You are not logged in. Please log in first.");
        window.location.href = '/login'; // Redirect to login page
        return false;
    }

    return true;
};

// Fetch voting options from the server
const fetchVotingOptions = async () => {
    if (!checkLogin()) return;

    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/voting_options', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.ok) {
        const data = await response.json();
        displayVotingOptions(data); // Display voting options on the page
    } else {
        alert("Failed to fetch voting options.");
    }
};

// Display voting options on the page
const displayVotingOptions = (options) => {
    const optionsContainer = document.getElementById('options-container');

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'voting-option';

        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="candidate" value="${option.name}" required>
            ${option.name}
        `;
        optionElement.appendChild(label);

        optionsContainer.appendChild(optionElement);
    });
};

// Submit the vote
const submitVote = async (event) => {
    event.preventDefault();

    if (!checkLogin()) return;

    const token = localStorage.getItem('jwtToken');
    const candidate = document.querySelector('input[name="candidate"]:checked').value;

    const response = await fetch('/submit_vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ candidate }),
    });

    if (response.ok) {
        alert("Your vote has been recorded successfully!");
        window.location.href = '/'; // Redirect to homepage
    } else {
        alert("Failed to record your vote.");
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchVotingOptions(); // Fetch voting options when the page loads

    const voteForm = document.getElementById('vote-form');
    if (voteForm) {
        voteForm.addEventListener('submit', submitVote);
    }
});
