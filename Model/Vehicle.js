const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  vehicleNo: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate vehicle registrations
    uppercase: true,
  },
  contactNo: { type: String, required: true },
  vehicleSeats: { type: Number, required: true },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Bike', 'Car'],
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
