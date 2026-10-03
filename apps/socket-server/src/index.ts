import { server } from "./socket/index.js"
import { logger } from "@ratees/utils";
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 3000;

try {
    server.listen(PORT, () => {
        logger.info({ port: PORT }, `✅ Socket-Server is running successfully on port ${PORT}`);
    });
} catch (error) {
    logger.error(error, "❌ Failed to Socket-Server start ")
}
