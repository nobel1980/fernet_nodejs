require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cron = require('node-cron');
const { DateTime } = require('luxon');
// Dhaka time zone (Asia/Dhaka)
const dhakaTimeZone = 'Asia/Dhaka';
//import bodyParser from 'body-parser';
const { Fernet } = require('fernet-nodejs');

//const currentTimestamp = new Date().toISOString();
const currentTimestamp = DateTime.utc();
const dhakaTimestamp = currentTimestamp.setZone('Asia/Dhaka');
const formattedTimestamp = dhakaTimestamp.toISO({ includeOffset: true });

const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.disable('x-powered-by');

// Schedule the task to run daily at 12:00 AM in Dhaka time zone
cron.schedule('0 0 * * *', () => {
    // Get the current date and time in Dhaka time zone
    const now = DateTime.now().setZone(dhakaTimeZone);

    const folderName = now.toFormat('yyyy-MM-dd');
    const folderPath = `./${folderName}`;

    // Create the folder
    fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating folder:', err);
        } else {
            console.log('Folder created:', folderPath);
        }
    });
}, {
    timezone: dhakaTimeZone
});

app.get("/", function(req, res) {
    // Add any desired functionality for the homepage
    res.send("NBR TAX Middleware Homepage");
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.post('/api/auth/signin', (req, res) => {
    const data = req.body;
    const jsonData = JSON.stringify(data);
    const url = `${baseUrl}/auth/signin`;
    //console.log(data);
    try {
        axios.post(url, jsonData, {
            headers: { 'Content-Type': 'application/json' }
          })
            .then(response => {
                fs.appendFileSync('app.log', `{ "RequestType": "Setup Login", "timestamp": "${formattedTimestamp}", "statusCode": ${response.status}, "url" : "${url}", "request" : ${ jsonData },"response" : ${JSON.stringify(response.data)}}`);
                res.json(response.data);
            })
            .catch(error => {
                console.error(error);
                const errorResponse = `{ "timestamp": "${formattedTimestamp}", "statusCode": "401", "error": "Unauthorized", "url" : "${url}" }`;
                fs.appendFileSync('app.log', errorResponse);
                const perseErrorRespose = JSON.parse(errorResponse);
                res.status(401).json(perseErrorRespose);
            });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid encrypted data' });
    }
});

app.post('/api/encrypt', (req, res) => {
    const data = req.body; 
    //const message = "This is a top secret message!";
    const message = JSON.stringify(data);
    const fernet = new Fernet(key);   
    //const f = new Fernet(key);
    
    const encryptedMessage = fernet.encrypt(message);
    console.log(encryptedMessage);

    res.send({ encryptedMessage });
});

app.post('/api/decrypt', (req, res) => {
    const {ciphertext} = req.body;

    //const message = "gAAAAABmvHDB5zKHvfbuIlvjI5JtdQZZtrXdhAAdeuh9R3y79P_Thtjhd5CWs2VRMkk7ORU7de5zebG3ec7SJUQZA9AnEM2glbve0tKcKhuTAv711xIqg8Gxf2zs3_c4iMu7Kv6GCin8";

    const jsonString = Fernet.decrypt(ciphertext, key);
    const real_text = JSON.parse(jsonString);
    console.log(real_text);
    res.send(real_text);
});

// Define an API route for viewing the logs
app.get('/logs', (req, res) => {

    // Query the logger for the latest log entries
    logger.query({ order: 'desc', limit: 100 },
        (err, results) => {
            if (err) {

                // If an error occurs, send an
                // error response
                res.status(500).send({ 
                    error: 'Error retrieving logs' 
                });
            } else {

                // If successful, send the log 
                // entries as a response
                res.send(results);
            }
        });
});


const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});