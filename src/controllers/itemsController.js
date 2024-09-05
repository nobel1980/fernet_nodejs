const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath } = require('../utils');

/** 11. Item create */
const createItem = async (req, res) => {
    const data = req.body;
    const jsonData = JSON.stringify(data);
    const authToken = req.headers['authorization'];
    const RequestType = `Create Item`;
    const url = `${baseUrl}/items/create`;

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

        res.json(response.data);
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

        res.status(500).json(errorResponse);
    }
};

// Function to handle editing an item
const editItem = async (req, res) => {
    const itemId = req.params.itemId; 
    const data = req.body;
    const jsonData = JSON.stringify(data);
    const authToken = req.headers['authorization'];
    const RequestType = `Edit Item`;
    const url = `${baseUrl}/items/${itemId}`;

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
        const response = await axios.put(url, jsonData, {
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

        res.status(500).json(errorResponse);
    }
};

// 13. BIN wise Item
const getItemsByBinHolder = async (req, res) => {
    const binHolder = req.params.binHolder; 
    const authToken = req.headers['authorization'];
    const RequestType = `BIN Items`;
    const url = `${baseUrl}/items/${binHolder}/bin`;

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

        res.status(500).json(errorResponse);
    }
};

module.exports = {
    createItem,
    editItem,
    getItemsByBinHolder
};