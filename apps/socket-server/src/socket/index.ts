import {Server} from "socket.io"
import http from "http"
import { app } from "../app.js"
import { auth } from "@ratees/utils/src/betterAuth.utils.js";
import { fromNodeHeaders } from "better-auth/node";

const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
});


io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);
  const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers)
    })
  // console.log(socket.handshake.headers)
  console.log(session)
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


export {server,io}


