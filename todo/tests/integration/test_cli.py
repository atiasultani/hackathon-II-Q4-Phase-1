"""
Integration tests for the Todo CLI functionality.
"""
import sys
import os
import argparse
from io import StringIO
from unittest.mock import patch
import pytest
from src.cli.main import TodoCLI


class TestTodoCLI:
    """Test cases for the TodoCLI interface."""

    def setup_method(self):
        """Set up a fresh CLI instance for each test."""
        self.cli = TodoCLI()

    def test_add_task_command(self):
        """Test the add task command functionality."""
        args = argparse.Namespace(title="Test task", description="Test description")
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.add_task(args)
            output = mock_stdout.getvalue()
            assert "Task 'Test task' added successfully" in output

    def test_list_tasks_command_empty(self):
        """Test the list tasks command when no tasks exist."""
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.list_tasks(None)
            output = mock_stdout.getvalue()
            assert "No tasks found." in output

    def test_list_tasks_command_with_tasks(self):
        """Test the list tasks command when tasks exist."""
        # Add a task first
        args = argparse.Namespace(title="Test task", description="Test description")
        self.cli.add_task(args)

        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.list_tasks(None)
            output = mock_stdout.getvalue()
            assert "Found 1 task(s)" in output
            assert "Test task" in output

    def test_update_task_command(self):
        """Test the update task command functionality."""
        # Add a task first
        args = argparse.Namespace(title="Original task", description="Original description")
        self.cli.add_task(args)

        # Update the task
        update_args = argparse.Namespace(id=1, title="Updated task", description="Updated description")
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.update_task(update_args)
            output = mock_stdout.getvalue()
            assert "Task with ID 1 updated successfully" in output

    def test_update_task_command_not_found(self):
        """Test the update task command with non-existent task ID."""
        update_args = argparse.Namespace(id=999, title="Updated task", description="Updated description")
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.update_task(update_args)
            output = mock_stdout.getvalue()
            assert "Task with ID 999 not found" in output

    def test_delete_task_command(self):
        """Test the delete task command functionality."""
        # Add a task first
        args = argparse.Namespace(title="Test task", description="Test description")
        self.cli.add_task(args)

        # Delete the task
        delete_args = argparse.Namespace(id=1)
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.delete_task(delete_args)
            output = mock_stdout.getvalue()
            assert "Task with ID 1 deleted successfully" in output

    def test_delete_task_command_not_found(self):
        """Test the delete task command with non-existent task ID."""
        delete_args = argparse.Namespace(id=999)
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.delete_task(delete_args)
            output = mock_stdout.getvalue()
            assert "Task with ID 999 not found" in output

    def test_toggle_task_command(self):
        """Test the toggle task command functionality."""
        # Add a task first
        args = argparse.Namespace(title="Test task", description="Test description")
        self.cli.add_task(args)

        # Toggle the task status
        toggle_args = argparse.Namespace(id=1)
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.toggle_task(toggle_args)
            output = mock_stdout.getvalue()
            assert "Task with ID 1 marked as completed" in output

    def test_toggle_task_command_not_found(self):
        """Test the toggle task command with non-existent task ID."""
        toggle_args = argparse.Namespace(id=999)
        with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            self.cli.toggle_task(toggle_args)
            output = mock_stdout.getvalue()
            assert "Task with ID 999 not found" in output

    def test_run_interactive_mode_quit(self):
        """Test the interactive mode with quit command."""
        with patch('builtins.input', side_effect=['quit']):
            with patch('sys.stdout', new_callable=StringIO):
                self.cli.run_interactive()

    def test_run_interactive_mode_add_task(self):
        """Test the interactive mode with add task command."""
        inputs = ['add "Test task" "Test description"', 'quit']
        with patch('builtins.input', side_effect=inputs):
            with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
                self.cli.run_interactive()
                output = mock_stdout.getvalue()
                assert "Task 'Test task' added successfully with ID 1" in output

    def test_run_interactive_mode_list_tasks(self):
        """Test the interactive mode with list tasks command."""
        # Add a task first
        args = argparse.Namespace(title="Test task", description="Test description")
        self.cli.add_task(args)

        inputs = ['list', 'quit']
        with patch('builtins.input', side_effect=inputs):
            with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
                self.cli.run_interactive()
                output = mock_stdout.getvalue()
                assert "Test task" in output

    def test_run_interactive_mode_invalid_command(self):
        """Test the interactive mode with invalid command."""
        inputs = ['invalid_command', 'quit']
        with patch('builtins.input', side_effect=inputs):
            with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
                self.cli.run_interactive()
                output = mock_stdout.getvalue()
                assert "Unknown command: invalid_command" in output

    def test_run_interactive_mode_invalid_task_id(self):
        """Test the interactive mode with invalid task ID."""
        inputs = ['update abc "New title"', 'quit']
        with patch('builtins.input', side_effect=inputs):
            with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
                self.cli.run_interactive()
                output = mock_stdout.getvalue()
                assert "Task ID must be a number" in output