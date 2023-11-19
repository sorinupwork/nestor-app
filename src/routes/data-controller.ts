import { Request, Response } from 'express';

import { setCache } from '../middleware/redis-middleware';
import db from '../db';

interface Person {
  person_id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  date_added: string;
  last_updated: string;
}

interface Group {
  parent_group_id: number | null;
  group_id: number;
  group_name: string;
  date_added: string;
  last_updated: string;
}

interface GroupPeople {
  group_id: number;
  person_id: number;
}

interface GroupGroups {
  parent_group_id: number;
  child_group_id: number;
}

interface GroupWithChildren {
  group_id: number;
  group_name: string;
  children: GroupWithChildren[];
  people: Person[];
}

const fetchDataFromDatabase = async () => {
  try {
    const people = (await db.query('SELECT * FROM people'))[0];
    const groups = (await db.query('SELECT * FROM grupuri'))[0];
    const groupPeople = (await db.query('SELECT * FROM group_people'))[0];
    const groupGroups = (await db.query('SELECT * FROM group_groups'))[0];

    return { people, groups, groupPeople, groupGroups };
  } catch (error) {
    console.error(
      'Error fetching data from the database:',
      (error as Error).message
    );
    throw error;
  }
};

export const getAllData = async (req: Request, res: Response) => {
  try {
    const { people, groupGroups, groupPeople, groups } =
      await fetchDataFromDatabase();

    const hierarchicalData = organizeDataHierarchically(
      people,
      groups,
      groupPeople,
      groupGroups
    );

    // Set data in cache
    const key = req.originalUrl;
    await setCache(key, hierarchicalData);

    res.json(hierarchicalData);
  } catch (error) {
    console.error('Error retrieving all data:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const organizeDataHierarchically = (
  people: any,
  groups: any,
  groupPeople: any,
  groupGroups: any
): GroupWithChildren[] => {
  const groupMap: { [key: number]: GroupWithChildren } = {};
  const childGroups: Set<number> = new Set();
  const topLevelGroups: GroupWithChildren[] = [];

  // Create a map for groups
  groups.forEach((group: Group) => {
    groupMap[group.group_id] = {
      group_id: group.group_id,
      group_name: group.group_name,
      children: [],
      people: [],
    };
  });

  // Organize people into groups
  groupPeople.forEach((groupPerson: GroupPeople) => {
    const person = people.find(
      (p: Person) => p.person_id === groupPerson.person_id
    );
    if (person) {
      const group = groupMap[groupPerson.group_id];
      if (group) {
        group.people.push(person);
      }
    }
  });

  // Organize groups into hierarchical structure
  groupGroups.forEach((groupGroup: GroupGroups) => {
    const parent = groupMap[groupGroup.parent_group_id];
    const child = groupMap[groupGroup.child_group_id];

    if (parent && child) {
      parent.children.push(child);
      childGroups.add(child.group_id);
    }
  });

  // Find top-level groups
  Object.values(groupMap).forEach((currentGroup) => {
    if (!childGroups.has(currentGroup.group_id)) {
      topLevelGroups.push(currentGroup);
    }
  });

  return topLevelGroups;
};
