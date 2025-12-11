const { Pool } = require('pg');

const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
  );
`;

const createTaskListsTable = `
  CREATE TABLE IF NOT EXISTS task_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_default BOOLEAN DEFAULT false
  );
`;

const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'archived')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_list_id INTEGER REFERENCES task_lists(id) ON DELETE SET NULL
  );
`;

const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
  CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
`;

async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    await pool.query('BEGIN');

    await pool.query(createUsersTable);
    console.log('✓ Users table created');

    await pool.query(createTaskListsTable);
    console.log('✓ TaskLists table created');

    await pool.query(createTasksTable);
    console.log('✓ Tasks table created');

    await pool.query(createIndexes);
    console.log('✓ Indexes created');

    await pool.query('COMMIT');
    console.log('✓ All migrations completed successfully');

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().catch(err => {
    console.error('Migration process failed:', err);
    process.exit(1);
  });
}

module.exports = { runMigrations };