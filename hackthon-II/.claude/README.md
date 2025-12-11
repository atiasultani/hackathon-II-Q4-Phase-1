# Claude Agent System for Todo Application

## Overview
This directory contains the Claude agent configuration for the Todo Application project. The agents are designed to support the Spec-Driven Development process and help implement the features defined in the specification.

## Directory Structure
```
.claude/
├── agents/           # Main agents for different development areas
├── sub-agents/       # Specialized sub-agents for specific tasks
├── commands/         # Spec-Driven Development commands (existing)
├── agents.md         # Main agent system documentation
└── README.md         # This file
```

## Agent System

### Main Agents
Located in `.claude/agents/`:
- `todo-dev-agent.md` - General development assistance
- `backend-agent.md` - Backend development (Node.js/Express)
- `frontend-agent.md` - Frontend development (React)
- `testing-agent.md` - Testing and quality assurance
- `database-agent.md` - Database operations (PostgreSQL)

### Sub-Agents
Located in `.claude/sub-agents/`:
- `user-management-agent.md` - User authentication and profiles
- `task-management-agent.md` - Task CRUD and management
- `ui-ux-agent.md` - UI/UX design and implementation
- `devops-agent.md` - Deployment and operational concerns

## Usage

### Selecting the Right Agent
1. **For general development**: Use `todo-dev-agent.md`
2. **For backend tasks**: Use `backend-agent.md`
3. **For frontend tasks**: Use `frontend-agent.md`
4. **For testing**: Use `testing-agent.md`
5. **For database tasks**: Use `database-agent.md`
6. **For specialized tasks**: Use the appropriate sub-agent

### Integration with Spec-Driven Development
The agents work within the existing Spec-Driven Development workflow:
- Refer to specifications in `specs/001-todo-app/spec.md`
- Follow implementation plans in `specs/001-todo-app/plan.md`
- Implement tasks from `specs/001-todo-app/tasks.md`
- Maintain compliance with `.specify/memory/constitution.md`

## Commands
The existing commands in `.claude/commands/` continue to work as before:
- `/sp.specify` - Create specifications
- `/sp.plan` - Create implementation plans
- `/sp.tasks` - Generate tasks
- `/sp.clarify` - Clarify specifications
- And others...

## Best Practices
1. Always refer to the relevant specification and plan documents
2. Maintain consistency with the defined data models and API contracts
3. Follow the technology stack decisions made in the plan
4. Ensure all code meets the quality standards in the constitution
5. Write tests for all implemented functionality

## Getting Started
1. When starting a new development task, first determine which agent is most appropriate
2. Review the relevant specification and plan documents
3. Use the agent to generate code, tests, or documentation as needed
4. Ensure all work maintains consistency with the overall architecture