"""
Console interface for the Todo application.

This module provides the command-line interface for interacting with the todo application.
It follows the CLI interface contract specified in the requirements.
"""
import sys
import os
import argparse
from typing import List

# Add the src directory to the path so we can import other modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.todo_service import TodoService


class TodoCLI:
    """
    Command-line interface for the Todo application.
    """

    def __init__(self):
        """Initialize the CLI with a TodoService instance."""
        self.service = TodoService()

    def display_tasks(self, tasks: List[dict]):
        """
        Display a formatted list of tasks.

        Args:
            tasks (List[dict]): List of task dictionaries to display
        """
        if not tasks:
            print("No tasks found.")
            return

        print(f"{'ID':<4} {'Status':<10} {'Title':<30} {'Description'}")
        print("-" * 70)
        for task in tasks:
            status = "✓ Done" if task['completed'] else "○ Pending"
            title = task['title'][:27] + "..." if len(task['title']) > 30 else task['title']
            description = task['description'] or ""
            if len(description) > 30:
                description = description[:27] + "..."
            print(f"{task['id']:<4} {status:<10} {title:<30} {description}")

    def add_task(self, args: argparse.Namespace):
        """
        Handle the add task command.

        Args:
            args: Parsed command-line arguments
        """
        result = self.service.add_task(args.title, args.description)
        if result['status'] == 'success':
            print(result['message'])
        else:
            print(f"Error: {result['message']}")

    def list_tasks(self, args: argparse.Namespace):
        """
        Handle the list tasks command.

        Args:
            args: Parsed command-line arguments
        """
        result = self.service.list_tasks()
        if result['status'] == 'success':
            print(f"\n{result['message']}")
            self.display_tasks(result['data'])
        else:
            print(f"Error: {result['message']}")

    def update_task(self, args: argparse.Namespace):
        """
        Handle the update task command.

        Args:
            args: Parsed command-line arguments
        """
        result = self.service.update_task(args.id, args.title, args.description)
        if result['status'] == 'success':
            print(result['message'])
        else:
            print(f"Error: {result['message']}")

    def delete_task(self, args: argparse.Namespace):
        """
        Handle the delete task command.

        Args:
            args: Parsed command-line arguments
        """
        result = self.service.delete_task(args.id)
        if result['status'] == 'success':
            print(result['message'])
        else:
            print(f"Error: {result['message']}")

    def toggle_task(self, args: argparse.Namespace):
        """
        Handle the toggle task command.

        Args:
            args: Parsed command-line arguments
        """
        result = self.service.toggle_task_status(args.id)
        if result['status'] == 'success':
            print(result['message'])
        else:
            print(f"Error: {result['message']}")

    def show_help(self, args: argparse.Namespace = None):
        """
        Show help information for available commands.

        Args:
            args: Parsed command-line arguments (optional)
        """
        help_text = """
Todo Application - Available Commands:

add "title" ["description"]    - Add a new task
list                          - List all tasks
update <id> "title" ["description"] - Update an existing task
delete <id>                   - Delete a task by ID
toggle <id>                   - Toggle task completion status
help                          - Show this help message
quit/exit                     - Exit the application

Examples:
  python main.py add "Buy groceries" "Milk, bread, eggs"
  python main.py list
  python main.py update 1 "Buy groceries" "Milk, bread, eggs, fruits"
  python main.py delete 1
  python main.py toggle 1
"""
        print(help_text)

    def run_interactive(self):
        """
        Run the interactive command-line interface.
        """
        print("Welcome to the Todo Application!")
        print("Type 'help' for available commands or 'quit' to exit.\n")

        while True:
            try:
                user_input = input("todo> ").strip()
                if not user_input:
                    continue

                # Parse the command
                parts = user_input.split()
                command = parts[0].lower()

                if command in ['quit', 'exit']:
                    print("Goodbye!")
                    break
                elif command == 'help':
                    self.show_help()
                elif command == 'list':
                    self.list_tasks(None)
                elif command == 'add':
                    if len(parts) < 2:
                        print("Usage: add \"title\" [\"description\"]")
                        continue
                    # Handle quoted arguments properly
                    args = self.parse_quoted_args(parts[1:])
                    if len(args) < 1:
                        print("Usage: add \"title\" [\"description\"]")
                        continue
                    title = args[0]
                    description = args[1] if len(args) > 1 else None
                    # Create a mock namespace for the add_task method
                    mock_args = argparse.Namespace(title=title, description=description)
                    self.add_task(mock_args)
                elif command == 'update':
                    if len(parts) < 3:
                        print("Usage: update <id> \"title\" [\"description\"]")
                        continue
                    try:
                        task_id = int(parts[1])
                        # Handle quoted arguments for title and description
                        args = self.parse_quoted_args(parts[2:])
                        if len(args) < 1:
                            print("Usage: update <id> \"title\" [\"description\"]")
                            continue
                        title = args[0]
                        description = args[1] if len(args) > 1 else None
                        # Create a mock namespace for the update_task method
                        mock_args = argparse.Namespace(id=task_id, title=title, description=description)
                        self.update_task(mock_args)
                    except ValueError:
                        print("Error: Task ID must be a number")
                elif command == 'delete':
                    if len(parts) < 2:
                        print("Usage: delete <id>")
                        continue
                    try:
                        task_id = int(parts[1])
                        # Create a mock namespace for the delete_task method
                        mock_args = argparse.Namespace(id=task_id)
                        self.delete_task(mock_args)
                    except ValueError:
                        print("Error: Task ID must be a number")
                elif command == 'toggle':
                    if len(parts) < 2:
                        print("Usage: toggle <id>")
                        continue
                    try:
                        task_id = int(parts[1])
                        # Create a mock namespace for the toggle_task method
                        mock_args = argparse.Namespace(id=task_id)
                        self.toggle_task(mock_args)
                    except ValueError:
                        print("Error: Task ID must be a number")
                else:
                    print(f"Unknown command: {command}. Type 'help' for available commands.")

            except KeyboardInterrupt:
                print("\nGoodbye!")
                break
            except EOFError:
                print("\nGoodbye!")
                break

    def parse_quoted_args(self, parts: List[str]) -> List[str]:
        """
        Parse arguments that may contain spaces within quotes.

        Args:
            parts: List of string parts to parse

        Returns:
            List[str]: Parsed arguments with quotes handled properly
        """
        result = []
        current_arg = []
        in_quotes = False

        for part in parts:
            if part.startswith('"') and not in_quotes:
                in_quotes = True
                current_arg.append(part[1:])  # Remove opening quote
            elif part.endswith('"') and in_quotes:
                in_quotes = False
                current_arg.append(part[:-1])  # Remove closing quote
                result.append(' '.join(current_arg))
                current_arg = []
            elif in_quotes:
                current_arg.append(part)
            else:
                result.append(part)

        # Handle unclosed quotes
        if in_quotes and current_arg:
            result.append(' '.join(current_arg))

        return result

    def run(self, args: argparse.Namespace = None):
        """
        Run the CLI application.

        Args:
            args: Parsed command-line arguments (None for interactive mode)
        """
        if args is None or not hasattr(args, 'command'):
            # Run in interactive mode
            self.run_interactive()
        else:
            # Run in command mode
            command = args.command

            if command == 'add':
                self.add_task(args)
            elif command == 'list':
                self.list_tasks(args)
            elif command == 'update':
                self.update_task(args)
            elif command == 'delete':
                self.delete_task(args)
            elif command == 'toggle':
                self.toggle_task(args)
            elif command == 'help':
                self.show_help(args)


