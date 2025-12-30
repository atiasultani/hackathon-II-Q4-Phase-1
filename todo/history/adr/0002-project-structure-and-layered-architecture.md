# ADR-0002: Project Structure and Layered Architecture

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-30
- **Feature:** 001-todo-app
- **Context:** Need to establish a clear project structure that follows clean architecture principles with separation of concerns between data models, business logic, and user interface.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

- Models Layer: Contains data entities (Task model, TaskList collection) in src/models/
- Services Layer: Contains business logic (TodoService) in src/services/
- CLI Layer: Contains user interface and command parsing in src/cli/
- Utilities Layer: Contains common utility functions in src/lib/
- Test Structure: Organized by type (unit, integration) with corresponding test files

## Consequences

### Positive

- Clear separation of concerns makes code more maintainable and testable
- Each layer has a single responsibility making it easier to understand and modify
- Enables easier unit testing of business logic without UI dependencies
- Follows clean architecture principles making the system more robust
- Clear organization helps new developers understand the codebase quickly

### Negative

- More complex directory structure than a single-file approach
- May require more imports and navigation between files
- Slight overhead in initial setup compared to simpler structures
- Requires discipline to maintain layer boundaries

## Alternatives Considered

Alternative Structure A: Single file application
- Why rejected: Would not follow clean architecture principles and would become unmaintainable as features grow

Alternative Structure B: Feature-based organization (by functionality rather than layer)
- Why rejected: For this simple application, layer-based organization is clearer and more conventional

Alternative Structure C: Framework-heavy approach with complex package structure
- Why rejected: Would add unnecessary complexity for a simple console application

## References

- Feature Spec: specs/001-todo-app/spec.md
- Implementation Plan: specs/001-todo-app/plan.md
- Related ADRs: ADR-0001: Application Architecture and Technology Stack
- Evaluator Evidence: specs/001-todo-app/research.md