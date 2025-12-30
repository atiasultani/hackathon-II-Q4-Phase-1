# Data Model: Todo App - Phase I

## Task Entity

**Description**: Represents a single todo item

**Fields**:
- `id` (int): Unique identifier for the task (auto-generated)
- `title` (str): Title of the task (required, non-empty, max 200 characters)
- `description` (str): Optional description of the task (can be empty/None, max 500 characters)
- `completed` (bool): Status indicating if task is completed (default: False)

**Validation Rules**:
- Title must be provided and not empty
- ID must be unique within the task collection
- Title must not exceed 200 characters
- Description must not exceed 500 characters when provided

**State Transitions**:
- `pending` → `completed`: When user marks task as complete
- `completed` → `pending`: When user marks task as incomplete

## TaskList Collection

**Description**: Collection that manages multiple Task entities

**Operations**:
- Add a new Task (auto-generates unique ID)
- Get all Tasks (returns list of all tasks)
- Get Task by ID (returns specific task or None if not found)
- Update Task by ID (modifies existing task)
- Delete Task by ID (removes task from collection)
- Toggle Task completion status by ID

**Validation Rules**:
- No duplicate IDs allowed
- Operations on non-existent IDs should return appropriate errors/results
- Title validation must be enforced on all updates