import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import db from './db';

dotenv.config();
const app = express();

app.use(bodyParser.json());

// Create a person
app.post('/people', async (req: Request, res: Response) => {
  const { first_name, last_name, job_title } = req.body;

  try {
    await db.query(
      'INSERT INTO people (first_name, last_name, job_title) VALUES (?, ?, ?)',
      [first_name, last_name, job_title]
    );
    res.status(201).json({ message: 'Person created successfully' });
  } catch (error) {
    console.error('Error creating person:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;
