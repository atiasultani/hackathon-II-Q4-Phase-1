# Data Model: Todo Application

## Entity: User
**Description**: Represents an application user with authentication credentials and associated tasks

**Fields**:
- `id` (UUID/String): Unique identifier for the user
- `email` (String): User's email address (unique, required, validated format)
- `passwordHash` (String): Bcrypt hash of user's password (required, min length after hashing)
- `firstName` (String): User's first name (optional, max 50 chars)
- `lastName` (String): User's last name (optional, max 50 chars)
- `createdAt` (DateTime): Timestamp when user account was created
- `updatedAt` (DateTime): Timestamp when user account was last updated
- `lastLoginAt` (DateTime): Timestamp of last successful login (nullable)
- `isActive` (Boolean): Whether the account is active (default: true)

**Relationships**:
- One-to-Many: User has many Tasks
- One-to-Many: User has many TaskLists

**Validation Rules**:
- Email must be unique across all users
- Email must match standard email format
- Password must be at least 8 characters when set
- Email cannot be changed after account creation

## Entity: Task
**Description**: Represents a todo item with attributes for organization and tracking

**Fields**:
- `id` (UUID/String): Unique identifier for the task
- `title` (String): Task title or description (required, min 1 char, max 200 chars)
- `description` (String): Detailed task description (optional, max 1000 chars)
- `status` (Enum): Task completion status ['pending', 'completed', 'archived'] (default: 'pending')
- `priority` (Enum): Task priority level ['low', 'medium', 'high'] (default: 'medium')
- `dueDate` (DateTime): When the task is due (nullable)
- `createdAt` (DateTime): Timestamp when task was created
- `updatedAt` (DateTime): Timestamp when task was last updated
- `completedAt` (DateTime): Timestamp when task was marked as completed (nullable)
- `userId` (UUID/String): Foreign key linking to User who owns the task
- `taskListId` (UUID/String): Foreign key linking to TaskList (nullable)

**Relationships**:
- Many-to-One: Task belongs to one User
- Many-to-One: Task belongs to one TaskList (optional)

**Validation Rules**:
- Title must be provided and not empty
- Status must be one of the allowed values
- Priority must be one of the allowed values
- Due date cannot be in the past when creating recurring tasks (if implemented)
- userId must reference an existing user

## Entity: TaskList
**Description**: Represents a collection of related tasks that can be organized by category or project

**Fields**:
- `id` (UUID/String): Unique identifier for the task list
- `name` (String): Name of the task list (required, min 1 char, max 100 chars)
- `description` (String): Description of the task list purpose (optional, max 500 chars)
- `userId` (UUID/String): Foreign key linking to User who owns the task list
- `createdAt` (DateTime): Timestamp when task list was created
- `updatedAt` (DateTime): Timestamp when task list was last updated
- `isDefault` (Boolean): Whether this is the user's default task list (default: false)

**Relationships**:
- Many-to-One: TaskList belongs to one User
- One-to-Many: TaskList has many Tasks

**Validation Rules**:
- Name must be provided and not empty
- A user cannot have multiple task lists with the same name
- userId must reference an existing user
- Each user must have exactly one default task list

## State Transitions

### Task Status Transitions
- `pending` → `completed`: When user marks task as done
- `completed` → `pending`: When user unmarks completed task
- `pending` → `archived`: When user archives an incomplete task
- `completed` → `archived`: When user archives a completed task
- `archived` → `pending`: When user unarchives a task

### User Account States
- `inactive` → `active`: When user completes registration verification
- `active` → `suspended`: When account is administratively suspended
- `suspended` → `active`: When suspension is lifted
- `active` → `deleted`: When user requests account deletion (soft delete)

## Indexes
- User.email: Unique index for fast login and duplicate prevention
- Task.userId: Index for efficient user task retrieval
- Task.status: Index for filtering tasks by status
- Task.dueDate: Index for sorting and filtering by due date
- TaskList.userId: Index for efficient user task list retrieval
- Task.createdAt: Index for chronological ordering

## Constraints
- Referential integrity: All foreign keys must reference existing records
- User email uniqueness: No duplicate email addresses allowed
- Task title non-empty: All tasks must have a meaningful title
- Default TaskList uniqueness: Each user can only have one default task list
- Cascade deletion: When a TaskList is deleted, its tasks are reassigned to the user's default list or deleted based on user preference