"""
Todo service for the Todo application.

This module contains the business logic for todo operations as specified in the requirements.
"""
from typing import Optional, List, Dict, Any
from src.models.task import Task, TaskList


class TodoService:
    """
    Business logic layer for todo operations.
    """

    def __init__(self):
        """Initialize the TodoService with an in-memory TaskList."""
        self.task_list = TaskList()

    def add_task(self, title: str, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Add a new task to the todo list.

        Args:
            title (str): Title of the task
            description (str, optional): Description of the task

        Returns:
            dict: Response containing the result of the operation
        """
        try:
            task = self.task_list.add_task(title, description)
            return {
                "status": "success",
                "message": f"Task '{task.title}' added successfully with ID {task.id}",
                "data": task.to_dict()
            }
        except ValueError as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def list_tasks(self) -> Dict[str, Any]:
        """
        List all tasks in the todo list.

        Returns:
            dict: Response containing the result of the operation
        """
        tasks = self.task_list.get_all_tasks()
        return {
            "status": "success",
            "message": f"Found {len(tasks)} task(s)",
            "data": [task.to_dict() for task in tasks]
        }

    def get_task(self, task_id: int) -> Dict[str, Any]:
        """
        Get a specific task by ID.

        Args:
            task_id (int): ID of the task to retrieve

        Returns:
            dict: Response containing the result of the operation
        """
        task = self.task_list.get_task(task_id)
        if task is None:
            return {
                "status": "error",
                "message": f"Task with ID {task_id} not found"
            }

        return {
            "status": "success",
            "message": f"Task with ID {task_id} retrieved successfully",
            "data": task.to_dict()
        }

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Update an existing task.

        Args:
            task_id (int): ID of the task to update
            title (str, optional): New title for the task
            description (str, optional): New description for the task

        Returns:
            dict: Response containing the result of the operation
        """
        try:
            updated = self.task_list.update_task(task_id, title, description)
            if not updated:
                return {
                    "status": "error",
                    "message": f"Task with ID {task_id} not found"
                }

            task = self.task_list.get_task(task_id)
            return {
                "status": "success",
                "message": f"Task with ID {task_id} updated successfully",
                "data": task.to_dict()
            }
        except ValueError as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def delete_task(self, task_id: int) -> Dict[str, Any]:
        """
        Delete a task by ID.

        Args:
            task_id (int): ID of the task to delete

        Returns:
            dict: Response containing the result of the operation
        """
        deleted = self.task_list.delete_task(task_id)
        if not deleted:
            return {
                "status": "error",
                "message": f"Task with ID {task_id} not found"
            }

        return {
            "status": "success",
            "message": f"Task with ID {task_id} deleted successfully"
        }

    def toggle_task_status(self, task_id: int) -> Dict[str, Any]:
        """
        Toggle the completion status of a task.

        Args:
            task_id (int): ID of the task to toggle

        Returns:
            dict: Response containing the result of the operation
        """
        toggled = self.task_list.toggle_task_status(task_id)
        if not toggled:
            return {
                "status": "error",
                "message": f"Task with ID {task_id} not found"
            }

        task = self.task_list.get_task(task_id)
        status_str = "completed" if task.completed else "incomplete"
        return {
            "status": "success",
            "message": f"Task with ID {task_id} marked as {status_str}",
            "data": task.to_dict()
        }