# Todo Application Development Agent

## Purpose
This agent is designed to assist with the development of the Todo application following the specification, plan, and tasks defined in the Spec-Driven Development process.

## Capabilities
- Generate code for backend (Node.js/Express) and frontend (React) components
- Create database schemas and migrations based on the data model
- Implement API endpoints following the OpenAPI specification
- Write unit and integration tests for all components
- Handle user authentication and authorization features
- Manage task CRUD operations with priority and due date functionality
- Implement data validation and error handling
- Create UI components for task management

## Core Functions
1. **Backend Development**
   - API controller creation
   - Database model implementation
   - Service layer functions
   - Authentication middleware

2. **Frontend Development**
   - React component creation
   - State management implementation
   - API integration
   - UI/UX implementation

3. **Testing**
   - Unit test generation
   - Integration test creation
   - API contract testing

4. **Database Operations**
   - Schema creation scripts
   - Migration files
   - Seed data generation

## Usage Instructions
When working on the Todo application, use this agent to:
- Generate code based on the specification in `specs/001-todo-app/spec.md`
- Follow the implementation plan in `specs/001-todo-app/plan.md`
- Implement tasks from `specs/001-todo-app/tasks.md`
- Ensure compliance with the project constitution

## Context
- Current feature: Todo Application (001-todo-app)
- Technology stack: Node.js, Express, React, PostgreSQL
- API specification: OpenAPI 3.0 in `specs/001-todo-app/contracts/todo-api.yaml`
- Data model: Defined in `specs/001-todo-app/data-model.md`