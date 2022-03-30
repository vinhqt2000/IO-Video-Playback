const app = require("express")();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:8080"],
    method: ["GET", "POSt"],
  },
});

app.get("/", (req, res) => res.sendFile(__dirname + "/test.html"));

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("join", function (data) {
    console.log(data);
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

server.listen(8080, () => console.log("Listening on port 8080"));
