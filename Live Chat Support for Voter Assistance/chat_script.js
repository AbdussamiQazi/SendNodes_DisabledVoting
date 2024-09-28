const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');

// Predefined questions and answers
const responses = {
    "how do i register to vote?": "You can register to vote online through your state's election website, by mail with a paper form, or in person at designated locations. Be sure to check the registration deadlines for your state.",
    "what are the eligibility requirements for voting?": "To be eligible to vote, you must be a citizen of the country, a resident of the state where you plan to vote, and at least 18 years old by Election Day. Some states allow 17-year-olds to vote in primary elections if they will be 18 by the general election.",
    "how can i check if i am registered to vote?": "You can check your voter registration status on your state’s election website. You’ll typically need to provide your name, date of birth, and possibly other identifying information.",
    "where can i find my polling place?": "You can find your polling place by visiting your state’s election office website or using voter registration tools. You may also be able to find this information on your voter registration card.",
    "what should i bring to the polls?": "Requirements vary by state. Some states require a photo ID, while others may accept non-photo identification. Check your state’s requirements to see what you need to bring.",
    "can i vote by mail?": "To vote by mail, you need to request an absentee ballot from your state’s election office. You can often do this online. Fill out your ballot and return it according to your state’s instructions before the deadline.",
    "what if i encounter problems at the polls?": "If you encounter problems at the polls, ask a poll worker for assistance. If necessary, you can contact a voter protection hotline for help.",
    "can i change my vote after submitting it?": "Once your vote is submitted, it generally cannot be changed. However, if you are voting in person, you may be able to request a new ballot before submitting it.",
    "what accommodations are available for individuals with disabilities?": "Polling places are required to be accessible. This includes wheelchair ramps, accessible voting machines, and assistance from poll workers. Check with your local election office for specific accommodations available.",
    "how can i learn about the candidates and measures on the ballot?": "You can find information about candidates and measures through official state election websites, non-partisan voter guides, and local news outlets. Many organizations also provide candidate comparison tools.",
    "what if i forgot to register before the deadline?": "Some states offer same-day registration, allowing you to register and vote on Election Day. Check your state's regulations for more information.",
    "what are the voting hours on election day?": "Polling hours vary by state. Most polls open between 6 AM and 8 AM and close between 7 PM and 9 PM. Check your state’s election office for specific times."
};

// Fuzzy matching function to find the closest match
function getClosestMatch(input) {
    const keys = Object.keys(responses);
    let closestMatch = '';
    let closestDistance = Infinity;

    keys.forEach(key => {
        const distance = levenshteinDistance(input, key);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestMatch = key;
        }
    });

    return closestMatch;
}

// Levenshtein distance function
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1) // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim().toLowerCase(); // Normalize input
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `You: ${message}`;
        messages.appendChild(messageElement);
        messageInput.value = '';

        // Try to find an exact match or the closest match
        const responseText = responses[message] || responses[getClosestMatch(message)] || "Support: I'm sorry, I don't have the answer to that. Please try asking something else.";
        
        // Simulate a response after 1 second
        setTimeout(() => {
            const responseElement = document.createElement('div');
            responseElement.textContent = `Support: ${responseText}`;
            messages.appendChild(responseElement);
            messages.scrollTop = messages.scrollHeight; // Auto-scroll
        }, 1000);
    }
});
