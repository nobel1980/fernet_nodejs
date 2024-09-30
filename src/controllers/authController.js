const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath, errorText, errorTextToCode, timeout } = require('../utils');

/** 1. BIN Sign in */
const signIn = async (req, res) => {
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    console.log(jsonData);
    const RequestType = `BIN login`;
    const url = `${baseUrl}/auth/signin`;
    const headers = { 'Content-Type': 'application/json' };
    //console.log('Log path check:',logFilePath);
    try {
        const response = await axios.post(url, jsonData, {
            headers,
            timeout
        });
        
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
        if (error.response) {
            
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                timestamp: timestamp,
                status: error.response.status,
                url,
                response: error.response.data
            }) + '\n');

            const encryptedErrResponse = encryptData(error.response.data);
            res.json(encryptedErrResponse);
          } else if (error.request) {
             const statusCode = error.code;
             const errorCode = errorTextToCode(statusCode);
            const errorMessage = errorText(errorCode);
            
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                timestamp: timestamp,
                status: errorCode,
                url,
                Message: errorMessage
            }) + '\n');

            const errorRuquest = {
                timestamp: timestamp,
                statusCode: errorCode,
                error: errorMessage,
                url,
            };

            const encryptedErrResponse = encryptData(errorRuquest);
            res.json(encryptedErrResponse);
          } else {
            const errorResponse = {
                timestamp: timestamp,
                status : 500,
                error: "Internal Server Error",
                url
            };
    
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                response: errorResponse
            }) + '\n');
            
            //res.status(500).json(errorResponse);
            const encryptedErrResponse = encryptData(errorResponse);
            res.json(encryptedErrResponse);
          }        
    }
};

/** 2. Validate OTP */
const validateOTP = async (req, res) => {
    const {ciphertext} = req.body;
    const jsonData = decryptData(ciphertext);
    const RequestType = `OTP`;
    const url = `${baseUrl}/auth/validateOtp`;
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

        const encryptedResponse = encryptData(response.data);
        res.json(encryptedResponse);
    } catch (error) {
        if (error.response) {
            
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                timestamp: timestamp,
                status: error.response.status,
                url,
                response: error.response.data
            }) + '\n');

            const encryptedErrResponse = encryptData(error.response.data);
            res.json(encryptedErrResponse);
          } else if (error.request) {
             const statusCode = error.code;
             const errorCode = errorTextToCode(statusCode);
            const errorMessage = errorText(errorCode);
            
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                timestamp: timestamp,
                status: errorCode,
                url,
                Message: errorMessage
            }) + '\n');

            const errorRuquest = {
                timestamp: timestamp,
                statusCode: errorCode,
                error: errorMessage,
                url,
            };

            const encryptedErrResponse = encryptData(errorRuquest);
            res.json(encryptedErrResponse);
          } else {
            const errorResponse = {
                timestamp: timestamp,
                status : 500,
                error: "Internal Server Error",
                url
            };
    
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                response: errorResponse
            }) + '\n');
            
            //res.status(500).json(errorResponse);
            const encryptedErrResponse = encryptData(errorResponse);
            res.json(encryptedErrResponse);
          }        
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

    } catch (error) {
        if (error.response) {
            
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                timestamp: timestamp,
                status: error.response.status,
                url,
                response: error.response.data
            }) + '\n');

            const encryptedErrResponse = encryptData(error.response.data);
            res.json(encryptedErrResponse);
          } else if (error.request) {
             const statusCode = error.code;
             const errorCode = errorTextToCode(statusCode);
            const errorMessage = errorText(errorCode);
            
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                timestamp: timestamp,
                status: errorCode,
                url,
                Message: errorMessage
            }) + '\n');

            const errorRuquest = {
                timestamp: timestamp,
                statusCode: errorCode,
                error: errorMessage,
                url,
            };

            const encryptedErrResponse = encryptData(errorRuquest);
            res.json(encryptedErrResponse);
          } else {
            const errorResponse = {
                timestamp: timestamp,
                status : 500,
                error: "Internal Server Error",
                url
            };
    
            fs.appendFileSync(logFilePath, JSON.stringify({ 
                RequestType,
                response: errorResponse
            }) + '\n');
            
            //res.status(500).json(errorResponse);
            const encryptedErrResponse = encryptData(errorResponse);
            res.json(encryptedErrResponse);
          }        
    }
};

module.exports = {
    signIn,
    validateOTP,
    refreshToken
};