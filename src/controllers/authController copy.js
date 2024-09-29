const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath, errorText } = require('../utils');

/** 1. BIN Sign in */
const signIn = async (req, res) => {
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    const RequestType = `BIN login`;
    const url = `${baseUrl}/auth/signin`;
    const headers = { 'Content-Type': 'application/json' };
    const timeout = 5000;
    //console.log('Log path check:',logFilePath);
    try {
        const response = await axios.post(url, jsonData, {
            headers,
            timeout
        });

        //fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login", "timestamp": "${timestamp}", "status": ${response.status}, "url" : "${url}", "request" : ${JSON.stringify(jsonData)},"response" : ${JSON.stringify(response.data)}}\n`);
        
        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType,
            timestamp: timestamp,
            status: response.status,
            url,
            response: response.data
        }) + '\n');

        const encryptedResponse = encryptData(response.data);
        res.json(encryptedResponse);        
    } catch (error) {
        console.log(error);
        //const errorResponse = `{"timestamp": "${timestamp}", "status": 401, "error": "Unauthorized", "url" : "${url}"}\n`;
        
        const errorResponse = {
            timestamp: timestamp,
            status : 401,
            error: 'Unauthorized',
            url
        };
        fs.appendFileSync(logFilePath, `{"RequestType": "Setup/BIN holder Login",  "request" : ${JSON.stringify(jsonData)},"response" : ${errorResponse}}\n`);

        const encryptedErrResponse = encryptData(errorResponse);
        res.json(encryptedErrResponse);
    }
};

/** 2. Validate OTP */
const validateOTP = async (req, res) => {
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    console.log(jsonData);
    const RequestType = `OTP`;
    const url = `${baseUrl}/auth/validateOtp`;
    //console.log(jsonData);
    try {
        const response = await axios.post(url, jsonData, {
            headers: { 
                'Content-Type': 'application/json',
            }
        });

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType,
            timestamp: timestamp,
            status: response.status,
            url,
            response: response.data
        }) + '\n');

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            const errorCode = error.response.status;
            const errorMessage = errorText(errorCode);
            console.log(errorMessage);
          } else if (error.request) {
            // The request was made, but no response was received
            console.log('No response received:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error:', error.message);
          }
          
        //console.log(error);
        const errorResponse = {
            timestamp: timestamp,
            //status : errorCode,
            //error: errorMessage,
            url
        };

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType,
            response: errorResponse
        }) + '\n');
        
        res.status(500).json(errorResponse);
    }
};

/** 3. Refresh Token  */
const refreshToken = async (req, res) => {
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    const authToken = req.headers['authorization'];
    const RequestType = `Refresh Token`;
    const url = `${baseUrl}/auth/refreshtoken`;
    if (!authToken) {
        const errorResponse = unauthError(url);

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType,
            response: errorResponse,
        }) + '\n');
        const encryptedErrResponse = encryptData(errorResponse);
        return res.status(401).json(encryptedErrResponse);
    }

    const token = authToken.split(' ')[1];
    
    try {
        const response = await axios.post(url, jsonData, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType,
            timestamp: timestamp,
            status: response.status,
            url,
            request: jsonData,
            response: response.data
        }) + '\n');

        //fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login", "timestamp": "${timestamp}", "status": ${response.status}, "url" : "${url}", "request" : ${JSON.stringify(jsonData)},"response" : ${JSON.stringify(response.data)}}\n`);
        const encryptedResponse = encryptData(response.data);
        res.json(encryptedResponse);

        //res.json(response.data);
    } catch (error) {
        const errorResponse = {
            timestamp: timestamp,
            status : 500,
            error: 'Internal Server Error',
            url
        };

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType,
            response: errorResponse
        }) + '\n');
        const encryptedErrResponse = encryptData(errorResponse);
        res.status(500).json(encryptedErrResponse);
    }
};

module.exports = {
    signIn,
    validateOTP,
    refreshToken
};