const Task = require('../models/Task');
const TaskList = require('../models/TaskList');
const logger = require('../utils/logger');

class TaskService {
  // Create a new task
  static async createTask(userId, taskData) {
    try {
      // Validate required fields
      if (!taskData.title || taskData.title.trim().length === 0) {
        throw new Error('Task title is required');
      }

      // Validate priority if provided
      if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
        throw new Error('Priority must be low, medium, or high');
      }

      // If a task list ID is provided, verify it belongs to the user
      if (taskData.taskListId) {
        const taskList = await TaskList.findById(taskData.taskListId, userId);
        if (!taskList) {
          throw new Error('Task list not found or does not belong to user');
        }
      }

      const task = await Task.create({
        ...taskData,
        userId
      });

      logger.info(`Task created successfully: ${task.id} for user: ${userId}`);
      return task;
    } catch (error) {
      logger.error(`Error creating task for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Get all tasks for a user with optional filters
  static async getUserTasks(userId, filters = {}) {
    try {
      const tasks = await Task.findByUserId(userId, filters);
      logger.info(`Retrieved ${tasks.length} tasks for user: ${userId}`);
      return tasks;
    } catch (error) {
      logger.error(`Error retrieving tasks for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Get a specific task
  static async getTaskById(taskId, userId) {
    try {
      const task = await Task.findById(taskId, userId);
      if (!task) {
        throw new Error('Task not found or does not belong to user');
      }
      logger.info(`Retrieved task: ${taskId} for user: ${userId}`);
      return task;
    } catch (error) {
      logger.error(`Error retrieving task ${taskId} for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Update a task
  static async updateTask(taskId, userId, updateData) {
    try {
      // Validate priority if provided in update
      if (updateData.priority && !['low', 'medium', 'high'].includes(updateData.priority)) {
        throw new Error('Priority must be low, medium, or high');
      }

      // If a task list ID is provided, verify it belongs to the user
      if (updateData.taskListId) {
        const taskList = await TaskList.findById(updateData.taskListId, userId);
        if (!taskList) {
          throw new Error('Task list not found or does not belong to user');
        }
      }

      const task = await Task.update(taskId, userId, updateData);
      if (!task) {
        throw new Error('Task not found or does not belong to user');
      }

      logger.info(`Task updated successfully: ${taskId} for user: ${userId}`);
      return task;
    } catch (error) {
      logger.error(`Error updating task ${taskId} for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Update task status (complete/incomplete)
  static async updateTaskStatus(taskId, userId, completed) {
    try {
      const task = await Task.updateStatus(taskId, userId, completed);
      if (!task) {
        throw new Error('Task not found or does not belong to user');
      }

      logger.info(`Task status updated: ${taskId} to ${completed ? 'completed' : 'pending'} for user: ${userId}`);
      return task;
    } catch (error) {
      logger.error(`Error updating task status ${taskId} for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Delete a task
  static async deleteTask(taskId, userId) {
    try {
      const deleted = await Task.delete(taskId, userId);
      if (!deleted) {
        throw new Error('Task not found or does not belong to user');
      }

      logger.info(`Task deleted successfully: ${taskId} for user: ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting task ${taskId} for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Get tasks by status
  static async getTasksByStatus(userId, status) {
    try {
      const tasks = await Task.findByUserId(userId, { status });
      logger.info(`Retrieved ${tasks.length} tasks with status ${status} for user: ${userId}`);
      return tasks;
    } catch (error) {
      logger.error(`Error retrieving tasks by status ${status} for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Get tasks by priority
  static async getTasksByPriority(userId, priority) {
    try {
      const tasks = await Task.findByUserId(userId, { priority });
      logger.info(`Retrieved ${tasks.length} tasks with priority ${priority} for user: ${userId}`);
      return tasks;
    } catch (error) {
      logger.error(`Error retrieving tasks by priority ${priority} for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = TaskService;