const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleNo: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  rideTime: { type: Date, required: true },
  seats: { type: Number, required: true },
  status: { type: String, default: 'Available' }
});

module.exports = mongoose.model('Ride', RideSchema);