def main():
    """
    Main entry point for the Todo CLI application.
    """
    parser = argparse.ArgumentParser(
        description="Todo Application - Manage your tasks from the command line",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s add "Buy groceries" "Milk, bread, eggs"
  %(prog)s list
  %(prog)s update 1 "Buy groceries" "Milk, bread, eggs, fruits"
  %(prog)s delete 1
  %(prog)s toggle 1
  %(prog)s help
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Add command
    add_parser = subparsers.add_parser('add', help='Add a new task')
    add_parser.add_argument('title', help='Title of the task')
    add_parser.add_argument('description', nargs='?', help='Description of the task')

    # List command
    list_parser = subparsers.add_parser('list', help='List all tasks')

    # Update command
    update_parser = subparsers.add_parser('update', help='Update an existing task')
    update_parser.add_argument('id', type=int, help='ID of the task to update')
    update_parser.add_argument('title', help='New title of the task')
    update_parser.add_argument('description', nargs='?', help='New description of the task')

    # Delete command
    delete_parser = subparsers.add_parser('delete', help='Delete a task by ID')
    delete_parser.add_argument('id', type=int, help='ID of the task to delete')

    # Toggle command
    toggle_parser = subparsers.add_parser('toggle', help='Toggle task completion status')
    toggle_parser.add_argument('id', type=int, help='ID of the task to toggle')

    # Help command
    subparsers.add_parser('help', help='Show help information')

    # Parse arguments
    args = parser.parse_args()

    # Create and run CLI
    cli = TodoCLI()

    # If no command is provided, run interactive mode
    if args.command is None:
        cli.run_interactive()
    else:
        cli.run(args)


if __name__ == "__main__":
    main()