import mongoose from "mongoose"
import { DbName } from "@ratees/constants/src/constants";
import { logger } from "@ratees/utils";


let isConnected = false
const ConnectDb = async () => {
    try {

        if (!process.env.MongoDb_Url) {
            throw new Error("MongoDb_Url is not defined in environment variables");
        }

        if (isConnected) {
            logger.warn("Already connected to MongoDB");
            return;
        }

        const connectionInstance = await mongoose.connect(`${process.env.MongoDb_Url}/${DbName}`);
        isConnected = connectionInstance.connection.readyState === 1;
        logger.info({ host: connectionInstance.connection.host }, "✅ Connected to MongoDB");

    } catch (error) {
        logger.error(error, "❌ MONGODB connection FAILED ");
        process.exit(1)
    }
}

export { ConnectDb }