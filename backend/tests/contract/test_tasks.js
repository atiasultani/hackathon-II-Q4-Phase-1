const request = require('supertest');
const app = require('../../src/app'); // Adjust path to your main app file

describe('Contract Tests for /tasks endpoints', () => {
  let authToken;
  let testUserId;

  // Setup: Create a user and get auth token
  beforeAll(async () => {
    // Register a test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

    testUserId = registerResponse.body.data.user.id;

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword123'
      });

    authToken = loginResponse.body.data.token;
  });

  describe('GET /api/tasks', () => {
    it('should return 200 and an array of tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('tasks');
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 and the created task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(newTask.title);
      expect(response.body.data.description).toBe(newTask.description);
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.priority).toBe(newTask.priority);
    });

    it('should return 400 for invalid input', async () => {
      const invalidTask = {
        title: '', // Empty title should fail validation
        priority: 'invalid_priority'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId;

    // Create a task first
    beforeAll(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Get Task Test',
          description: 'Test for getting a specific task'
        });

      taskId = response.body.data.id;
    });

    it('should return 200 and the specific task', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', taskId);
      expect(response.body.data).toHaveProperty('title');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    // Create a task first
    beforeAll(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Update Task Test',
          description: 'Test for updating a task'
        });

      taskId = response.body.data.id;
    });

    it('should return 200 and the updated task', async () => {
      const updatedTask = {
        title: 'Updated Task Title',
        description: 'Updated description',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTask)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('title', updatedTask.title);
      expect(response.body.data).toHaveProperty('description', updatedTask.description);
      expect(response.body.data).toHaveProperty('priority', updatedTask.priority);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    // Create a task first
    beforeAll(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Delete Task Test',
          description: 'Test for deleting a task'
        });

      taskId = response.body.data.id;
    });

    it('should return 200 and success message', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    let taskId;

    // Create a task first
    beforeAll(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Complete Task Test',
          description: 'Test for marking task as complete'
        });

      taskId = response.body.data.id;
    });

    it('should return 200 and the updated task with completed status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'completed');
    });
  });
});