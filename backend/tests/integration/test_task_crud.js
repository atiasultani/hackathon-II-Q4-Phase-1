const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

describe('Integration Tests for Task CRUD Operations', () => {
  let authToken;
  let testUserId;

  // Setup: Create a user and get auth token
  beforeAll(async () => {
    // Register a test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'integration-test@example.com',
        password: 'testpassword123',
        firstName: 'Integration',
        lastName: 'Test'
      });

    testUserId = registerResponse.body.data.user.id;

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'integration-test@example.com',
        password: 'testpassword123'
      });

    authToken = loginResponse.body.data.token;
  });

  describe('Complete Task Workflow', () => {
    let createdTaskId;

    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Integration Test Task',
          description: 'This is a task for integration testing',
          priority: 'medium',
          dueDate: '2024-12-31T23:59:59.000Z'
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Integration Test Task');
      expect(response.body.data.description).toBe('This is a task for integration testing');
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.priority).toBe('medium');

      createdTaskId = response.body.data.id;
    });

    it('should retrieve the created task', async () => {
      const response = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', createdTaskId);
      expect(response.body.data.title).toBe('Integration Test Task');
    });

    it('should update the task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Integration Test Task',
          description: 'Updated description for integration testing',
          priority: 'high'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', createdTaskId);
      expect(response.body.data.title).toBe('Updated Integration Test Task');
      expect(response.body.data.description).toBe('Updated description for integration testing');
      expect(response.body.data.priority).toBe('high');
    });

    it('should mark the task as complete', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', createdTaskId);
      expect(response.body.data.status).toBe('completed');
    });

    it('should retrieve all tasks and include the updated one', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('tasks');
      expect(Array.isArray(response.body.data.tasks)).toBe(true);

      const task = response.body.data.tasks.find(t => t.id === createdTaskId);
      expect(task).toBeDefined();
      expect(task.status).toBe('completed');
    });

    it('should delete the task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('should not find the deleted task', async () => {
      const response = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Task Validation', () => {
    it('should reject task creation with empty title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Empty title should fail
          description: 'A task with empty title'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('title');
    });

    it('should reject task with invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Invalid Priority Task',
          priority: 'invalid_priority' // Should be low, medium, or high
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});