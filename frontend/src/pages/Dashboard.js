import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList/TaskList';
import TaskForm from '../components/TaskForm/TaskForm';
import apiClient from '../services/api';
import './Dashboard.css'; // We'll create this CSS file later

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTasks();
      setTasks(response.data.tasks || []);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await apiClient.createTask(taskData);
      setTasks(prev => [response.data, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await apiClient.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id ? response.data : task
      ));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const completed = task.status !== 'completed';
      const response = await apiClient.updateTaskStatus(task.id, completed);
      setTasks(prev => prev.map(t =>
        t.id === task.id ? response.data : t
      ));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiClient.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true; // 'all' filter
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Todo Dashboard</h1>
        <div className="dashboard-actions">
          <button
            className="add-task-btn"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            Add Task
          </button>
          <div className="filter-controls">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <div className="task-form-container">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
            initialTask={editingTask}
          />
        </div>
      ) : (
        <div className="task-list-container">
          <TaskList
            tasks={filteredTasks}
            onTaskUpdate={handleToggleComplete}
            onTaskDelete={handleDeleteTask}
            loading={loading}
          />
        </div>
      )}

      <div className="dashboard-summary">
        <p>Total tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter(t => t.status === 'completed').length}</p>
        <p>Active: {tasks.filter(t => t.status !== 'completed').length}</p>
      </div>
    </div>
  );
};

export default Dashboard;