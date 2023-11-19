import { ResultSetHeader } from 'mysql2';
import { Request, Response } from 'express';
import db from '../db';

export const createPerson = async (req: Request, res: Response) => {
  const { first_name, last_name, job_title, groupId } = req.body;

  try {
    const result = await db.query<ResultSetHeader>(
      'INSERT INTO people (first_name, last_name, job_title) VALUES (?, ?, ?)',
      [first_name, last_name, job_title]
    );

    const personId = result[0].insertId;

    const targetGroupId = groupId || 1;

    await db.query(
      'INSERT INTO group_people (group_id, person_id) VALUES (?, ?)',
      [targetGroupId, personId]
    );

    res.status(201).json({ message: 'Person created successfully' });
  } catch (error) {
    console.error('Error creating person:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePerson = async (req: Request, res: Response) => {
  const personId = req.params.id;
  const { first_name, last_name, job_title } = req.body;

  try {
    await db.query(
      'UPDATE people SET first_name = ?, last_name = ?, job_title = ? WHERE person_id = ?',
      [first_name, last_name, job_title, personId]
    );
    res.json({ message: 'Person updated successfully' });
  } catch (error) {
    console.error('Error updating person:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  const personId = req.params.id;

  try {
    await db.query('DELETE FROM people WHERE person_id = ?', [personId]);
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    console.error('Error deleting person:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const movePeople = async (req: Request, res: Response) => {
  const { newGroupId, personIds } = req.body;

  try {
    if (Array.isArray(personIds) && personIds.length > 0) {
      const flattenedPersonIds = personIds.join(',');

      await db.query(
        `UPDATE group_people SET group_id = ? WHERE person_id IN (${flattenedPersonIds})`,
        [newGroupId]
      );

      res.json({ message: 'People moved to another group successfully' });
    } else {
      res.status(400).json({ error: 'Invalid personIds array' });
    }
  } catch (error) {
    console.error(
      'Error moving people to another group:',
      (error as Error).message
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
