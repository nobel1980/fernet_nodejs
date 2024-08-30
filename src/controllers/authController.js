const axios = require('axios');
var fs = require('fs');
const { Fernet } = require('fernet-nodejs');
const { formattedTimestamp } = require('../utils');
const { request } = require('http');

const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;

/** 1. BIN Sign in */
const signIn = async (req, res) => {
    const data = req.body;
    const message = JSON.stringify(data);
    const ciphertext = Fernet.encrypt(message, key);
    const jsonData = JSON.stringify({ "ciphertext": ciphertext });
    const url = `${baseUrl}/auth/signin`;

    try {
        const response = await axios.post(url, jsonData, {
            headers: { 'Content-Type': 'application/json' }
        });

        fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login", "timestamp": "${formattedTimestamp}", "status": ${response.status}, "url" : "${url}", "request" : ${jsonData},"response" : ${JSON.stringify(response.data)}}\n`);
        const ciphertext = response.data.ciphertext;
        const jsonString = Fernet.decrypt(ciphertext, key);
        const real_text = JSON.parse(jsonString);
        res.json(real_text);
    } catch (error) {               
        const errorResponse = `{"timestamp": "${formattedTimestamp}", "status": 401, "error": "Unauthorized", "url" : "${url}"}\n`;
        fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login",  "request" : "${jsonData}","response" : ${errorResponse}}\n`);
        //fs.appendFileSync('app.log', errorResponse);
        const parsedErrorResponse = JSON.parse(errorResponse);
        res.status(500).json(parsedErrorResponse);
    }
        
};

/** 2. Validate OTP */
const validateOTP = async (req, res) => {
    const authToken = req.headers['authorization'];
    const RequestType = `OTP`;
    const url = `${baseUrl}/auth/validate-otp`;
    if (!authToken) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url,
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: 'Unauthorized'
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
};

/** 3. Refresh Token  */
const refreshToken = async (req, res) => {
    const data = req.body;
    const message = JSON.stringify(data);
    const ciphertext = Fernet.encrypt(message, key);
    const jsonData = JSON.stringify({ "ciphertext": ciphertext });
    console.log(jsonData);
    const authToken = req.headers['authorization'];
    const RequestType = `Refresh Token`;
    const url = `${baseUrl}/auth/refreshtoken`;
    if (!authToken) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url,
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: 'Unauthorized'
        }) + '\n');
        return res.status(401).json(errorResponse);
    }

    const token = authToken.split(' ')[1];
    
    try {
        const response = await axios.post(url, jsonData, {
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
            request: jsonData,
            response: response.data
        }) + '\n');

        const ciphertext = response.data.ciphertext;
        const jsonString = Fernet.decrypt(ciphertext, key);
        const real_text = JSON.parse(jsonString);
        res.json(real_text);
        //res.json(response.data);
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
};

module.exports = {
    signIn,
    validateOTP,
    refreshToken
};