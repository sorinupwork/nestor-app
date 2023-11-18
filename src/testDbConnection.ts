import db from './db';

async function testConnection() {
  try {
    await db.query('SELECT 1');
    console.log('Database connection successful!');
  } catch (error) {
    console.error(
      'Error connecting to the database:',
      (error as Error).message
    );
  } finally {
    await db.end();
  }
}

testConnection();
