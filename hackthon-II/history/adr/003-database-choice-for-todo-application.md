# ADR-003: Database Choice for Todo Application

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-11
- **Feature:** 001-todo-app
- **Context:** Need to select a database solution that provides reliable data persistence for user accounts and tasks, supports the defined data model with relationships, and scales appropriately for the expected user base. The database must work well with the chosen technology stack.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

PostgreSQL database for persistent data storage with the following characteristics:

- **Database Type**: PostgreSQL (relational database)
- **Relationships**: Support for complex queries and relationships needed for task management
- **Data Integrity**: Strong data integrity features with constraints and transactions
- **Scalability**: Support for concurrent users and expected load
- **Performance**: Good performance characteristics for the application requirements
- **JSON Support**: Excellent JSON support for flexible data structures

## Consequences

### Positive

- Robust, reliable, and well-documented database system
- Excellent support for complex queries and relationships needed for task management
- Strong data integrity features with constraints and ACID compliance
- Good performance characteristics for the application requirements
- Excellent JSON support for flexible data structures
- Supports complex indexing strategies for performance
- Strong community support and extensive tooling
- Supports concurrent users effectively

### Negative

- More complex setup compared to simpler alternatives like SQLite
- Requires dedicated database server and maintenance
- Steeper learning curve for advanced features
- Potentially more expensive to host compared to simpler solutions
- Overhead of connection pooling and management
- May be more complex than needed for a simple todo application

## Alternatives Considered

- **MongoDB**: Good for flexible schemas but SQL better for structured task data relationships
- **SQLite**: Simpler for single-user but doesn't support concurrent users well
- **MySQL**: Similar to PostgreSQL but PostgreSQL has better JSON support and more advanced features
- **Redis**: Good for caching and sessions but not suitable as primary database for this application
- **NoSQL alternatives**: Would complicate the relational data model for users and tasks

## References

- Feature Spec: specs/001-todo-app/spec.md
- Implementation Plan: specs/001-todo-app/plan.md
- Related ADRs: ADR-001 (Technology Stack Selection)
- Evaluator Evidence: specs/001-todo-app/research.md, specs/001-todo-app/data-model.md