# Todo Application - Phase I

A console-based todo application built with Python, following spec-driven development and clean architecture principles.

## Features

- Add tasks with title and optional description
- View all tasks with ID, title, description, and completion status
- Update existing tasks
- Delete tasks by ID
- Mark tasks as complete/incomplete
- In-memory storage (no persistence)

## Requirements

- Python 3.12+
- UV package manager (optional, for dependency management)

## Installation

1. Clone the repository
2. Install dependencies (if any are added later):
   ```bash
   uv sync  # or pip install -r requirements.txt if using pip
   ```

## Usage

### Interactive Mode

Run the application in interactive mode:
```bash
python src/cli/main.py
```

Then use commands like:
- `add "Task title" "Optional description"` - Add a new task
- `list` - View all tasks
- `update 1 "New title" "New description"` - Update task with ID 1
- `delete 1` - Delete task with ID 1
- `toggle 1` - Toggle completion status of task with ID 1
- `help` - Show available commands
- `quit` or `exit` - Exit the application

### Command Mode

Run specific commands directly:
```bash
python src/cli/main.py add "Buy groceries" "Milk, bread, eggs"
python src/cli/main.py list
python src/cli/main.py update 1 "Buy groceries" "Milk, bread, eggs, fruits"
python src/cli/main.py delete 1
python src/cli/main.py toggle 1
python src/cli/main.py help
```

## Project Structure

```
src/
├── models/
│   └── task.py          # Task entity and TaskList collection
├── services/
│   └── todo_service.py  # Business logic for todo operations
└── cli/
    └── main.py          # Console interface and command parsing
```

## Architecture

The application follows clean architecture principles:

- **Models**: Define the data structures and business entities
- **Services**: Contain the business logic and operations
- **CLI**: Provides the user interface and command parsing

## Data Model

### Task Entity
- `id` (int): Unique identifier for the task
- `title` (str): Title of the task (required, non-empty)
- `description` (str): Optional description of the task
- `completed` (bool): Status indicating if task is completed

## Error Handling

The application provides clear error messages for invalid operations:
- Empty or missing task titles
- Operations on non-existent tasks
- Invalid task IDs

## Development

This project was built using Spec-Kit Plus and Claude Code, following spec-driven development methodology.