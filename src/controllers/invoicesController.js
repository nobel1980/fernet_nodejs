const axios = require('axios');
var fs = require('fs');
const { formattedTimestamp } = require('../utils');
const baseUrl = process.env.BASE_URL;

/** 14. Bulk invoice */
const bulkInvoices = async (req, res) => {
    const data = req.body;
    const jsonData = JSON.stringify(data);
    const authToken = req.headers['authorization'];
    const RequestType = `Bulk Invoice`;
    const url = `${baseUrl}/invoices/bulk`;
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

/** 15. Create invoice */
const createInvoice = async (req, res) => {
    const data = req.body;
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    const authToken = req.headers['authorization'];
    const RequestType = `Create Invoice`;
    const url = `${baseUrl}/invoices/create`;

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

/** 19. invoice items */
const getInvoiceItems = async (req, res) => {
    const invoiceNumber = req.params.invoiceNumber;  
    const authToken = req.headers['authorization'];
    const RequestType = `Invoice Items`;
    const url = `${baseUrl}/invoices/items/${invoiceNumber}`;

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
module.exports = {
    bulkInvoices,
    createInvoice,
    getInvoiceItems,
};