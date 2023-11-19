export interface Person {
  person_id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  date_added: string;
  last_updated: string;
}

export interface Group {
  parent_group_id: number | null;
  group_id: number;
  group_name: string;
  date_added: string;
  last_updated: string;
}

export interface GroupPeople {
  group_id: number;
  person_id: number;
}

export interface GroupGroups {
  parent_group_id: number;
  child_group_id: number;
}

export interface GroupWithChildren {
  group_id: number;
  group_name: string;
  children: GroupWithChildren[];
  people: Person[];
}
