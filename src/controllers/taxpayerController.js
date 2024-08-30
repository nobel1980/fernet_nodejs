const axios = require('axios');
var fs = require('fs');
const { Fernet } = require('fernet-nodejs');
const {formattedTimestamp } = require('../utils');

const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;

// Function to get bin setup for a specific bin number
const getBinSetup = (req, res) => {
    const binNumber = req.params.binNumber;
    // Logic to fetch and return the bin setup data for the given bin number
    res.send(`Getting setup for bin number: ${binNumber}`);
};

// Function to get the status for a specific bin number
const getBinStatus = (req, res) => {
    const binNumber = req.params.binNumber;
    // Logic to fetch and return the status for the given bin number
    res.send(`Getting status for bin number: ${binNumber}`);
};

module.exports = {
    getBinSetup,
    getBinStatus
};