const { query } = require('../utils/database');

class Task {
  constructor(taskData) {
    this.id = taskData.id;
    this.title = taskData.title;
    this.description = taskData.description;
    this.status = taskData.status;
    this.priority = taskData.priority;
    this.dueDate = taskData.due_date || taskData.dueDate;
    this.createdAt = taskData.created_at || taskData.createdAt;
    this.updatedAt = taskData.updated_at || taskData.updatedAt;
    this.completedAt = taskData.completed_at || taskData.completedAt;
    this.userId = taskData.user_id || taskData.userId;
    this.taskListId = taskData.task_list_id || taskData.taskListId;
  }

  // Create a new task
  static async create(taskData) {
    const { title, description, userId, priority = 'medium', dueDate, taskListId } = taskData;

    const result = await query(
      `INSERT INTO tasks (title, description, status, priority, due_date, user_id, task_list_id)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6)
       RETURNING id, title, description, status, priority, due_date, created_at, updated_at, user_id, task_list_id`,
      [title, description, priority, dueDate, userId, taskListId]
    );

    return new Task(result.rows[0]);
  }

  // Find task by ID
  static async findById(id, userId) {
    const result = await query(
      `SELECT id, title, description, status, priority, due_date, created_at, updated_at, completed_at, user_id, task_list_id
       FROM tasks
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new Task(result.rows[0]);
  }

  // Find all tasks for a user
  static async findByUserId(userId, filters = {}) {
    let queryText = `SELECT id, title, description, status, priority, due_date, created_at, updated_at, completed_at, user_id, task_list_id
                     FROM tasks
                     WHERE user_id = $1`;
    const queryParams = [userId];
    let paramCount = 2;

    // Add filters if provided
    if (filters.status) {
      queryText += ` AND status = $${paramCount}`;
      queryParams.push(filters.status);
      paramCount++;
    }

    if (filters.priority) {
      queryText += ` AND priority = $${paramCount}`;
      queryParams.push(filters.priority);
      paramCount++;
    }

    if (filters.dueDate) {
      queryText += ` AND due_date = $${paramCount}`;
      queryParams.push(filters.dueDate);
      paramCount++;
    }

    // Add sorting
    queryText += ' ORDER BY created_at DESC';

    // Add pagination if needed
    if (filters.limit) {
      queryText += ` LIMIT $${paramCount}`;
      queryParams.push(parseInt(filters.limit));
      paramCount++;
    }

    if (filters.offset) {
      queryText += ` OFFSET $${paramCount}`;
      queryParams.push(parseInt(filters.offset));
    }

    const result = await query(queryText, queryParams);
    return result.rows.map(row => new Task(row));
  }

  // Update a task
  static async update(id, userId, updateData) {
    const allowedFields = ['title', 'description', 'status', 'priority', 'due_date', 'task_list_id'];
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

    const queryText = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING id, title, description, status, priority, due_date, created_at, updated_at, completed_at, user_id, task_list_id`;

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return null;
    }

    return new Task(result.rows[0]);
  }

  // Mark task as complete or incomplete
  static async updateStatus(id, userId, completed) {
    const status = completed ? 'completed' : 'pending';
    const completedAt = completed ? 'NOW()' : null;

    let queryText, queryParams;
    if (completed) {
      queryText = `UPDATE tasks SET status = $3, completed_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING id, title, description, status, priority, due_date, created_at, updated_at, completed_at, user_id, task_list_id`;
      queryParams = [id, userId, status];
    } else {
      queryText = `UPDATE tasks SET status = $3, completed_at = NULL, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING id, title, description, status, priority, due_date, created_at, updated_at, completed_at, user_id, task_list_id`;
      queryParams = [id, userId, status];
    }

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return null;
    }

    return new Task(result.rows[0]);
  }

  // Delete a task
  static async delete(id, userId) {
    const result = await query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    return result.rows.length > 0;
  }
}

module.exports = Task;