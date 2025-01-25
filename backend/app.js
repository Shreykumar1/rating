const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const CollegeRating = require('./models/CollegeRating');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic Routes
app.get('/api/colleges', async (req, res) => {
  try {
    const colleges = await CollegeRating.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/colleges', async (req, res) => {
  try {
    const newCollege = new CollegeRating(req.body);
    const savedCollege = await newCollege.save();
    res.status(201).json(savedCollege);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});  

app.get('/api/colleges/:id', async (req, res) => {
  try {
    const college = await CollegeRating.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/colleges/:id/ratings', async (req, res) => {
  try {
    const college = await CollegeRating.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    const { academicQuality, campusLife, facilities, facultyQuality, jobPlacement, comment } = req.body;

    // Update the ratings using weighted average
    const currentRatingsCount = college.reviews.length;
    const newWeight = 1 / (currentRatingsCount + 1);
    const oldWeight = currentRatingsCount / (currentRatingsCount + 1);

    college.ratings = {
      academicQuality: (college.ratings.academicQuality * oldWeight) + (academicQuality * newWeight),
      campusLife: (college.ratings.campusLife * oldWeight) + (campusLife * newWeight),
      facilities: (college.ratings.facilities * oldWeight) + (facilities * newWeight),
      facultyQuality: (college.ratings.facultyQuality * oldWeight) + (facultyQuality * newWeight),
      jobPlacement: (college.ratings.jobPlacement * oldWeight) + (jobPlacement * newWeight)
    };

    // Calculate and update the overall rating
    college.overallRating = (
      college.ratings.academicQuality +
      college.ratings.campusLife +
      college.ratings.facilities +
      college.ratings.facultyQuality +
      college.ratings.jobPlacement
    ) / 5;

    // Add the new review
    college.reviews.push({
      userId: req.body.userId,
      comment,
      date: new Date()
    });

    // Save the updated college
    await college.save();

    res.status(200).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use('/api/users', userRoutes);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});