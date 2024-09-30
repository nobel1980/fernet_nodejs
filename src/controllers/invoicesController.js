const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath, errorText, errorTextToCode, timeout } = require('../utils');

/** 14. Bulk invoice */
const bulkInvoices = async (req, res) => {
    const { ciphertext } = req.body;
    let jsonData;

    try {
        jsonData = decryptData(ciphertext);
    } catch (decryptError) {
        const errorResponse = {
            timestamp: timestamp,
            status: 400,
            error: "Invalid ciphertext or decryption error",
            url : req.originalUrl
        };

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType: 'Decryption Error',
            response: errorResponse
        }) + '\n');
        
        const encryptedErrResponse = encryptData(errorResponse);
        return res.status(400).json(encryptedErrResponse);
    }

    const authToken = req.headers['authorization'];
    const RequestType = `Bulk Invoice`;
    const url = `${baseUrl}/invoices/bulk`;
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
/** 15. Create invoice */
const createInvoice = async (req, res) => {
    const { ciphertext } = req.body;
    let jsonData;

    try {
        jsonData = decryptData(ciphertext);
        console.log(jsonData);
    } catch (decryptError) {
        const errorResponse = {
            timestamp: timestamp,
            status: 400,
            error: "Invalid ciphertext or decryption error",
            url : req.originalUrl
        };

        fs.appendFileSync(logFilePath, JSON.stringify({ 
            RequestType: 'Decryption Error',
            response: errorResponse
        }) + '\n');
        
        const encryptedErrResponse = encryptData(errorResponse);
        return res.status(400).json(encryptedErrResponse);
    }

    const authToken = req.headers['authorization'];
    const RequestType = `Create Invoice`;
    const url = `${baseUrl}/invoices/create`;

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

/** 19. invoice items */
const getInvoiceItems = async (req, res) => {
    const invoiceNumber = req.params.invoiceNumber;  
    const authToken = req.headers['authorization'];
    const RequestType = `Invoice Items`;
    const url = `${baseUrl}/invoices/items/${invoiceNumber}`;

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

module.exports = {
    bulkInvoices,
    createInvoice,
    getInvoiceItems,
};