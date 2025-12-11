const { query } = require('../utils/database');
const bcrypt = require('bcrypt');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.passwordHash = userData.password_hash || userData.passwordHash;
    this.firstName = userData.first_name || userData.firstName;
    this.lastName = userData.last_name || userData.lastName;
    this.createdAt = userData.created_at || userData.createdAt;
    this.updatedAt = userData.updated_at || userData.updatedAt;
    this.lastLoginAt = userData.last_login_at || userData.lastLoginAt;
    this.isActive = userData.is_active || userData.isActive;
  }

  // Create a new user
  static async create(userData) {
    const { email, password, firstName, lastName } = userData;

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, created_at, updated_at`,
      [email, passwordHash, firstName, lastName]
    );

    return new User(result.rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, email, first_name, last_name, created_at, updated_at, last_login_at, is_active FROM users WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, created_at, updated_at, last_login_at, is_active FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }

  // Update user's last login time
  static async updateLastLogin(userId) {
    const result = await query(
      'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING id, email, first_name, last_name, created_at, updated_at, last_login_at',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    const { firstName, lastName } = profileData;
    const result = await query(
      `UPDATE users
       SET first_name = $1, last_name = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, first_name, last_name, created_at, updated_at`,
      [firstName, lastName, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }

  // Compare password with hash
  async comparePassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }
}

module.exports = User;