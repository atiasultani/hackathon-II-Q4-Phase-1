# Quickstart Guide: Todo Application

## Prerequisites
- Node.js v18+ installed
- PostgreSQL database server
- Git for version control
- A code editor (VS Code recommended)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database configuration
# Example:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=tododb
# DB_USER=your_username
# DB_PASS=your_password
# JWT_SECRET=your_jwt_secret_key
```

### 3. Database Setup
```bash
# Create database
createdb tododb

# Run migrations (if available)
npm run migrate
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Update with your backend API URL
```

### 5. Running the Application

#### Development Mode:
```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

#### Production Mode:
```bash
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend in production)
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (requires auth)

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/complete` - Mark task as complete/incomplete

### Task Lists
- `GET /api/tasklists` - Get user's task lists
- `POST /api/tasklists` - Create a new task list
- `PUT /api/tasklists/:id` - Update a task list
- `DELETE /api/tasklists/:id` - Delete a task list

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASS` - Database password
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (e.g., http://localhost:3000/api)

## Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

## Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Check that ports 3000 (backend) and 3001 (frontend) are available
3. **CORS Errors**: Backend CORS settings should allow frontend origin
4. **JWT Issues**: Ensure JWT_SECRET is consistent between development and production