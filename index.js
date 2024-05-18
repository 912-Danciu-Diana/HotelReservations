const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Basic ExpressJS setup
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const hotels = require('./routes/hotels');
app.use('/hotels', hotels);

const PORT = process.env.PORT || 5000;

// Start app on port 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});