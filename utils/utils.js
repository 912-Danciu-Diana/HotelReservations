const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Read data from JSON
const readDataFromFile = (path) => {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
};

// Write data to JSON
const writeDataToFile = (data, path) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// Get public IPv4v IP Address of clent usinig ipify free API
const getPublicIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching public IP:', error);
        throw error;
    }
};

// Get coordinates of an IP Address using ip-api free API
const getCoordinatesFromIp = async (ip) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const { lat, lon } = response.data
        return { latitude: lat, longitude: lon };
    } catch (error) {
        console.error('Error fetching user coordinates:', error);
        throw error;
    }
};

module.exports = {readDataFromFile, writeDataToFile, getPublicIp, getCoordinatesFromIp}