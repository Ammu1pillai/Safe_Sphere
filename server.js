// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8021;

// Middleware
app.use(cors());
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Anjita', // Replace with your MySQL username
    password: 'Ammu@1SMHS', // Replace with your MySQL password
    database: 'womensafety' // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Define the API endpoint for submitting trip details
app.post('/api/submit-trip', (req, res) => {
    const { destination, exitTime, arrivalTime } = req.body;

    // Validate input
    if (!destination || !exitTime || !arrivalTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert trip details into the database
    const query = 'INSERT INTO trips (destination, exit_time, arrival_time) VALUES (?, ?, ?)';
    db.query(query, [destination, exitTime, arrivalTime], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to submit trip details' });
        }
        res.status(200).json({ message: 'Trip details submitted successfully', id: results.insertId });
    });
});

// Define the API endpoint for sending SOS alerts
app.post('/api/sos', (req, res) => {
    const { latitude, longitude } = req.body;

    // Here you can handle the SOS alert logic, e.g., save to the database or notify contacts
    console.log('SOS alert received:', { latitude, longitude });
    res.status(200).json({ message: 'SOS alert received successfully' });
});

// Define the API endpoint for notifying that the user reached home
app.post('/api/reached-home', (req, res) => {
    const { status } = req.body;

    // Here you can handle the home notification logic
    console.log('User  reached home:', status);
    res.status(200).json({ message: 'Home notification received successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
