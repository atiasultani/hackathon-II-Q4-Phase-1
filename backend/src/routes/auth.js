const express = require('express');
const User = require('../models/User');
const AuthService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware for user data
const validateUserData = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  // Validate email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters long'
    });
  }

  // Validate optional fields
  if (firstName && (typeof firstName !== 'string' || firstName.length > 50)) {
    return res.status(400).json({
      success: false,
      error: 'First name must be a string of 50 characters or less'
    });
  }

  if (lastName && (typeof lastName !== 'string' || lastName.length > 50)) {
    return res.status(400).json({
      success: false,
      error: 'Last name must be a string of 50 characters or less'
    });
  }

  next();
};

// POST /api/auth/register - Register a new user
router.post('/register', validateUserData, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create new user
    const user = await AuthService.registerUser({
      email,
      password,
      firstName,
      lastName
    });

    // Generate JWT token
    const token = AuthService.generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/login - Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Authenticate user
    const user = await AuthService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login time
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = AuthService.generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/auth/profile - Get authenticated user's profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/logout - Logout (client-side token invalidation)
router.post('/logout', authenticateToken, (req, res) => {
  // In a real application, you might add the token to a blacklist
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;