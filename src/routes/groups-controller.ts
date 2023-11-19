import { Request, Response } from 'express';

import db from '../db';

export const createGroup = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    await db.query('INSERT INTO grupuri (group_name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Group created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  const groupId = req.params.id;
  const { name } = req.body;

  try {
    await db.query('UPDATE grupuri SET group_name = ? WHERE group_id = ?', [
      name,
      groupId,
    ]);
    res.json({ message: 'Group updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const groupId = req.params.id;

  try {
    await db.query('DELETE FROM grupuri WHERE group_id = ?', [groupId]);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const moveGroup = async (req: Request, res: Response) => {
  const { sourceGroupId, targetGroupId } = req.body;

  try {
    await db.query('UPDATE group_people SET group_id = ? WHERE group_id = ?', [
      targetGroupId,
      sourceGroupId,
    ]);

    await db.query(
      'UPDATE group_groups SET parent_group_id = ? WHERE parent_group_id = ?',
      [targetGroupId, sourceGroupId]
    );

    await db.query(
      'INSERT INTO group_groups (parent_group_id, child_group_id) VALUES (?, ?) ',
      [targetGroupId, sourceGroupId]
    );

    res.json({ message: 'Group moved to another group successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
