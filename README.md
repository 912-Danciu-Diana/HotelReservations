# Hotels API Documentation

This document provides an overview of the Hotels API, detailing the available endpoints and their functionalities.

## API Endpoints

### 1. Get All Hotels

- **Endpoint:** `GET /`
- **Description:** Retrieves a list of all hotels.
- **Response:** JSON array of all hotels.

### 2. Get Nearby Hotels

- **Endpoint:** `GET /nearby`
- **Description:** Fetches hotels within a specified radius based on the user's IP-derived geographical location.
- **Query Parameters:**
  - `radius` (float): Radius in kilometers.
- **Response:** JSON array of hotels within the specified radius.

### 3. Get Available Rooms

- **Endpoint:** `GET /:id`
- **Description:** Returns available rooms for a specific hotel.
- **Path Parameters:**
  - `id` (integer): Hotel ID.
- **Response:** JSON array of available rooms, including room number, type, and price.

### 4. Book a Room

- **Endpoint:** `POST /:id/book`
- **Description:** Books a specific room in a hotel.
- **Path Parameters:**
  - `id` (integer): Hotel ID.
- **Request Body:**
  - `roomNumber` (integer)
  - `startDate` (string): YYYY-MM-DD
  - `endDate` (string): YYYY-MM-DD
- **Response:** Confirmation message of booking.

### 5. Change Room Reservation

- **Endpoint:** `POST /:id/changeRoom`
- **Description:** Allows changing of a booked room to another room at the same hotel.
- **Path Parameters:**
  - `id` (integer): Hotel ID.
- **Request Body:**
  - `oldRoomNumber` (integer)
  - `newRoomNumber` (integer)
- **Response:** Confirmation message of the reservation change.

### 6. Cancel a Room Reservation

- **Endpoint:** `POST /:id/cancel`
- **Description:** Cancels a room reservation.
- **Path Parameters:**
  - `id` (integer): Hotel ID.
- **Request Body:**
  - `roomNumber` (integer)
- **Response:** Confirmation message of cancellation.

### 7. Leave Feedback for a Hotel

- **Endpoint:** `POST /:id/feedback`
- **Description:** Submits feedback for a specific hotel.
- **Path Parameters:**
  - `id` (integer): Hotel ID.
- **Request Body:** Feedback object.
- **Response:** Confirmation message of feedback submission.

## Usage

To use the API, clone this repository, run `npm install` to install all necessary dependencies and run `node index.js` to start the server.

## Note

All endpoints are designed to handle asynchronous operations and error scenarios, ensuring robustness and reliability.

