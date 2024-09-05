const axios = require('axios');
const path = require("path");
var fs = require('fs');
const { DateTime } = require('luxon');
const { Fernet } = require('fernet-nodejs');
const dhakaTimeZone = 'Asia/Dhaka';


const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;
//const liveUrl = process.env.LIVE_URL;

// Dhaka time zone (Asia/Dhaka)
const formattedTimestamp = () => {
    const currentTimestamp = DateTime.utc();
    const dhakaTimestamp = currentTimestamp.setZone('Asia/Dhaka');
    return dhakaTimestamp.toISO({ includeOffset: true });
};

const timestamp = formattedTimestamp();

const unauthError = (url) => ({
    timestamp: timestamp,
    statusCode: 401,
    error: 'Unauthorized',
    url,
});

/*
//Log File Name
const todayLogFileName = () =>{
    const now = DateTime.now().setZone(dhakaTimeZone);
    const filePrefix = now.toFormat('yyyyMMdd');
    const fileName = `${filePrefix}_app.log`;
    return fileName;
};

const logFileName = todayLogFileName ();
*/

//Log File Name
const todayFilePath = () =>{
    const now = DateTime.now().setZone(dhakaTimeZone);
    const filePrefix = now.toFormat('yyyyMMdd');
    const fileName = `${filePrefix}_app.log`;
    const folderPath = `./logs`;
    return filePath = path.join(folderPath, fileName);
};

const logFilePath = todayFilePath ();

function createLogFileIfMissing() {
    //const logFileName = todayLogFileName();
    console.log(logFilePath);
    //const folderPath = `./logs`;
    //const logFilePath = path.join(folderPath, logFileName);

    // Check if the log file exists
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Log file doesn't exist, create it
            fs.writeFile(logFilePath, '', (err) => {
                if (err) {
                    console.error('Error creating log file:', err);
                } else {
                    console.log('Log file created:', logFilePath);
                }
            });
        } else {
            console.log('Log file already exists:', logFilePath);
        }
    });
}

//Data Encryption using Fernet
const encryptData = (data) => {
    const message = JSON.stringify(data);
    const ciphertext = Fernet.encrypt(message, key);
    return { "ciphertext": ciphertext };
};

//Data Decryption using Fernet
const decryptData = (ciphertext) => {
    const jsonString = Fernet.decrypt(ciphertext, key);
    return JSON.parse(jsonString);
};


module.exports = {
    axios,
    fs,
    key,
    baseUrl,
    timestamp,
    logFilePath,
    unauthError,
    createLogFileIfMissing,
    encryptData,
    decryptData,     
}