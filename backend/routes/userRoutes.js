const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser
} = require('../controllers/userController');
const User = require('../models/User');

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email and password' 
        });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      
      // Check if user exists
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
  
      // Direct password comparison instead of bcrypt
      if (password !== user.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
  
      // Success - you might want to generate a JWT token here
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: user
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };

// Routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id/reviews', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('reviews');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/reviews', async (req, res) => {
  try {
    const { userId, comment, rating } = req.body; // Expecting rating in the request body
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.reviews.push({ userId, comment, rating }); // Add the new review
    await user.save();

    res.status(200).json({ message: 'Review added successfully', reviews: user.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 