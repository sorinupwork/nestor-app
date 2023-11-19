import express, { Request, Response, NextFunction } from 'express';

import { getAllData } from './data-controller';
import { checkCache } from '../middleware/redis-middleware';

const router = express.Router();

const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.originalUrl;

  const cachedData = await checkCache(key);

  if (cachedData) {
    console.log('Data retrieved from Redis cache');
    res.json(cachedData);
  } else {
    next();
  }
};

router.get('/', cacheMiddleware, getAllData);

export default router;
