const axios = require('axios');
var fs = require('fs');
const { formattedTimestamp } = require('../utils');
const baseUrl = process.env.BASE_URL;

// Function to get devices by Server system date
const getSysdateDevices = async (req, res) => {   
    const authToken = req.headers['authorization'];
    const RequestType = `Server System Date`;
    const url = `${baseUrl}/inventory/devices/sysdate`;
    if (!authToken) {
        const errorResponse = {
            timestamp: formattedTimestamp,
            statusCode: 401,
            error: 'Unauthorized',
            url,
        };
        fs.appendFileSync('app.log', JSON.stringify({ 
            RequestType,
            response: 'Internal Server Error'
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

// Function to get all devices
const getAllDevices = (req, res) => {
    // Logic to fetch all devices
    // Return the list of all devices in the response
    res.json({ devices: ['Device1', 'Device2', 'Device3', 'Device4'] });
};

// Function to get device DTO by device number
const getDeviceDTOByNumber = (req, res) => {
    const deviceNumber = req.params.deviceNumber;
    // Logic to fetch device DTO based on the device number
    // Return the device DTO in the response
    res.json({ deviceDTO: { deviceNumber, description: 'Device Description' } });
};

// Function to get device by device number
const getDeviceByNumber = (req, res) => {
    const deviceNumber = req.params.deviceNumber;
    // Logic to fetch device details based on the device number
    // Return the device details in the response
    res.json({ device: { deviceNumber, name: 'Device Name' } });
};

// Function to get device status by device ID
const getDeviceStatusById = (req, res) => {
    const deviceId = req.params.deviceId;
    // Logic to fetch device status based on the device ID
    // Return the device status in the response
    res.json({ status: 'Active' });
};

module.exports = {
    getSysdateDevices,
    getAllDevices,
    getDeviceDTOByNumber,
    getDeviceByNumber,
    getDeviceStatusById
};