Online Voting System

# Overview

The Online Voting System is a secure and modern web application designed to facilitate fair and transparent elections. It incorporates advanced security measures to prevent fraudulent activities, such as IP blacklisting, device fingerprinting, VPN detection, and reCAPTCHA v3 integration. These features ensure that only legitimate users can participate in the voting process, while automated bots and malicious actors are effectively blocked.

This system is ideal for organizations, institutions, or communities looking to conduct online elections with integrity and trust.
Key Features

    IP Blacklisting :
        Prevents users from voting multiple times by blocking suspicious or flagged IP addresses.
        Administrators can maintain a blacklist of restricted IPs.


    Device Fingerprinting :
        Identifies and tracks devices based on unique attributes (e.g., browser type, screen resolution, installed fonts).
        Ensures that each user can only vote once per device.


    VPN Detection :
        Detects and blocks votes originating from Virtual Private Networks (VPNs) to prevent anonymity-based fraud.


    reCAPTCHA v3 Integration :
        Uses Google's reCAPTCHA v3 to analyze user behavior and assign a score indicating the likelihood of bot activity.
        Automatically prevents automated voting attempts without interrupting the user experience.


    User-Friendly Interface :
        Provides a seamless and intuitive interface for both voters and administrators.


    Secure Authentication :
        Implements robust authentication mechanisms to protect user accounts and data.


    Real-Time Results :
        Displays live voting results to authorized users (e.g., administrators).



# Technologies Used

    Frontend :
        React.js (with Vite for fast builds)
        React Router (for client-side routing)
        Material-UI / TailwindCSS (for styling and UI components)
        reCAPTCHA v3 (for bot prevention)


    Backend :
        Node.js with Express.js (for API handling)
        MongoDB (database for storing votes, user data, and configurations)
        JWT (JSON Web Tokens for secure authentication)


    Security Features :
        IP blacklisting (using middleware)
        Device fingerprinting (via libraries like fingerprintjs)
        VPN detection (using third-party APIs or custom logic)
        reCAPTCHA v3 (integrated with Google's API)


    Hosting and Deployment :
        Frontend: Vercel
        Backend: Render or any Node.js-compatible hosting platform
        Database: MongoDB Atlas


Installation and Setup
Prerequisites

    Node.js (v18 or higher)
    npm or yarn
    MongoDB Atlas account (or a local MongoDB instance)
    Google reCAPTCHA v3 API keys


Steps to Run Locally

    Clone the Repository :
    git clone https://github.com/kass8mal8/Online-Voting.git
    cd Online-Voting

Install Dependencies :

# For the frontend

cd ./normal_client
npm install --legacy-peer-deps

# For the backend

cd ./node_backend
npm install

Set Up Environment Variables :

    Create a .env file in the server directory and add the following variables:
    env

    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    RECAPTCHA_SECRET_KEY=<your_recaptcha_v3_secret_key>


Run the Application :

    Start the backend server:
    cd ./node_backend
    npm run dev


    Start the frontend development server:
    cd ./normal_client
    npm run dev

    Access the Application :
        Open your browser and navigate to http://localhost:5173 (frontend).
        The backend API will be available at http://localhost:5000.


# Security Measures Explained

    IP Blacklisting :
        A list of restricted IP addresses is maintained in the database.
        Incoming requests are checked against this list before processing votes.


    Device Fingerprinting :
        Each device is assigned a unique identifier based on its characteristics.
        This identifier is stored in the database to prevent duplicate votes.


    VPN Detection :
        Third-party APIs (e.g., IPStack or IPInfo) are used to detect requests originating from VPNs.
        Alternatively, custom logic can analyze IP metadata to identify proxies.


    reCAPTCHA v3 :
        Google's reCAPTCHA v3 assigns a score (0.0 to 1.0) to each request.
        Requests with low scores are flagged as potential bot activity.

# Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

    Fork the repository.
    Create a new branch (git checkout -b feature/your-feature-name).
    Commit your changes (git commit -m "Add a new feature").
    Push to the branch (git push origin feature/your-feature-name).
    Open a pull request.

For questions, feedback, or collaboration opportunities, feel free to reach out:

    Email : kassimaly21@gmail.com
    GitHub : kass8mal8
    LinkedIn : Your LinkedIn Profile

