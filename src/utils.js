const axios = require('axios');
var fs = require('fs');
const { DateTime } = require('luxon');
const { Fernet } = require('fernet-nodejs');


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

//Data Encryption using Fernet
const encryptData = (data) => {
    const message = JSON.stringify(data);
    const ciphertext = Fernet.encrypt(message, key);
    return { "ciphertext": ciphertext };
};

const unauthError = (url) => ({
    timestamp: timestamp,
    statusCode: 401,
    error: 'Unauthorized',
    url,
});

//Data Decryption using Fernet
const decryptData = (ciphertext) => {
    const jsonString = Fernet.decrypt(ciphertext, key);
    return JSON.parse(jsonString);
};

module.exports = {
    axios,
    fs,
    Fernet,
    key,
    baseUrl,
    timestamp,
    encryptData,
    decryptData, 
    unauthError,
}