require('dotenv').config();

const express = require('express');
const path = require("path");
const fs = require('fs');
const cron = require('node-cron');
const { DateTime } = require('luxon');
const winston = require('winston');

const { logFilePath, createLogFileIfMissing, encryptData, decryptData,} = require('./utils');

const app = express();

const dhakaTimeZone = 'Asia/Dhaka';
const { logFileName,timestamp } = require('./utils');

// Import route files
const authRoutes = require('./routes/authRoutes');
const invoicesRoutes = require('./routes/invoicesRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const taxpayersRoutes = require('./routes/taxpayersRoutes');
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
app.use('/api/reports', reportsRoutes);
app.use('/api/taxpayers', taxpayersRoutes);
app.use('/api/crypto', cryptoRoutes);

/*
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    const requestedUrl = req.url || 'Unknown URL';
    const errorResponse = `{"timestamp": "${formattedTimestamp}", "status": 500, "error": "Internal Server Error", "url" : "${requestedUrl}" }\n`;
    fs.appendFileSync('app.log', errorResponse);
    const parsedErrorResponse = JSON.parse(errorResponse);
    res.status(500).json(parsedErrorResponse);
});

*/

app.use((req, res, next) => {
    const errorResponse = {
        timestamp: timestamp,
        status: 404,
        error: "Not Found",
        url : req.originalUrl
    };

    fs.appendFileSync(logFilePath, JSON.stringify({ 
        RequestType: 'Request',
        response: errorResponse
    }) + '\n');

    const encryptedErrResponse = encryptData(errorResponse);
    res.json(encryptedErrResponse);
});


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

createLogFileIfMissing();

app.get("/", function(req, res) {
    // Add any desired functionality for the homepage
    res.send("NBR TAX Middleware Homepage");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});