const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const functions = require("firebase-functions");
require("dotenv").config();

const authRoutes = require("./Pages/authRoutes");
const rideRoutes = require("./Pages/rideRoutes");
const vehicleRoutes = require("./Pages/vehicleRoutes");

const app = express();

/* Middleware */
app.use(cors({ origin: true }));
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/vehicles", vehicleRoutes);

/* MongoDB (connect once) */
let mongoConnected = false;

async function connectMongo() {
  if (mongoConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  mongoConnected = true;
  console.log("✅ MongoDB Connected");
}

app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

/* Test route */
app.get("/", (req, res) => {
  res.send("🚀 Transport API is live");
});

/* EXPORT — NO app.listen() */
exports.api = functions.https.onRequest(app);
