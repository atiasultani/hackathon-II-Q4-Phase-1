"""
Task model for the Todo application.

This module defines the Task entity and TaskList collection as specified in the data model.
"""
from typing import Optional, List


class Task:
    """
    Represents a single todo item with ID, title, description, and completion status.
    """

    def __init__(self, task_id: int, title: str, description: Optional[str] = None, completed: bool = False):
        """
        Initialize a Task instance.

        Args:
            task_id (int): Unique identifier for the task
            title (str): Title of the task (required, non-empty)
            description (str, optional): Optional description of the task
            completed (bool): Status indicating if task is completed (default: False)
        """
        if not title or not title.strip():
            raise ValueError("Title must be provided and not empty")

        if len(title) > 200:
            raise ValueError("Title exceeds maximum length of 200 characters")

        self.id = task_id
        self.title = title.strip()
        self.description = description.strip() if description else None
        self.completed = completed

    def __repr__(self):
        return f"Task(id={self.id}, title='{self.title}', description='{self.description}', completed={self.completed})"

    def to_dict(self):
        """
        Convert the Task instance to a dictionary representation.

        Returns:
            dict: Dictionary representation of the task
        """
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed
        }

    def update(self, title: Optional[str] = None, description: Optional[str] = None):
        """
        Update the task title and/or description.

        Args:
            title (str, optional): New title for the task
            description (str, optional): New description for the task
        """
        if title is not None:
            if not title or not title.strip():
                raise ValueError("Title must be provided and not empty")

            if len(title) > 200:
                raise ValueError("Title exceeds maximum length of 200 characters")

            self.title = title.strip()

        if description is not None:
            self.description = description.strip() if description else None


class TaskList:
    """
    Collection that manages multiple Task entities.
    """

    def __init__(self):
        """Initialize an empty TaskList."""
        self._tasks = {}
        self._next_id = 1

    def _generate_id(self) -> int:
        """
        Generate a unique ID for a new task.

        Returns:
            int: Unique task ID
        """
        while self._next_id in self._tasks:
            self._next_id += 1
        return self._next_id

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """
        Add a new task to the collection.

        Args:
            title (str): Title of the task
            description (str, optional): Description of the task

        Returns:
            Task: The newly created task
        """
        task_id = self._generate_id()
        task = Task(task_id, title, description)
        self._tasks[task_id] = task
        self._next_id = task_id + 1  # Update next ID to avoid conflicts
        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """
        Get a specific task by ID.

        Args:
            task_id (int): ID of the task to retrieve

        Returns:
            Task or None: The task if found, None otherwise
        """
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """
        Get all tasks in the collection.

        Returns:
            List[Task]: List of all tasks
        """
        return list(self._tasks.values())

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """
        Update an existing task by ID.

        Args:
            task_id (int): ID of the task to update
            title (str, optional): New title for the task
            description (str, optional): New description for the task

        Returns:
            bool: True if task was updated, False if task was not found
        """
        task = self.get_task(task_id)
        if task is None:
            return False

        task.update(title, description)
        return True

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by ID.

        Args:
            task_id (int): ID of the task to delete

        Returns:
            bool: True if task was deleted, False if task was not found
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def toggle_task_status(self, task_id: int) -> bool:
        """
        Toggle the completion status of a task by ID.

        Args:
            task_id (int): ID of the task to toggle

        Returns:
            bool: True if task status was toggled, False if task was not found
        """
        task = self.get_task(task_id)
        if task is None:
            return False

        task.completed = not task.completed
        return True