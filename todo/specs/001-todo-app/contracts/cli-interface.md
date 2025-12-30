# CLI Interface Contract: Todo App - Phase I

## Command Structure

All commands follow the pattern:
```
python src/cli/main.py [command] [arguments...]
```

## Available Commands

### 1. Add Task
**Command**: `add`
**Arguments**:
- `title` (required): Task title
- `description` (optional): Task description
**Usage**: `add "task title" ["optional description"]`
**Output**: Success message with assigned task ID
**Error Conditions**: Title is empty or missing

### 2. List Tasks
**Command**: `list`
**Arguments**: None
**Usage**: `list`
**Output**: Formatted list of all tasks with ID, title, description, and completion status
**Error Conditions**: None

### 3. Update Task
**Command**: `update`
**Arguments**:
- `id` (required): Task ID
- `title` (required): New task title
- `description` (optional): New task description
**Usage**: `update <id> "new title" ["optional new description"]`
**Output**: Success message
**Error Conditions**: Task ID doesn't exist, title is empty

### 4. Delete Task
**Command**: `delete`
**Arguments**:
- `id` (required): Task ID
**Usage**: `delete <id>`
**Output**: Success message
**Error Conditions**: Task ID doesn't exist

### 5. Toggle Task Status
**Command**: `toggle`
**Arguments**:
- `id` (required): Task ID
**Usage**: `toggle <id>`
**Output**: Success message
**Error Conditions**: Task ID doesn't exist

### 6. Help
**Command**: `help`
**Arguments**: None
**Usage**: `help`
**Output**: List of available commands with usage
**Error Conditions**: None

### 7. Exit
**Command**: `quit` or `exit`
**Arguments**: None
**Usage**: `quit` or `exit`
**Output**: Exit message
**Error Conditions**: None

## Data Format

### Task Representation
```
{
    "id": integer,
    "title": string,
    "description": string or null,
    "completed": boolean
}
```

### Success Response
```
{
    "status": "success",
    "message": string,
    "data": object (optional)
}
```

### Error Response
```
{
    "status": "error",
    "message": string
}
```