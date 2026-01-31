const express = require('express');
const router = express.Router();
const Vehicle = require('./../Model/Vehicle'); // Path to your
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    const { driverName, vehicleNo, contactNo, vehicleSeats, vehicleType, password } = req.body;

    // 1. Check if vehicle number already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNo });
    if (existingVehicle) {
      return res.status(400).json({ msg: 'This vehicle is already registered.' });
    }

    // 2. Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate Custom EMPID (e.g., DEL-1001)
    // We count existing documents to determine the next ID
    const vehicleCount = await Vehicle.countDocuments();
    const generatedEmpId = `DEL-${1001 + vehicleCount}`;

    // 4. Create and Save
    const newVehicle = new Vehicle({
      driverName,
      vehicleNo,
      contactNo,
      vehicleSeats,
      vehicleType,
      password: hashedPassword, // Store the hashed version!
      registeredBy: generatedEmpId, // Use the generated ID to satisfy the Schema requirement
    });

    await newVehicle.save();

    res.status(201).json({
      msg: 'Vehicle registered successfully!',
      empId: generatedEmpId, // Return this so the user knows their ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// API: Login based on Mobile Number OR Vehicle Number
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // 'identifier' can be vehicleNo or contactNo

    // 1. Find vehicle by Vehicle Number OR Contact Number
    const vehicle = await Vehicle.findOne({
      $or: [{ vehicleNo: identifier.toUpperCase() }, { contactNo: identifier }],
    });

    if (!vehicle) {
      return res.status(400).json({ msg: 'Invalid Vehicle Number or Mobile Number' });
    }

    // 2. Compare Password
    const isMatch = await bcrypt.compare(password, vehicle.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Success (You could also generate a JWT token here)
    res.status(200).json({
      msg: 'Login successful!',
      vehicle: {
        driverName: vehicle.driverName,
        empId: vehicle.registeredBy,
        vehicleNo: vehicle.vehicleNo,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
