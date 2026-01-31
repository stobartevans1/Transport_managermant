const express = require('express');
const router = express.Router();
const Ride = require('./../Model/RideModel'); // Create a similar schema for Rides

// Add a New Ride
// Pages/rideRoutes.js

router.post('/add-ride', async (req, res) => {
  try {
    // 1. Added vehicleNo to the destructuring list
    const { empId, vehicleType, vehicleNo, source, destination, rideTime, seats } = req.body;

    // Convert string → Date
    const rideDateObj = parseDDMMYYYYHHMM(rideTime);

    if (isNaN(rideDateObj.getTime())) {
      return res.status(400).json({ msg: 'Invalid rideTime format' });
    }

    // Only allow today
    const rideDate = rideDateObj.toDateString();
    const today = new Date().toDateString();

    if (rideDate !== today) {
      return res.status(400).json({ msg: 'You can only book rides for today.' });
    }

    // 2. Added vehicleNo to the new Ride object
    const newRide = new Ride({
      empId,
      vehicleType,
      vehicleNo,
      source,
      destination,
      rideTime,
      seats,
    });

    await newRide.save();
    res.status(201).json({ msg: 'Ride added successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function parseDDMMYYYYHHMM(dateStr) {
  const [datePart, timePart] = dateStr.split(' ');
  const [dd, mm, yyyy] = datePart.split('/').map(Number);
  const [hh, min] = timePart.split(':').map(Number);

  return new Date(yyyy, mm - 1, dd, hh, min);
}

// Pick a Ride (With Time Matching +/- 60 mins)
router.get('/available-rides', async (req, res) => {
  try {
    const { preferredTime, vehicleType } = req.query;
    const prefDate = new Date(preferredTime);

    // Calculate buffer times
    const minTime = new Date(prefDate.getTime() - 60 * 60000);
    const maxTime = new Date(prefDate.getTime() + 60 * 60000);

    let query = {
      rideTime: { $gte: minTime, $lte: maxTime },
    };

    if (vehicleType) query.vehicleType = vehicleType;

    const rides = await User.find(query);
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pages/rideRoutes.js
router.get('/all', async (req, res) => {
  try {
    // Fetch only today's rides to optimize performance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rides = await Ride.find({ rideTime: { $gte: today } });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
