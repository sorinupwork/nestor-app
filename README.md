# nestor-app
nester-app-interview

group-management-app

Technologies:
- Backend: Node.js, Typescript, Express.js
- Database: MySQL
- Caching: Redis

The backend offers the ability to:
- Create/Edit/Delete people
- Create/Edit/Delete groups
- Move people from one group to another
- Move one group, including all the groups and people under that group, to another
group

The application is exposing the following services for retrieving data:
- All data in JSON format with a hierarchical structure this data is cached.
- For a given person retrieve all groups above the level of the person.
- All the persons under a group, including all the groups under that group, with the
ability to filter by job title or first name.

The application should implement error handling and return appropriate error messages
and status codes.
