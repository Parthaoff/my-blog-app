// backend/index.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// IMPORT ROUTES
const blogRoutes = require("./routes/blogs");
const authRoutes = require("./routes/auth");

const app = express();

/* ================= CORS FIX (VERY IMPORTANT) ================= */

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://my-blog-46xxvajv3-parthaoffs-projects.vercel.app" // YOUR VERCEL FRONTEND
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman or server-to-server requests
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS policy blocked this origin: " + origin), false);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

// Blog routes
app.use("/api/blogs", blogRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Blog API is running 🚀");
});

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("DB Connection Error:", err));

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
