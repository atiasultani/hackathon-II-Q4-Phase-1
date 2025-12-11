const { query } = require('../utils/database');

class TaskList {
  constructor(taskListData) {
    this.id = taskListData.id;
    this.name = taskListData.name;
    this.description = taskListData.description;
    this.userId = taskListData.user_id || taskListData.userId;
    this.createdAt = taskListData.created_at || taskListData.createdAt;
    this.updatedAt = taskListData.updated_at || taskListData.updatedAt;
    this.isDefault = taskListData.is_default || taskListData.isDefault;
  }

  // Create a new task list
  static async create(taskListData) {
    const { name, description, userId, isDefault = false } = taskListData;

    // If this is a default list, we need to make sure the user doesn't already have one
    if (isDefault) {
      await query(
        `UPDATE task_lists
         SET is_default = false
         WHERE user_id = $1 AND is_default = true`,
        [userId]
      );
    }

    const result = await query(
      `INSERT INTO task_lists (name, description, user_id, is_default)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, user_id, created_at, updated_at, is_default`,
      [name, description, userId, isDefault]
    );

    return new TaskList(result.rows[0]);
  }

  // Find task list by ID
  static async findById(id, userId) {
    const result = await query(
      `SELECT id, name, description, user_id, created_at, updated_at, is_default
       FROM task_lists
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new TaskList(result.rows[0]);
  }

  // Find all task lists for a user
  static async findByUserId(userId) {
    const result = await query(
      `SELECT id, name, description, user_id, created_at, updated_at, is_default
       FROM task_lists
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map(row => new TaskList(row));
  }

  // Find user's default task list
  static async findDefaultByUserId(userId) {
    const result = await query(
      `SELECT id, name, description, user_id, created_at, updated_at, is_default
       FROM task_lists
       WHERE user_id = $1 AND is_default = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new TaskList(result.rows[0]);
  }

  // Update a task list
  static async update(id, userId, updateData) {
    const allowedFields = ['name', 'description'];
    const updateFields = [];
    const queryParams = [];
    let paramCount = 3;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        queryParams.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add updated_at
    updateFields.push(`updated_at = NOW()`);

    queryParams.unshift(id, userId); // Add id and userId at the beginning

    const queryText = `UPDATE task_lists SET ${updateFields.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING id, name, description, user_id, created_at, updated_at, is_default`;

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return null;
    }

    return new TaskList(result.rows[0]);
  }

  // Set as default task list
  static async setAsDefault(id, userId) {
    // First, unset any existing default list for this user
    await query(
      `UPDATE task_lists
       SET is_default = false
       WHERE user_id = $1 AND is_default = true`,
      [userId]
    );

    // Then set the specified list as default
    const result = await query(
      `UPDATE task_lists
       SET is_default = true, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, name, description, user_id, created_at, updated_at, is_default`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new TaskList(result.rows[0]);
  }

  // Delete a task list
  static async delete(id, userId) {
    const result = await query(
      'DELETE FROM task_lists WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    return result.rows.length > 0;
  }
}

module.exports = TaskList;