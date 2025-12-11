const express = require('express');
const TaskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authenticateToken);

// Validation middleware for task data
const validateTaskData = (req, res, next) => {
  const { title, description, priority, dueDate } = req.body;

  // Validate title for create and update operations
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Title must be a string between 1 and 200 characters'
      });
    }
  }

  // Validate description
  if (description && (typeof description !== 'string' || description.length > 1000)) {
    return res.status(400).json({
      success: false,
      error: 'Description must be a string of 1000 characters or less'
    });
  }

  // Validate priority
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      success: false,
      error: 'Priority must be one of: low, medium, high'
    });
  }

  // Validate dueDate format if provided
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Due date must be a valid date format'
      });
    }
  }

  next();
};

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', TaskController.getUserTasks);

// POST /api/tasks - Create a new task
router.post('/', validateTaskData, TaskController.createTask);

// GET /api/tasks/:id - Get a specific task
router.get('/:id', TaskController.getTaskById);

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateTaskData, TaskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', TaskController.deleteTask);

// PATCH /api/tasks/:id/complete - Mark task as complete/incomplete
router.patch('/:id/complete', TaskController.updateTaskStatus);

module.exports = router;