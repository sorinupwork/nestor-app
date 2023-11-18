import { Request, Response, NextFunction } from 'express';
import redis from 'redis';

const client: any = redis.createClient();

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key: string = req.originalUrl;
  client.get(key, (err: Error | null, data: string | null) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

export const setCache = (key: string, data: any) => {
  client.setex(key, 3600, JSON.stringify(data));
};
