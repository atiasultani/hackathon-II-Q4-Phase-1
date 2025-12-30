"""
Unit tests for the TodoService.
"""
import pytest
from src.services.todo_service import TodoService


class TestTodoService:
    """Test cases for the TodoService."""

    def test_add_task_success(self):
        """Test successful addition of a task."""
        service = TodoService()
        result = service.add_task("Test title", "Test description")
        assert result["status"] == "success"
        assert "Task 'Test title' added successfully with ID 1" in result["message"]
        assert result["data"]["title"] == "Test title"
        assert result["data"]["description"] == "Test description"
        assert result["data"]["completed"] is False

    def test_add_task_without_description(self):
        """Test successful addition of a task without description."""
        service = TodoService()
        result = service.add_task("Test title")
        assert result["status"] == "success"
        assert result["data"]["title"] == "Test title"
        assert result["data"]["description"] is None

    def test_add_task_empty_title(self):
        """Test adding task with empty title returns error."""
        service = TodoService()
        result = service.add_task("")
        assert result["status"] == "error"
        assert "Title must be provided and not empty" in result["message"]

    def test_add_task_whitespace_only_title(self):
        """Test adding task with whitespace-only title returns error."""
        service = TodoService()
        result = service.add_task("   ")
        assert result["status"] == "error"
        assert "Title must be provided and not empty" in result["message"]

    def test_add_task_title_too_long(self):
        """Test adding task with title exceeding 200 characters returns error."""
        service = TodoService()
        long_title = "A" * 201
        result = service.add_task(long_title)
        assert result["status"] == "error"
        assert "Title exceeds maximum length of 200 characters" in result["message"]

    def test_list_tasks_empty(self):
        """Test listing tasks when no tasks exist."""
        service = TodoService()
        result = service.list_tasks()
        assert result["status"] == "success"
        assert "Found 0 task(s)" in result["message"]
        assert result["data"] == []

    def test_list_tasks_with_tasks(self):
        """Test listing tasks when tasks exist."""
        service = TodoService()
        service.add_task("Task 1")
        service.add_task("Task 2", "Description for task 2")
        result = service.list_tasks()
        assert result["status"] == "success"
        assert "Found 2 task(s)" in result["message"]
        assert len(result["data"]) == 2
        assert result["data"][0]["title"] == "Task 1"
        assert result["data"][1]["title"] == "Task 2"
        assert result["data"][1]["description"] == "Description for task 2"

    def test_get_task_success(self):
        """Test successful retrieval of a task."""
        service = TodoService()
        added_result = service.add_task("Test title", "Test description")
        task_id = added_result["data"]["id"]
        result = service.get_task(task_id)
        assert result["status"] == "success"
        assert f"Task with ID {task_id} retrieved successfully" in result["message"]
        assert result["data"]["title"] == "Test title"
        assert result["data"]["description"] == "Test description"

    def test_get_task_not_found(self):
        """Test retrieval of non-existent task returns error."""
        service = TodoService()
        result = service.get_task(999)
        assert result["status"] == "error"
        assert "Task with ID 999 not found" in result["message"]

    def test_update_task_success(self):
        """Test successful update of a task."""
        service = TodoService()
        added_result = service.add_task("Original title", "Original description")
        task_id = added_result["data"]["id"]
        result = service.update_task(task_id, "New title", "New description")
        assert result["status"] == "success"
        assert f"Task with ID {task_id} updated successfully" in result["message"]
        assert result["data"]["title"] == "New title"
        assert result["data"]["description"] == "New description"

    def test_update_task_title_only(self):
        """Test updating only the title of a task."""
        service = TodoService()
        added_result = service.add_task("Original title", "Original description")
        task_id = added_result["data"]["id"]
        result = service.update_task(task_id, "New title")
        assert result["status"] == "success"
        assert result["data"]["title"] == "New title"
        assert result["data"]["description"] == "Original description"

    def test_update_task_description_only(self):
        """Test updating only the description of a task."""
        service = TodoService()
        added_result = service.add_task("Original title", "Original description")
        task_id = added_result["data"]["id"]
        result = service.update_task(task_id, description="New description")
        assert result["status"] == "success"
        assert result["data"]["title"] == "Original title"
        assert result["data"]["description"] == "New description"

    def test_update_task_not_found(self):
        """Test updating non-existent task returns error."""
        service = TodoService()
        result = service.update_task(999, "New title")
        assert result["status"] == "error"
        assert "Task with ID 999 not found" in result["message"]

    def test_update_task_empty_title(self):
        """Test updating task with empty title returns error."""
        service = TodoService()
        added_result = service.add_task("Original title")
        task_id = added_result["data"]["id"]
        result = service.update_task(task_id, "")
        assert result["status"] == "error"
        assert "Title must be provided and not empty" in result["message"]

    def test_delete_task_success(self):
        """Test successful deletion of a task."""
        service = TodoService()
        added_result = service.add_task("Test title")
        task_id = added_result["data"]["id"]
        result = service.delete_task(task_id)
        assert result["status"] == "success"
        assert f"Task with ID {task_id} deleted successfully" in result["message"]

    def test_delete_task_not_found(self):
        """Test deletion of non-existent task returns error."""
        service = TodoService()
        result = service.delete_task(999)
        assert result["status"] == "error"
        assert "Task with ID 999 not found" in result["message"]

    def test_toggle_task_status_success(self):
        """Test successful toggling of task status."""
        service = TodoService()
        added_result = service.add_task("Test title")
        task_id = added_result["data"]["id"]
        # Initially False
        assert added_result["data"]["completed"] is False
        # Toggle to True
        result = service.toggle_task_status(task_id)
        assert result["status"] == "success"
        assert f"Task with ID {task_id} marked as completed" in result["message"]
        # Verify the task is now completed
        get_result = service.get_task(task_id)
        assert get_result["data"]["completed"] is True
        # Toggle back to False
        result = service.toggle_task_status(task_id)
        assert result["status"] == "success"
        assert f"Task with ID {task_id} marked as incomplete" in result["message"]

    def test_toggle_task_status_not_found(self):
        """Test toggling status of non-existent task returns error."""
        service = TodoService()
        result = service.toggle_task_status(999)
        assert result["status"] == "error"
        assert "Task with ID 999 not found" in result["message"]