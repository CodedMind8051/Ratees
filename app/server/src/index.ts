import { app } from "./app"
import { ConnectDb } from "./db/index"

ConnectDb()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`✅ Server is running successfully on port: ${process.env.PORT || 8000}`)
        })
    }).catch((err) => {
        console.log("❌ MongoDb connection failed", err)
    })