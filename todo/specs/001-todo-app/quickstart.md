# Quickstart Guide: Todo App - Phase I

## Getting Started

The Todo application is a console-based Python application that allows you to manage your tasks from the command line.

### Prerequisites

- Python 3.12+ (or higher)
- UV package manager (optional)

### Installation

1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies (if any are added later):
   ```bash
   uv sync  # or pip install -r requirements.txt
   ```

### Running the Application

#### Interactive Mode
Run the application in interactive mode:
```bash
python src/cli/main.py
```

#### Command Mode
Run specific commands directly:
```bash
python src/cli/main.py add "Task title" "Optional description"
python src/cli/main.py list
python src/cli/main.py update 1 "New title" "New description"
python src/cli/main.py delete 1
python src/cli/main.py toggle 1
```

### Basic Usage

1. **Add a task**:
   ```bash
   python src/cli/main.py add "Buy groceries" "Milk, bread, eggs"
   ```

2. **View all tasks**:
   ```bash
   python src/cli/main.py list
   ```

3. **Update a task**:
   ```bash
   python src/cli/main.py update 1 "Buy groceries" "Milk, bread, eggs, fruits"
   ```

4. **Delete a task**:
   ```bash
   python src/cli/main.py delete 1
   ```

5. **Toggle task completion**:
   ```bash
   python src/cli/main.py toggle 1
   ```

### Available Commands

- `add` - Add a new task with title and optional description
- `list` - List all tasks with ID, title, description, and status
- `update` - Update an existing task by ID
- `delete` - Delete a task by ID
- `toggle` - Toggle the completion status of a task by ID
- `help` - Show help information
- `quit/exit` - Exit the application

### In-Memory Storage

Note that all data is stored in memory only and will be lost when the application exits. This is by design for Phase I of the application.