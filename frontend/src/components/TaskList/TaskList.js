import React, { useState, useEffect } from 'react';
import './TaskList.css'; // We'll create this CSS file later

const TaskList = ({ tasks = [], onTaskUpdate, onTaskDelete, loading = false }) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await onTaskDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div className="task-list-loading">Loading tasks...</div>;
  }

  if (localTasks.length === 0) {
    return <div className="task-list-empty">No tasks found. Create your first task!</div>;
  }

  return (
    <div className="task-list">
      <ul className="task-list-items">
        {localTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => handleToggleComplete(task)}
                className="task-checkbox"
              />
              <div className="task-details">
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta">
                  {task.priority && (
                    <span className={`task-priority priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="task-due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="task-status">{task.status}</span>
                </div>
              </div>
            </div>
            <div className="task-actions">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete-btn"
                aria-label="Delete task"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;