const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class AuthService {
  // Register a new user
  static async registerUser(userData) {
    try {
      const { email, password, firstName, lastName } = userData;

      // Create user through the User model
      const user = await User.create({
        email,
        password,
        firstName,
        lastName
      });

      logger.info(`New user registered: ${user.id}`);
      return user;
    } catch (error) {
      logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  }

  // Authenticate user with email and password
  static async authenticateUser(email, password) {
    try {
      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return null;
      }

      // Compare password with stored hash
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return null;
      }

      logger.info(`User authenticated: ${user.id}`);
      return user;
    } catch (error) {
      logger.error(`Error authenticating user: ${error.message}`);
      throw error;
    }
  }

  // Generate JWT token for user
  static generateToken(user) {
    try {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret_key_for_development',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`JWT token generated for user: ${user.id}`);
      return token;
    } catch (error) {
      logger.error(`Error generating token: ${error.message}`);
      throw error;
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
      return decoded;
    } catch (error) {
      logger.error(`Error verifying token: ${error.message}`);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId, profileData) {
    try {
      const updatedUser = await User.updateProfile(userId, profileData);
      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info(`User profile updated: ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user profile: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AuthService;