import Redis from "ioredis";
import { logger } from "../pinoLogger.utils"

let isConnected = false

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
}

const redisClient = new Redis({
    ...redisConfig,
}
);

const redisBullmqConnection =new Redis({
    ...redisConfig,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
}
);
const redisConnect = async () => {
    try {

        if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_USERNAME || !process.env.REDIS_PASSWORD) {
            throw new Error("Missing Redis environment variables");
        }

        if (isConnected) {
            logger.warn("Redis is already connected");
            return;
        }

        await redisClient.connect();
        isConnected = true;
        logger.info("✅ Redis Client connected successfully");
    } catch (error) {
        logger.error(error, "❌ Redis Client connection failed");
        process.exit(1);
    }
}


redisClient.on("error", (err) => {
    logger.error(err, "Redis error");
});

redisClient.on("end", () => {
    isConnected = false;
    logger.warn("Redis connection closed");
});

export { redisClient, redisConnect ,redisBullmqConnection};