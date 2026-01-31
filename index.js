const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const functions = require('firebase-functions');
const authRoutes = require('./Pages/authRoutes');
const rideRoutes = require('./Pages/rideRoutes');
const vehicleRoutes = require('./Pages/vehicleRoutes');

const app = express();
const allowedOrigins = ['http://localhost:4200'];

app.use(cors({
  origin: true, // allow all (safe for now)
  credentials: true,
}));


app.use(express.json());

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/vehicles', vehicleRoutes);

/* Mongo + server */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

exports.api = functions.https.onRequest(app);
