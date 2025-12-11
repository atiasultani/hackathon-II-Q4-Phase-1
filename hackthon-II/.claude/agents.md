# Todo Application Agent System

## Overview
This system of agents supports the development of the Todo application following the Spec-Driven Development methodology. Each agent has specific responsibilities while working together to deliver the complete application.

## Main Agents

### 1. Todo Development Agent (`todo-dev-agent.md`)
- **Purpose**: General development assistance for the Todo application
- **Scope**: Overall project guidance, cross-cutting concerns
- **Location**: `.claude/agents/todo-dev-agent.md`

### 2. Backend Agent (`backend-agent.md`)
- **Purpose**: Specialized in backend development (Node.js/Express)
- **Scope**: API development, database operations, server logic
- **Location**: `.claude/agents/backend-agent.md`

### 3. Frontend Agent (`frontend-agent.md`)
- **Purpose**: Specialized in frontend development (React)
- **Scope**: UI components, client-side logic, API integration
- **Location**: `.claude/agents/frontend-agent.md`

### 4. Testing Agent (`testing-agent.md`)
- **Purpose**: Specialized in test creation and maintenance
- **Scope**: Unit, integration, and end-to-end testing
- **Location**: `.claude/agents/testing-agent.md`

### 5. Database Agent (`database-agent.md`)
- **Purpose**: Specialized in database operations (PostgreSQL)
- **Scope**: Schema design, queries, migrations
- **Location**: `.claude/agents/database-agent.md`

## Sub-Agents

### 1. User Management Agent (`user-management-agent.md`)
- **Purpose**: Focus on user authentication and profile management
- **Scope**: Registration, login, profile updates
- **Location**: `.claude/sub-agents/user-management-agent.md`

### 2. Task Management Agent (`task-management-agent.md`)
- **Purpose**: Focus on task CRUD operations and management
- **Scope**: Task creation, updates, priority, due dates
- **Location**: `.claude/sub-agents/task-management-agent.md`

### 3. UI/UX Agent (`ui-ux-agent.md`)
- **Purpose**: Focus on user interface and experience
- **Scope**: Component design, accessibility, user flows
- **Location**: `.claude/sub-agents/ui-ux-agent.md`

### 4. DevOps Agent (`devops-agent.md`)
- **Purpose**: Focus on deployment and operational concerns
- **Scope**: Deployment, CI/CD, monitoring
- **Location**: `.claude/sub-agents/devops-agent.md`

## Usage Guidelines

### When to Use Each Agent
- **Main Agents**: For general development tasks in their respective domains
- **Sub-Agents**: For specialized tasks that require deep domain knowledge
- **Coordination**: Main agents should coordinate with relevant sub-agents for complex tasks

### Integration with Spec-Driven Development
All agents should:
- Refer to the specification in `specs/001-todo-app/spec.md`
- Follow the implementation plan in `specs/001-todo-app/plan.md`
- Implement tasks from `specs/001-todo-app/tasks.md`
- Comply with the project constitution in `.specify/memory/constitution.md`

## Configuration
- All agents operate within the context of feature branch `001-todo-app`
- Agents should maintain consistency with the technology stack defined in the plan
- All generated code should pass through the quality gates defined in the constitution