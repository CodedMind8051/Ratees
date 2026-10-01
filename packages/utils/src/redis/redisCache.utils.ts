import {redisClient} from "./connection.utils"
import { logger } from "../pinoLogger.utils";

const getCachedData = async (key: string) => {
    try {
        const cachedData = await redisClient.get(key);  

        if(cachedData){
            return JSON.parse(cachedData)
        }

        return null

    } catch (error) {
        logger.warn(error, "❌ Failed to get cached data")
        return null
    }
}

const setCachedData = async (key: string, value: any, ttl: number) => {
    try {
        await redisClient.set(key, JSON.stringify(value), "EX", ttl);
    } catch (error) {
        logger.warn(error, "❌ Failed to set cached data")
    }
}


const deleteCachedData = async (key: string) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        logger.warn(error, "❌ Failed to delete cached data")
    }
}

export {getCachedData,setCachedData,deleteCachedData}