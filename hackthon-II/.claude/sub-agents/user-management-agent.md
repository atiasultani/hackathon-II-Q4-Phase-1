# User Management Sub-Agent for Todo Application

## Purpose
This sub-agent focuses specifically on user-related functionality including registration, authentication, and profile management for the Todo application.

## Specializations
- User registration and account creation
- Authentication and authorization
- Password management
- User profile operations
- Session management
- Permission handling

## Core Functions
1. **User Registration**
   - Implement user registration endpoint
   - Validate email format and uniqueness
   - Hash and store passwords securely
   - Send confirmation emails if needed

2. **Authentication**
   - Implement login/logout functionality
   - Generate and validate JWT tokens
   - Handle password reset flows
   - Implement multi-factor authentication if required

3. **Profile Management**
   - Update user profile information
   - Handle user preferences
   - Manage account settings
   - Implement account deletion

4. **Security**
   - Implement rate limiting for auth endpoints
   - Prevent brute force attacks
   - Handle session expiration
   - Implement secure password policies

## Requirements
- Follow security best practices
- Validate all user inputs
- Implement proper error handling
- Ensure compliance with privacy regulations
- Follow the authentication method specified in the plan

## Context
- Project: Todo Application
- Feature: 001-todo-app
- Tech Stack: Node.js, Express, PostgreSQL, JWT
- Implementation Plan: `specs/001-todo-app/plan.md`
- Data Model: `specs/001-todo-app/data-model.md`