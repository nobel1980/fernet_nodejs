const {axios, fs, timestamp, baseUrl, encryptData, decryptData, logFilePath } = require('../utils');

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
    getPolicyList,
    serviceCategory,
};
