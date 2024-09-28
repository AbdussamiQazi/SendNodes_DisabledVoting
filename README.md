---

# Voting System for Disabled People

#https://youtu.be/dO_7qecCIao(System working video)
This project aims to create an accessible, secure, and user-friendly voting system tailored for individuals with disabilities, providing features like text-to-speech, face identification, and information on nearby voting booths.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Why HTML, CSS, and JavaScript for Majority of the Project](#why-html-css-and-javascript-for-majority-of-the-project)
- [Blockchain Integration with React](#blockchain-integration-with-react)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Voting is a fundamental right, and this project is designed to ensure that disabled individuals, including those with visual or motor impairments, can participate in elections without difficulties. The system uses speech recognition, text-to-speech technologies, and facial recognition to make the voting process easier and more inclusive.

##Working Video
https://we
## Features

- *Accessible Design*: Built with accessibility in mind, providing screen reader compatibility and large, easy-to-click buttons.
- *Text-to-Speech (TTS)*: Automatically reads out instructions and options on page load, assisting visually impaired users.
- *Speech Recognition*: Users can cast votes using voice commands for a hands-free experience.
- *Face Identification*: Uses OpenCV for secure voter identification, ensuring that only authorized individuals can cast their votes.
- *Google Maps API Integration*: Provides users with information about nearby voting booths, including wheelchair accessibility.
- *Secure Voting*: Ensures secure submission of votes with protection against tampering or fraud.
- *Responsive UI*: Works across all devices—mobile, tablets, or desktops, ensuring easy access.
- https://github.com/user-attachments/assets/2e9dcd50-97cd-421d-8862-6abec7cdf297
https://github.com/user-attachments/assets/1c52b1ad-d136-425c-a1df-5c186f900b02



## Technologies Used

- *Frontend*:
  - HTML5, CSS3 (with Bootstrap for responsive design)
  - JavaScript (for handling TTS, speech recognition, and user interactions)
  
- *Backend*:
  - Flask (for handling server-side logic)
  - Node.js (for other backend functionalities)
  - MongoDB (for securely storing votes)

- *Face Identification*:
  - OpenCV (for implementing facial recognition)

- *Google Maps API*:
  - Fetches nearby voting booths and provides accessibility information.

- *Text-to-Speech API*:
  - [ResponsiveVoice API](https://responsivevoice.org/)
Here’s a shortened version of your tech stack for blockchain integration, focusing on key terms:

---

# Tech Stack for Blockchain Integration

## 1. *Blockchain Platform*:
   - *Ethereum*: Chosen for its mature ecosystem, security, and strong developer community; essential for smart contracts in our voting system.

## 2. *Smart Contract Development*:
   - *Solidity*: Primary language for writing Ethereum smart contracts, enabling secure voting processes.
   - *OpenZeppelin*: Libraries used for secure, standardized smart contracts, reducing vulnerabilities.

## 3. *Smart Contract Management*:
   - *Truffle*: For smart contract management, testing, and deployment on Ethereum.
   - *Ganache*: Local blockchain simulation for development and testing.
   - *Remix IDE*: Quick prototyping and debugging of smart contracts.

## 4. *Blockchain Interaction*:
   - *Web3.js*: Enables frontend interaction with Ethereum, user accounts, and contract calls.
   - *MetaMask*: Wallet for secure transactions and blockchain interaction.

## 5. *Frontend (Blockchain Specific)*:
   - *React.js*: Integrated for dynamic UI updates based on blockchain transactions.
   - *Ethers.js*: Enhances security and flexibility of Ethereum interactions.

## 6. *Testing*:
   - *Chai and Mocha*: For unit testing of smart contracts, ensuring robustness.

## 7. *Deployment*:
   - *Infura*: API infrastructure connecting to Ethereum mainnet and test networks.
   - *IPFS*: For tamper-proof storage of voting-related files.

## 8. *Security and Optimization*:
   - *MythX*: Analyzes smart contracts for security vulnerabilities.
   - *Gas Optimization*: Techniques employed to minimize transaction costs.

---

This stack ensures a decentralized, transparent, and secure voting system that empowers individuals, especially those with disabilities, to vote confidently.
- *Version Control*:
  - Git & GitHub

## Why HTML, CSS, and JavaScript for Majority of the Project

The primary reason for choosing HTML, CSS, and JavaScript for the majority of the project lies in *simplicity, accessibility, and functionality. Given that this project focuses on providing **easy-to-use voting features for disabled individuals*, the emphasis was on building a highly functional and responsive interface without overcomplicating the design process.

- *HTML5* and *CSS3* were ideal for creating an accessible, responsive UI that prioritizes user experience, particularly for those with visual impairments or limited mobility. 
- *JavaScript* was used extensively for features like Text-to-Speech, Speech Recognition, and handling user interactions. It’s lightweight and capable of handling real-time inputs, which are critical for this project.
  
Given the emphasis on user accessibility and functionality over complex visual aesthetics, HTML, CSS, and JavaScript were the most efficient technologies to use.

## Blockchain Integration with React

While the core functionalities were built with standard web technologies, we recognized that *securing votes in a tamper-proof manner* required additional layers of security. This is where *React* came into play.

- *React* was specifically chosen for its ability to handle dynamic state management and its integration with *blockchain* technologies, which ensure secure, immutable vote records. 
- This *React-Blockchain combination* adds a cryptographic layer to the voting system, ensuring that votes cannot be tampered with, thus enhancing the integrity of the election process.

In summary, React was leveraged only for the parts of the system that required more sophisticated, secure handling—specifically, blockchain integration for vote storage.

## Setup Instructions

### Prerequisites

Make sure you have the following installed:
- Python (for Flask and OpenCV)
- Node.js
- MongoDB

*Images*
---
![image](https://github.com/user-attachments/assets/e4f7cd54-2112-4e88-af47-d915c52c13b3)
![image](https://github.com/user-attachments/assets/d4e0cf76-f4bf-4e1b-ad65-30912328bb9c)
![image](https://github.com/user-attachments/assets/05bf4464-25fa-4f90-8544-edb49f5bee0c)
![image](https://github.com/user-attachments/assets/39743d82-c9b6-483f-86c7-93196f0355c0)

### Installation Steps

1. *Clone the repository*:
   bash
   git clone https://github.com/AbdussamiQazi/SendNodes_DisabledVoting.git
   

2. *Navigate into the project directory*:
   bash
   cd SendNodes_DisabledVoting
   

3. *Install the required dependencies for Flask and OpenCV*:
   bash
   pip install Flask opencv-python
   

4. *Install Node.js dependencies*:
   bash
   npm install
   

5. *Start the MongoDB server* (if it's not already running):
   bash
   mongod
   

6. *Run the Flask application*:
   bash
   python app.py
   

7. *Run the Node.js server*:
   bash
   nodemon server.js
   

8. *Open your browser and visit*:
   bash
   http://localhost:5000
   

## Usage

1. Upon loading the homepage, the text-to-speech feature will automatically read out the voting instructions.
2. Select your preferred candidate from the options or use the speech command feature.
3. Facial recognition will be triggered to verify the voter’s identity.
4. Users can view nearby voting booths with accessibility information provided via the Google Maps API.
5. Once your vote is cast, it will be securely stored in the MongoDB database.

### Speech Commands (Optional)
If the speech recognition feature is enabled, users can say the name of their preferred candidate to cast their vote.

## Contributing

If you would like to contribute to this project:
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This revised README now emphasizes your technology choices and provides a smooth explanation of the system's components and functionality. Let me know if you'd like to make any further adjustments!
