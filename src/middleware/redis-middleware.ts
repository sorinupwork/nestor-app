import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis Server');
});

const checkCache = async (key: string) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
};

const setCache = async (key: string, data: any) => {
  try {
    await redisClient.setex(key, 3600, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export { redisClient, checkCache, setCache };
