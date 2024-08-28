require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require("path");
const fs = require('fs');
const cron = require('node-cron');
const { DateTime } = require('luxon');
//import bodyParser from 'body-parser';
const { Fernet } = require('fernet-nodejs');

// initialize an Express application
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.disable('x-powered-by');

// Dhaka time zone (Asia/Dhaka)
const dhakaTimeZone = 'Asia/Dhaka';
const currentTimestamp = DateTime.utc();
const dhakaTimestamp = currentTimestamp.setZone('Asia/Dhaka');
const formattedTimestamp = dhakaTimestamp.toISO({ includeOffset: true });

const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;
//const liveUrl = process.env.LIVE_URL;

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

// Middleware function
const customMiddleware = (req, res, next) => {
    console.log('This is a custom middleware function');
    next();
};

// Using the middleware function
app.use(customMiddleware);

app.get("/", function(req, res) {
    // Add any desired functionality for the homepage
    res.send("NBR TAX Middleware Homepage");
});

//1. Sign In (NBR Admin / Binholder)
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
                fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login", "timestamp": "${formattedTimestamp}", "status": ${response.status}, "url" : "${url}", "request" : ${ jsonData },"response" : ${JSON.stringify(response.data)}}\n`);
                res.json(response.data);
            })
            .catch(error => {
                const errorResponse = `{"timestamp": "${formattedTimestamp}", "status": 401, "error": "Unauthorized", "url" : "${url}"}`;
                fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login",  "request" : ${ jsonData },"response" : ${errorResponse}}\n`);
                const perseErrorRespose = JSON.parse(errorResponse);
                res.status(401).json(perseErrorRespose);
            });
    } catch (error) {
        console.error(error);
        //res.status(400).json({ error: 'Invalid encrypted data' });
        const errorResponse = `{ "timestamp": "${formattedTimestamp}", "status": "500", "error": "Internal Server Error", "url" : "${url}" }\n`;
        fs.appendFileSync('app.log', errorResponse);
        const perseErrorRespose = JSON.parse(errorResponse);
        res.status(500).json(perseErrorRespose);
    }
});

/**4. GET ALL POLICIES AS LIST */
app.get('/api/settings/policies/dto', async (req, res) => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url: `${baseUrl}/settings/policies/dto`
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType: 'Get Policy List',
            response: 'Internal Server Error'
        }) + '\n');
        return res.status(401).json(errorResponse);
    }

    const token = authToken.split(' ')[1];
    const url = `${baseUrl}/settings/policies/dto`;

    try {
        const response = await axios.get(url, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType: 'Get Policy List',
            timestamp: formattedTimestamp,
            status: response.status,
            url,
            response: response.data
        }) + '\n');

        res.json(response.data);
    } catch (error) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            status : 500,
            error: 'Internal Server Error',
            url
        };

        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType: 'Get Policy List',
            response: errorResponse
        }) + '\n');

        res.status(500).json(errorResponse);
    }
});
/**End 4 - Policy List */

/** 5. GET SERVER DATE TIME Started */
app.get('/api/inventory/devices/sysdate', async (req, res) => {
    const authToken = req.headers['authorization'];
    const url = `${baseUrl}/inventory/devices/sysdate`;
    const RequestType = 'Get Server Date Time';
    if (!authToken) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: 'Internal Server Error'
        }) + '\n');
        return res.status(401).json(errorResponse);
    }

    const token = authToken.split(' ')[1];

    try {
        const response = await axios.get(url, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            timestamp: formattedTimestamp,
            status: response.status,
            url,
            response: response.data
        }) + '\n');

        res.json(response.data);
    } catch (error) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            status : 500,
            error: 'Internal Server Error',
            url
        };

        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: errorResponse
        }) + '\n');

        res.status(500).json(errorResponse);
    }
});
/** 5. GET SERVER DATE TIME Ended */

/** 14. GET NEW INVOICE IDs FOR CREATING NEWINVOICES Started */
app.post('/api/invoices/bulk', async (req, res) => {
    const authToken = req.headers['authorization'];
    const url = `${baseUrl}/invoices/bulk`;
    const RequestType = 'Bulk Invoice';

    if (!authToken) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: 'Internal Server Error'
        }) + '\n');
        return res.status(401).json(errorResponse);
    }

    const token = authToken.split(' ')[1];

    try {
        const response = await axios.post(url, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            timestamp: formattedTimestamp,
            status: response.status,
            url,
            response: response.data
        }) + '\n');

        res.json(response.data);
    } catch (error) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            status : 500,
            error: 'Internal Server Error',
            url
        };

        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: errorResponse
        }) + '\n');

        res.status(500).json(errorResponse);
    }
});
/** 14. GET NEW INVOICE IDs FOR CREATING NEW INVOICES Ended */

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