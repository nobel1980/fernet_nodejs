const {axios, fs, timestamp, baseUrl, encryptData, decryptData } = require('../utils');

/** 1. BIN Sign in */
const signIn = async (req, res) => {
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    const RequestType = `BIN login`;
    const url = `${baseUrl}/auth/signin`;

    try {
        const response = await axios.post(url, jsonData, {
            headers: { 'Content-Type': 'application/json' }
        });

        //fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login", "timestamp": "${timestamp}", "status": ${response.status}, "url" : "${url}", "request" : ${JSON.stringify(jsonData)},"response" : ${JSON.stringify(response.data)}}\n`);
        
        fs.appendFileSync('app.log', JSON.stringify({ 
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
        fs.appendFileSync('app.log', `{"RequestType": "Setup/BIN holder Login",  "request" : ${JSON.stringify(jsonData)},"response" : ${errorResponse}}\n`);
        //fs.appendFileSync('app.log', errorResponse);

        const encryptedErrResponse = encryptData(errorResponse);
        res.json(encryptedErrResponse);

        //const parsedErrorResponse = JSON.parse(errorResponse);
        //res.status(500).json(parsedErrorResponse);
    }
};

/** 2. Validate OTP */
const validateOTP = async (req, res) => {
    const authToken = req.headers['authorization'];
    console.log(authToken);
    const RequestType = `OTP`;
    const url = `${baseUrl}/auth/validateOtp`;
    if (!authToken) {
        const errorResponse = {
            timestamp: timestamp,
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
            timestamp: timestamp,
            status: response.status,
            url,
            response: response.data
        }) + '\n');

        res.json(response.data);
    } catch (error) {
        console.log(error);
        const errorResponse = {
            timestamp: timestamp,
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
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    const authToken = req.headers['authorization'];
    const RequestType = `Refresh Token`;
    const url = `${baseUrl}/auth/refreshtoken`;
    if (!authToken) {
        const errorResponse = {
            timestamp: timestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url,
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: 'Unauthorized'
        }) + '\n');

        const encryptedErrResponse = encryptData(errorResponse);
        //res.status(500).json(encryptedErrResponse);
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

        fs.appendFileSync('app.log', JSON.stringify({ 
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

        fs.appendFileSync('app.log', JSON.stringify({ 
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