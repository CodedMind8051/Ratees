import {Server} from "socket.io"
import http from "http"
import { app } from "../app.js"

const server = http.createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new messages
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast the message to all connected clients
      io.emit('chat message', msg);
    });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

export {server,io}


