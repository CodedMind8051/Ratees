import { server } from "./socket/index.js"

const PORT = process.env.PORT || 3000;

try {
    server.listen(PORT, () => {
        console.log(`✅ Socket-Server is running successfully on port ${PORT}`);
    });
} catch (error) {
    console.log("❌ Failed to Socket-Server start ", error)
}
