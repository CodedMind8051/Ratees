import mongoose from "mongoose"
import { DbName } from "@ratees/constants";


let isConnected = false
const ConnectDb = async () => {
    try {

        if (!process.env.MongoDb_Url) {
            throw new Error("MongoDb_Url is not defined in environment variables");
        }

        if (isConnected) {
            console.log("✅ Already connected to MongoDB");
            return;
        }

        const connectionInstance = await mongoose.connect(`${process.env.MongoDb_Url}/${DbName}`);
        isConnected = connectionInstance.connection.readyState === 1;
        console.log("✅ Connected to MongoDB:", connectionInstance.connection.host);

    } catch (error) {
        console.log("❌ MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export { ConnectDb }