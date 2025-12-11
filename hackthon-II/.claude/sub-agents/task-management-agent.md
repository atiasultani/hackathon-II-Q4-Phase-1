# Task Management Sub-Agent for Todo Application

## Purpose
This sub-agent focuses specifically on task-related functionality including CRUD operations, priority management, and due date handling for the Todo application.

## Specializations
- Task CRUD operations (Create, Read, Update, Delete)
- Priority level management (High, Medium, Low)
- Due date handling and scheduling
- Task status management (pending, completed, archived)
- Task filtering and sorting
- Task list organization

## Core Functions
1. **Task CRUD Operations**
   - Create new tasks with validation
   - Retrieve tasks with filtering options
   - Update task details and status
   - Delete tasks with proper cascade handling

2. **Priority Management**
   - Implement priority levels (High, Medium, Low)
   - Sort tasks by priority
   - Handle priority-based notifications
   - Visual indication of priority levels

3. **Due Date Handling**
   - Set and update due dates
   - Handle overdue task logic
   - Implement due date notifications
   - Sort tasks by due date

4. **Status Management**
   - Track task completion status
   - Handle status transitions
   - Archive completed tasks if needed
   - Track completion timestamps

## Requirements
- Follow the task data model in `specs/001-todo-app/data-model.md`
- Implement all priority levels as specified
- Handle overdue tasks as clarified in the specification
- Ensure proper validation for all task operations
- Follow performance requirements from the plan

## Context
- Project: Todo Application
- Feature: 001-todo-app
- Tech Stack: Node.js, Express, PostgreSQL
- Implementation Plan: `specs/001-todo-app/plan.md`
- Data Model: `specs/001-todo-app/data-model.md`
- API Contract: `specs/001-todo-app/contracts/todo-api.yaml`