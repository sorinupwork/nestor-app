import { Request, Response } from 'express';

import {
  Person,
  Group,
  GroupPeople,
  GroupGroups,
  GroupWithChildren,
} from '../models/interfaces';
import { setCache } from '../middleware/redis-middleware';
import db from '../db';

const fetchDataFromDatabase = async () => {
  try {
    const people = (await db.query('SELECT * FROM people'))[0];
    const groups = (await db.query('SELECT * FROM grupuri'))[0];
    const groupPeople = (await db.query('SELECT * FROM group_people'))[0];
    const groupGroups = (await db.query('SELECT * FROM group_groups'))[0];

    return { people, groups, groupPeople, groupGroups };
  } catch (error) {
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

  groups.forEach((group: Group) => {
    groupMap[group.group_id] = {
      group_id: group.group_id,
      group_name: group.group_name,
      children: [],
      people: [],
    };
  });

  groupPeople.forEach((groupPerson: GroupPeople) => {
    const person = people.find(
      (p: Person) => p.person_id === groupPerson.person_id
    );
    const group = groupMap[groupPerson.group_id];

    if (person && group) {
      group.people.push(person);
    }
  });

  groupGroups.forEach((groupGroup: GroupGroups) => {
    const parent = groupMap[groupGroup.parent_group_id];
    const child = groupMap[groupGroup.child_group_id];

    if (parent && child) {
      parent.children.push(child);
      childGroups.add(child.group_id);
    }
  });

  Object.values(groupMap).forEach((currentGroup) => {
    if (!childGroups.has(currentGroup.group_id)) {
      topLevelGroups.push(currentGroup);
    }
  });

  return topLevelGroups;
};
