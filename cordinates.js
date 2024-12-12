// const fetch = require('node-fetch');
const express = require("express");
const User = require("./app/models/user.model");
const app = express();
const router = express.Router();

// Handle POST request
const geocode = async (req, res) => {
  const { address } = req.body.location;

  try {
    // Make the API request to get the coordinates
    const apiKey = 'AIzaSyD_OJ6ZNE-W5gGTe859FyKCmW383uHEMYY';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the latitude and longitude from the response
    const { lat, lng } = data.results[0].geometry.location;

    // // Create a new location document using Mongoose
    // const location = new Location({
    //   address: address,
    //   latitude: lat,
    //   longitude: lng
    // });

    // // Save the location to the database
    // await location.save();

    // // Send a success response


    res.status(200).json({ lat, lng });
  } catch (error) {
    console.error('Error:', error);
    // Send an error response
    res.status(500).json({ error: 'An error occurred while saving the location.' });
  }
};


// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const userDistance = async(req, res) =>{
  try {
    const { userId1, userId2 } = req.query;

    const user = User.find({ _id: { $in: [userId1, userId2] } });

    if(user.length < 2){
      return res.status(200).json({ msg: "Users not found!" });
    };

    const user1 = user[0];
    const user2  = user[1];

    
    const { latitude: lat1, longitude: lon1 } = user1.coordinates;
    const { latitude: lat2, longitude: lon2 } = user2.coordinates;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    res.json({ distance });
  } catch (error) {
    res.status(404).json("Error occured while calculating distance!");
  }
}

// // Example usage:
// const user1Lat = 40.7128; // Latitude of user 1
// const user1Lon = -74.0060; // Longitude of user 1

// const user2Lat = 34.0522; // Latitude of user 2
// const user2Lon = -118.2437; // Longitude of user 2

// const distance = calculateDistance(user1Lat, user1Lon, user2Lat, user2Lon);
// console.log('Distance:', distance.toFixed(2), 'km');

module.exports = { geocode, router }