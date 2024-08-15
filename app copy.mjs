import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import axios from 'axios';
import fs from 'fs';
//import node-cron from 'node-cron';
import winston from 'winston';
import expressWinston from 'express-winston';
//import bodyParser from 'body-parser';
import { Fernet } from 'fernet-nodejs';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
// Middleware to log requests
app.use((req, res, next) => {
    const logMessage = `${req.method} ${req.url} ${req.body} ${res.send}`;
    logger.info(logMessage);
    next();
});

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'request.log' })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true
}));

app.disable('x-powered-by');

const currentTimestamp = new Date().toISOString();
const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;

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
    //console.log(data);
    try {
        axios.post(`${baseUrl}/auth/signin`, jsonData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(response => {
                fs.appendFileSync('app.log', `{ "timestamp": ${currentTimestamp}, "status_code": ${response.status}, "request" : ${ jsonData },"response" : ${JSON.stringify(response.data)} }\n`);
                res.json(response.data);
            })
            .catch(error => {
                console.error(error);
                fs.appendFileSync('app.log', `{ "timestamp": "${currentTimestamp}", "status_code": "500", "error": "An error occur" }\n`);
                res.status(500).json({ error: 'An error occurred while forwarding data' });
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