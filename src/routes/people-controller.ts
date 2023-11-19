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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  const personId = req.params.id;

  try {
    await db.query('DELETE FROM people WHERE person_id = ?', [personId]);
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const movePeople = async (req: Request, res: Response) => {
  const { newGroupId, personIds } = req.body;

  try {
    if (!newGroupId || !personIds || personIds.length === 0) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    await db.query(
      'UPDATE group_people SET group_id = ? WHERE person_id IN (?)',
      [newGroupId, personIds]
    );

    res.json({ message: 'People moved to another group successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAboveLevelGroups = async (req: Request, res: Response) => {
  const personId = req.params.personId;

  const fetchGroups = async (personId: string) => {
    const query = `
      WITH RECURSIVE GroupHierarchy AS (
        SELECT grupuri.group_id, grupuri.group_name
        FROM group_people
        INNER JOIN grupuri ON group_people.group_id = grupuri.group_id
        WHERE group_people.person_id = ?
        
        UNION
        
        SELECT parent.group_id, parent.group_name
        FROM group_groups
        INNER JOIN grupuri AS parent ON group_groups.parent_group_id = parent.group_id
        INNER JOIN GroupHierarchy AS child ON group_groups.child_group_id = child.group_id
      )
      SELECT * FROM GroupHierarchy;
    `;

    try {
      const [results] = await db.query(query, [personId]);
      return results;
    } catch (error) {
      throw new Error('Error retrieving groups above level');
    }
  };

  try {
    const groupsAboveLevel = await fetchGroups(personId);
    res.json(groupsAboveLevel);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPersonsUnderGroup = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;
  const jobTitleFilter = (req.query.jobTitle as string) || '%%';
  const firstNameFilter = (req.query.firstName as string) || '%%';

  const query = `
  WITH RECURSIVE GroupHierarchy AS (
    SELECT
      grupuri.group_id,
      grupuri.group_name,
      group_people.person_id,
      people.first_name,
      people.last_name,
      people.job_title
    FROM grupuri
    LEFT JOIN group_people ON grupuri.group_id = group_people.group_id
    LEFT JOIN people ON group_people.person_id = people.person_id
    WHERE grupuri.group_id = ?
    UNION
    SELECT
      parent.group_id,
      parent.group_name,
      group_people.person_id,
      people.first_name,
      people.last_name,
      people.job_title
    FROM grupuri AS parent
    INNER JOIN group_groups ON parent.group_id = group_groups.child_group_id
    INNER JOIN GroupHierarchy AS child ON parent.group_id = child.group_id
    LEFT JOIN group_people ON parent.group_id = group_people.group_id
    LEFT JOIN people ON group_people.person_id = people.person_id
  )
  SELECT
    person_id,
    MAX(first_name) AS first_name,
    MAX(last_name) AS last_name,
    MAX(job_title) AS job_title,
    GroupHierarchy.group_id AS group_id,
    GroupHierarchy.group_name AS group_name,
    GROUP_CONCAT(nested_group.group_name) AS nested_groups
  FROM GroupHierarchy
  LEFT JOIN group_groups ON GroupHierarchy.group_id = group_groups.parent_group_id
  LEFT JOIN grupuri AS nested_group ON group_groups.child_group_id = nested_group.group_id
  WHERE
    (job_title LIKE ?)
    AND
    (first_name LIKE ?)
  GROUP BY person_id, group_id, GroupHierarchy.group_name;
  `;

  const params = [groupId, jobTitleFilter, firstNameFilter];

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
