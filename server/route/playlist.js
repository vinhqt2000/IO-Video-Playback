const express = require("express");
const router = express.Router();
const videos = require("../data/data");
const fs = require("fs");
const thumbsupply = require("thumbsupply");

router.get("/", (req, res) => {
  res.json(videos);
});

router.get("/:id/data", (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.json(videos[id]);
});

// chiếu phìm= tên file
router.get("/video/:id", (req, res) => {
  const videoPath = `store/${req.params.id}.mp4`;
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

router.get("/video/:id/poster", (req, res) => {
  thumbsupply
    .generateThumbnail(`store/${req.params.id}.mp4`)
    .then((thumb) => res.sendfile(thumb));
});

router.get("/testSocket", (req, res) => {
  res.send({ Response: "Hello World" }).status(200);
});

module.exports = router;
