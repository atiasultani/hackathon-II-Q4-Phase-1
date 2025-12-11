const TaskService = require('../services/taskService');
const logger = require('../utils/logger');

class TaskController {
  // Create a new task
  static async createTask(req, res) {
    try {
      const userId = req.user.id;
      const taskData = req.body;

      // Validate required fields
      if (!taskData.title || taskData.title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Task title is required'
        });
      }

      const task = await TaskService.createTask(userId, taskData);

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error(`Error in createTask: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all tasks for the authenticated user
  static async getUserTasks(req, res) {
    try {
      const userId = req.user.id;
      const { status, priority, dueDate, limit, offset } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (dueDate) filters.dueDate = dueDate;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const tasks = await TaskService.getUserTasks(userId, filters);

      res.status(200).json({
        success: true,
        data: {
          tasks,
          pagination: {
            limit: parseInt(limit) || null,
            offset: parseInt(offset) || null
          }
        }
      });
    } catch (error) {
      logger.error(`Error in getUserTasks: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get a specific task
  static async getTaskById(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;

      const task = await TaskService.getTaskById(taskId, userId);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error(`Error in getTaskById: ${error.message}`);
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }
  }

  // Update a task
  static async updateTask(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const updateData = req.body;

      const task = await TaskService.updateTask(taskId, userId, updateData);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error(`Error in updateTask: ${error.message}`);
      if (error.message.includes('not found') || error.message.includes('Task list not found')) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    }
  }

  // Update task status (complete/incomplete)
  static async updateTaskStatus(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const { completed } = req.body;

      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Completed field must be a boolean'
        });
      }

      const task = await TaskService.updateTaskStatus(taskId, userId, completed);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error(`Error in updateTaskStatus: ${error.message}`);
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }
  }

  // Delete a task
  static async deleteTask(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;

      await TaskService.deleteTask(taskId, userId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      logger.error(`Error in deleteTask: ${error.message}`);
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }
  }
}

module.exports = TaskController;