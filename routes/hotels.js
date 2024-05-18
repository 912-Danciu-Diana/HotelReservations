const express = require('express');
const router = express.Router();
const path = require('path');
const geolib = require('geolib');
const {readDataFromFile, writeDataToFile, getPublicIp, getCoordinatesFromIp} = require('../utils/utils.js')

const HOTEL_PATH = path.join(__dirname, '../data/hotels.json');

// Get all hotels
router.get('/', async (req, res) => {    
    const allHotels = readDataFromFile(HOTEL_PATH);
    res.json(allHotels);
});

// Get hotels within a certain radius
router.get('/nearby', async (req, res) => {
    const ip = await getPublicIp();
    const userCoordinates = await getCoordinatesFromIp(ip);
    const radius = parseFloat(req.query.radius);
    const allHotels = readDataFromFile(HOTEL_PATH);
    const nearbyHotels = allHotels.filter(hotel =>
        geolib.isPointWithinRadius(
            { latitude: hotel.latitude, longitude: hotel.longitude },
            userCoordinates,
            radius * 1000
        )
    );
    res.json(nearbyHotels);
});

// Get available rooms of specific hotel
router.get('/:id', (req, res) => {
    const allHotels = readDataFromFile(HOTEL_PATH);
    const hotel = allHotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
    }

    let availableRooms = hotel.rooms.filter(r => r.isAvailable);
    availableRooms = availableRooms.map(r => { return {roomNumber: r.roomNumber, type: r.type, price: r.price}})
    res.json(availableRooms);
});

// Book a room
router.post('/:id/book', (req, res) => {
    const { roomNumber, startDate, endDate } = req.body;
    const allHotels = readDataFromFile(HOTEL_PATH);
    
    const hotel = allHotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
    }
    
    const room = hotel.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) {
        return res.status(400).json({ error: 'Room does not exist' });
    }

    if (!room.isAvailable) {
        return res.status(400).json({ error: 'Room not available' });
    }

    if (new Date(startDate) > new Date(endDate) || new Date(startDate).getTime() > new Date(endDate).getTime()) {
        return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    room.isAvailable = false
    room.appointment = {startDate , endDate}

    writeDataToFile(allHotels, HOTEL_PATH);
    res.json({ message: `Room #${room.roomNumber} booked successfully` });
});

// Change the booked room
router.post('/:id/changeRoom', (req, res) => {
    const { oldRoomNumber, newRoomNumber } = req.body;
    const allHotels = readDataFromFile(HOTEL_PATH);
    const hotel = allHotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
    }
    const oldRoom = hotel.rooms.find(r => r.roomNumber === oldRoomNumber && !r.isAvailable);
    if (!oldRoom) {
        return res.status(400).json({ error: 'Room not booked' });
    }

    const newRoom = hotel.rooms.find(r => r.roomNumber === newRoomNumber && r.isAvailable);
    if (!newRoom) {
        return res.status(400).json({ error: 'Room not available' });
    }

    const appointment = oldRoom.appointment;
    newRoom.appointment = appointment;

    delete oldRoom.appointment;
    oldRoom.isAvailable = true;
    newRoom.isAvailable = false;

    writeDataToFile(allHotels, HOTEL_PATH);
    res.json({ message: 'Reservation changed successfully' });
});

// Cancel a room reservation
router.post('/:id/cancel', (req, res) => {
    const { roomNumber } = req.body;
    const allHotels = readDataFromFile(HOTEL_PATH);
    const hotel = allHotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
    }
    const room = hotel.rooms.find(r => r.roomNumber === roomNumber && !r.isAvailable);
    if (!room) {
        return res.status(400).json({ error: 'Room not booked' });
    }
    
    if (new Date() > new Date(room.appointment.start).getTime() - 2) {
        return res.status(400).json({ error: 'You cannot cancel a reservation now' });
    }

    room.isAvailable = true;
    delete room.appointment;
    writeDataToFile(allHotels, HOTEL_PATH);
    res.json({ message: 'Reservation cancelled successfully' });
});

// Leave feedback for a hotel
router.post('/:id/feedback', (req, res) => {
    const feedback = req.body;
    const allHotels = readDataFromFile(HOTEL_PATH);
    const hotel = allHotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
    }

    hotel.feedback = hotel.feedback || [];
    hotel.feedback.push(feedback);
    writeDataToFile(allHotels, HOTEL_PATH);
    res.json({ message: 'Feedback submitted successfully' });
});

module.exports = router;
