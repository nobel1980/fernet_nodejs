const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath, errorText, errorTextToCode } = require('../utils');

// Function to create a new invoice
const getPolicyList = async (req, res) => {
    const authToken = req.headers['authorization'];
    const RequestType = `Get Policy List`;
    const url = `${baseUrl}/settings/policies/dto`;

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
        const response = await axios.get(url, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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

// Function to all service category
const serviceCategory = async (req, res) => {
    const authToken = req.headers['authorization'];
    const RequestType = `Get Service Category List`;
    const url = `${baseUrl}/settings/service/categories/all`;
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
        const response = await axios.get(url, {
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
module.exports = {
    getPolicyList,
    serviceCategory,
};
