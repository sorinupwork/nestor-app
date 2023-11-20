import { Pool } from 'mysql2/promise';

export const createDatabaseAndTables = async (pool: Pool) => {
  try {
    const connection = await pool.getConnection();

    await connection.query('CREATE DATABASE IF NOT EXISTS nestor_db');
    await connection.query('USE nestor_db');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS people (
        person_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS grupuri (
        group_id INT PRIMARY KEY AUTO_INCREMENT,
        group_name VARCHAR(255) NOT NULL,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS group_people (
        group_id INT,
        person_id INT,
        PRIMARY KEY (group_id, person_id),
        FOREIGN KEY (group_id) REFERENCES grupuri(group_id) ON DELETE CASCADE,
        FOREIGN KEY (person_id) REFERENCES people(person_id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS group_groups (
        parent_group_id INT,
        child_group_id INT,
        PRIMARY KEY (parent_group_id, child_group_id),
        FOREIGN KEY (parent_group_id) REFERENCES grupuri(group_id) ON DELETE CASCADE,
        FOREIGN KEY (child_group_id) REFERENCES grupuri(group_id) ON DELETE CASCADE
      )
    `);

    connection.release();

    console.log('Database and tables created successfully');
  } catch (error) {
    console.error('Error creating database and tables:', error);
  }
};
