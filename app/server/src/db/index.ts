import mongoose from "mongoose"
import { DbName } from "../constants";

const ConnectDb = async () => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MongoDb_Url}/${DbName}`);
        console.log("✅ Connected to MongoDB:", connectionInstance.connection.host);

    } catch (error) {
        console.log("❌ MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export { ConnectDb }