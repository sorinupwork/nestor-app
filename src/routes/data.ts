import express from 'express';

import { getAllData } from './data-controller';

const router = express.Router();

router.get('/', getAllData);

export default router;
