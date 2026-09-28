import dotenv from "dotenv"

dotenv.config()

import { app, startGraphqlServer } from "./app"
import { ConnectDb } from "@ratees/db"
import { redisConnect } from "@ratees/utils"
import { logger } from "@ratees/utils/src/pinoLogger.utils"


ConnectDb()
    .then(() => {
        redisConnect()
            .then(() => {
                startGraphqlServer()
                app.listen(process.env.PORT || 5000, () => {
                    logger.info({ port: process.env.PORT || 5000 }, `✅ Server is running successfully on port: ${process.env.PORT || 5000}`)
                })
            }).catch((err: Error) => {
                logger.error(err, "❌ Redis connection failed")
            })
    }).catch((err: Error) => {
        logger.error(err, "❌ MongoDb connection failed")
    })