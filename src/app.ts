import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import peopleRoutes from './routes/people';
import groupsRoutes from './routes/groups';
import dataRoutes from './routes/data';

const app = express();

app.use(express.json());

app.use('/people', peopleRoutes);
app.use('/groups', groupsRoutes);
app.use('/data', dataRoutes);

export default app;
