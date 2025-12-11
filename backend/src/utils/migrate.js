const { runMigrations } = require('./migrations/001-initial-schema');

async function migrate() {
  try {
    console.log('Starting migration process...');
    await runMigrations();
    console.log('Migration process completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();