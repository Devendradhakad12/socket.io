import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const port = 3000;

/*  Create server */
const server = createServer(app);

/* Setup io */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* use io */
io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Id", socket.id);
  // socket.emit("welcome",`welcome to the server ID:${socket.id}`);
  //socket.broadcast.emit("welcome",`welcome to the brodcast (joind server) ID:${socket.id}`)

  socket.on("message", (data) => {
    console.log(data);
    //socket.broadcast.emit("receive-messsage",data)  // to everyone expect sender
    io.to(data.room).emit("receive-messsage", data.message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });
});

/* http requests */
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello");
});

/* listen server */
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
