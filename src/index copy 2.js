require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require("path");
const fs = require('fs');
const cron = require('node-cron');
const { DateTime } = require('luxon');
//import bodyParser from 'body-parser';
const { Fernet } = require('fernet-nodejs');
const winston = require('winston');

// initialize an Express application
const app = express();

const dhakaTimeZone = 'Asia/Dhaka';
const {formattedTimestamp } = require('./utils');

// Import controller files
//const authController = require('./controllers/authController')(baseUrl);

// Import route files
const authRoutes = require('./routes/authRoutes');
const invoicesRoutes = require('./routes/invoicesRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.disable('x-powered-by');

//Controller mapping
//app.use('/api/auth', authController);

// Route mappings
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/crypto', cryptoRoutes);
/*
app.use((err, req, res, next) => {
    //console.error(err.stack);
    //res.status(500).send('Something broke!');
    const requestedUrl = req.url || 'Unknown URL';
    const errorResponse = `{"timestamp": "${formattedTimestamp}", "status": 500, "error": "Internal Server Error", "url" : "${requestedUrl}" }\n`;
    fs.appendFileSync('app.log', errorResponse);
    const parsedErrorResponse = JSON.parse(errorResponse);
    res.status(500).json(parsedErrorResponse);
});

*/

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  });
  try {
    // Code that may throw an error
    //throw new Error('Something went wrong');
  } catch (error) {
    logger.error('An error occurred:', error);
  }
// Schedule the task to run daily at 12:00 AM in Dhaka time zone
cron.schedule('0 0 * * *', () => {
    // Get the current date and time in Dhaka time zone
    const now = DateTime.now().setZone(dhakaTimeZone);

    const folderName = now.toFormat('yyyyMMdd');
    const folderPath = `./logs/${folderName}`;

    const logFileName = `${folderName}_app.log`;
    const logFilePath = path.join(folderPath, logFileName);

    // Create the folder
    fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating folder:', err);
        } else {
            console.log('Folder created:', folderPath);
        }
    });
    // Create the log file
    fs.writeFile(logFilePath, '', (err) => {
        if (err) {
            console.error('Error creating log file:', err);
        } else {
            console.log('Log file created:', logFilePath);
        }
    });

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [new winston.transports.Console()],
      });
      
    const fileTransport = new winston.transports.File({ filename: logFilePath });
    logger.add(fileTransport);
}, {
    timezone: dhakaTimeZone
});


app.get("/", function(req, res) {
    // Add any desired functionality for the homepage
    res.send("NBR TAX Middleware Homepage");
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});