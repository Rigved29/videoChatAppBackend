const express = require("express");

const app = express();

const server = require("http").createServer(app);

const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// console.log(process.env);

const PORT = process.env.PORT || 5000;

// const server = http.createServer((req, res) => {
//   res.end("Hello form the server");
// });

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
    console.log(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening to requests on port ${PORT}`);
});
