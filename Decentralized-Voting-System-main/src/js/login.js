const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const voter_id = document.getElementById('voter-id').value;
  const password = document.getElementById('password').value;
  const token = voter_id;

  const headers = {
    'method': "GET",
    'Authorization': `Bearer ${token}`,
  };

  fetch(`http://127.0.0.1:8000/login?voter_id=${voter_id}&password=${password}`, { headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      if (data.role === 'admin') {
        console.log(data.role);
        localStorage.setItem('jwtTokenAdmin', data.token);
        window.location.replace(`http://127.0.0.1:8080/admin.html?Authorization=Bearer ${localStorage.getItem('jwtTokenAdmin')}`);
      } else if (data.role === 'user') {
        localStorage.setItem('jwtTokenVoter', data.token);
        window.location.replace(`http://127.0.0.1:8080/index.html?Authorization=Bearer ${localStorage.getItem('jwtTokenVoter')}`);
      }
    })
    .catch(error => {
      console.error('Login failed:', error.message);
    });
});

// Function to submit vote
function submitVote(candidate) {
  const token = localStorage.getItem('jwtTokenVoter');

  const headers = {
    'method': "POST",
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  fetch(`http://127.0.0.1:8000/submit_vote`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ candidate: candidate })
  })
    .then(response => {
      if (response.ok) {
        return response.text();  // Assuming the response is just a text message
      } else {
        throw new Error('Vote submission failed');
      }
    })
    .then(message => {
      console.log(message);  // Display success message
      alert(message); // Optionally show alert to the user
    })
    .catch(error => {
      console.error('Error submitting vote:', error.message);
    });
}
