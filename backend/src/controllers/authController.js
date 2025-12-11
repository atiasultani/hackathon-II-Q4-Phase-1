const AuthService = require('../services/authService');
const User = require('../models/User');
const logger = require('../utils/logger');

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

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
      logger.error(`Registration error: ${error.message}`);
      if (error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }
  }

  // Login user
  static async login(req, res) {
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
      logger.error(`Login error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
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
      logger.error(`Profile error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { firstName, lastName } = req.body;

      const profileData = {};
      if (firstName) profileData.firstName = firstName;
      if (lastName) profileData.lastName = lastName;

      if (Object.keys(profileData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No fields to update'
        });
      }

      const updatedUser = await User.updateProfile(userId, profileData);
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      logger.error(`Update profile error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Logout (client-side token invalidation)
  static async logout(req, res) {
    try {
      // In a real application, you might add the token to a blacklist
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;