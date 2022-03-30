const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    method: ["GET", "POSt"],
  },
});

const VideoRoute = require("./route/playlist");

app.use(cors());
app.use("/media", VideoRoute);

io.on("connection", (socket) => {
  console.log("new client connected: " + socket.id);

  socket.on("join", function (data) {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnect");
  });

  socket.on("reset", function () {
    io.emit("reset");
    console.log("reset video");
  });

  socket.on("skip", function (value) {
    io.emit("skip", value);
    console.log("skip video");
  });

  socket.on("playPause", function (data) {
    io.emit("playPause", data);
  });

  socket.on("current", function (data) {
    io.emit("current", data);
  });
});

server.listen(8080, function () {
  console.log("Listening on port 8080!");
});
