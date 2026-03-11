// Import modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ============================
// MongoDB Connection
// ============================
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Database Error:", err));

// ============================
// Scholarship Schema
// ============================
const scholarshipSchema = new mongoose.Schema({
  name: String,
  country: String,
  course: String,
  amount: String,
  deadline: String,
  type: String,
  link: String
});

// Create Model
const Scholarship = mongoose.model("Scholarship", scholarshipSchema);

// ============================
// GET ALL SCHOLARSHIPS
// ============================
app.get("/api/scholarships", async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ error: "Server error retrieving scholarships" });
  }
});

// ============================
// SEARCH SCHOLARSHIPS
// ============================
app.get("/api/scholarships/search", async (req, res) => {

  try {

    const { country, course, keyword } = req.query;

    let query = {};

    if (country) {
      query.country = new RegExp(country, "i");
    }

    if (course) {
      query.course = new RegExp(course, "i");
    }

    if (keyword) {
      query.name = new RegExp(keyword, "i");
    }

    const scholarships = await Scholarship.find(query);

    res.status(200).json(scholarships);

  } catch (error) {
    res.status(500).json({ error: "Search error" });
  }

});

// ============================
// ADD NEW SCHOLARSHIP
// ============================
app.post("/api/scholarships", async (req, res) => {

  try {

    const newScholarship = new Scholarship({
      name: req.body.name,
      country: req.body.country,
      course: req.body.course,
      amount: req.body.amount,
      deadline: req.body.deadline,
      type: req.body.type,
      link: req.body.link
    });

    await newScholarship.save();

    res.status(200).json({
      message: "Scholarship added successfully",
      data: newScholarship
    });

  } catch (error) {
    res.status(500).json({ error: "Error adding scholarship" });
  }

});

// ============================
// 404 HANDLER
// ============================
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});