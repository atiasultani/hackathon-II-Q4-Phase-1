"""
Unit tests for the Task model and TaskList collection.
"""
import pytest
from src.models.task import Task, TaskList


class TestTask:
    """Test cases for the Task entity."""

    def test_task_creation_success(self):
        """Test successful creation of a Task."""
        task = Task(1, "Test title", "Test description")
        assert task.id == 1
        assert task.title == "Test title"
        assert task.description == "Test description"
        assert task.completed is False

    def test_task_creation_with_defaults(self):
        """Test Task creation with default values."""
        task = Task(1, "Test title")
        assert task.id == 1
        assert task.title == "Test title"
        assert task.description is None
        assert task.completed is False

    def test_task_creation_empty_title(self):
        """Test Task creation with empty title raises ValueError."""
        with pytest.raises(ValueError, match="Title must be provided and not empty"):
            Task(1, "")

    def test_task_creation_whitespace_only_title(self):
        """Test Task creation with whitespace-only title raises ValueError."""
        with pytest.raises(ValueError, match="Title must be provided and not empty"):
            Task(1, "   ")

    def test_task_creation_title_too_long(self):
        """Test Task creation with title exceeding 200 characters raises ValueError."""
        long_title = "A" * 201
        with pytest.raises(ValueError, match="Title exceeds maximum length of 200 characters"):
            Task(1, long_title)

    def test_task_update_success(self):
        """Test successful update of task title and description."""
        task = Task(1, "Original title", "Original description")
        task.update("New title", "New description")
        assert task.title == "New title"
        assert task.description == "New description"

    def test_task_update_title_only(self):
        """Test updating only the title of a task."""
        task = Task(1, "Original title", "Original description")
        task.update("New title")
        assert task.title == "New title"
        assert task.description == "Original description"

    def test_task_update_description_only(self):
        """Test updating only the description of a task."""
        task = Task(1, "Original title", "Original description")
        task.update(description="New description")
        assert task.title == "Original title"
        assert task.description == "New description"

    def test_task_update_empty_title(self):
        """Test updating task with empty title raises ValueError."""
        task = Task(1, "Original title")
        with pytest.raises(ValueError, match="Title must be provided and not empty"):
            task.update("")

    def test_task_update_title_too_long(self):
        """Test updating task with title exceeding 200 characters raises ValueError."""
        task = Task(1, "Original title")
        long_title = "A" * 201
        with pytest.raises(ValueError, match="Title exceeds maximum length of 200 characters"):
            task.update(long_title)

    def test_task_to_dict(self):
        """Test converting Task to dictionary."""
        task = Task(1, "Test title", "Test description", True)
        task_dict = task.to_dict()
        assert task_dict == {
            "id": 1,
            "title": "Test title",
            "description": "Test description",
            "completed": True
        }


class TestTaskList:
    """Test cases for the TaskList collection."""

    def test_add_task_success(self):
        """Test successful addition of a task."""
        task_list = TaskList()
        task = task_list.add_task("Test title", "Test description")
        assert task.id == 1
        assert task.title == "Test title"
        assert task.description == "Test description"
        assert task.completed is False

    def test_get_task_success(self):
        """Test successful retrieval of a task."""
        task_list = TaskList()
        added_task = task_list.add_task("Test title")
        retrieved_task = task_list.get_task(added_task.id)
        assert retrieved_task.id == added_task.id
        assert retrieved_task.title == added_task.title

    def test_get_task_not_found(self):
        """Test retrieval of non-existent task returns None."""
        task_list = TaskList()
        task = task_list.get_task(999)
        assert task is None

    def test_get_all_tasks(self):
        """Test retrieval of all tasks."""
        task_list = TaskList()
        task1 = task_list.add_task("Title 1")
        task2 = task_list.add_task("Title 2")
        all_tasks = task_list.get_all_tasks()
        assert len(all_tasks) == 2
        assert task1 in all_tasks
        assert task2 in all_tasks

    def test_update_task_success(self):
        """Test successful update of a task."""
        task_list = TaskList()
        task = task_list.add_task("Original title", "Original description")
        updated = task_list.update_task(task.id, "New title", "New description")
        assert updated is True
        updated_task = task_list.get_task(task.id)
        assert updated_task.title == "New title"
        assert updated_task.description == "New description"

    def test_update_task_not_found(self):
        """Test updating non-existent task returns False."""
        task_list = TaskList()
        result = task_list.update_task(999, "New title")
        assert result is False

    def test_delete_task_success(self):
        """Test successful deletion of a task."""
        task_list = TaskList()
        task = task_list.add_task("Test title")
        result = task_list.delete_task(task.id)
        assert result is True
        assert task_list.get_task(task.id) is None

    def test_delete_task_not_found(self):
        """Test deletion of non-existent task returns False."""
        task_list = TaskList()
        result = task_list.delete_task(999)
        assert result is False

    def test_toggle_task_status_success(self):
        """Test successful toggling of task status."""
        task_list = TaskList()
        task = task_list.add_task("Test title")
        # Initially False
        assert task.completed is False
        # Toggle to True
        result = task_list.toggle_task_status(task.id)
        assert result is True
        toggled_task = task_list.get_task(task.id)
        assert toggled_task.completed is True
        # Toggle back to False
        result = task_list.toggle_task_status(task.id)
        assert result is True
        toggled_task = task_list.get_task(task.id)
        assert toggled_task.completed is False

    def test_toggle_task_status_not_found(self):
        """Test toggling status of non-existent task returns False."""
        task_list = TaskList()
        result = task_list.toggle_task_status(999)
        assert result is False