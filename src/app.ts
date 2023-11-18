import bodyParser from 'body-parser';
import express from 'express';

import peopleRoutes from './routes/people';
import groupsRoutes from './routes/groups';

const app = express();

app.use(bodyParser.json());

app.use('/people', peopleRoutes);
app.use('/groups', groupsRoutes);

export default app;
