const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath, errorText, errorTextToCode } = require('../utils');

/** 10 . Bin Holder outlet setup */
const getBinSetup = async (req, res) => {
    const binNumber = req.params.binNumber; 
    const authToken = req.headers['authorization'];
    const RequestType = `BIN holder outlet setup`;
    const url = `${baseUrl}/taxpayers/setup/outlets/${binNumber}/bin`;

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

//** 17. Taxpayer BIN status */
const getBinStatus = async (req, res) => {
    const binNumber = req.params.binNumber; 
    const authToken = req.headers['authorization'];
    const RequestType = `Taxpayer BIN Status`;
    const url = `${baseUrl}/taxpayers/status/${binNumber}/bin`;

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
    getBinSetup,
    getBinStatus
};