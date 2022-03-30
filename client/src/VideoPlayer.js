import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const host = "http://localhost:8080";

function VideoPlayer() {
  const params = useParams();
  const [flim, SetFLim] = useState([]);
  const videoRef = useRef();
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io.connect(host);
    const FetchData = async () => {
      await axios
        .get(`http://localhost:8080/media//${params.id}/data`)
        .then((res) => {
          // console.log(res);
          SetFLim(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    FetchData();

    // socketRef.current.on("connect", function (data) {
    //   socketRef.current.emit("join", "hello from client");
    // });
    socketRef.current.on("current", function (data) {
      videoRef.current.currentTime = data;
    });
    socketRef.current.on("playPause", function (data) {
      if (data === "play") {
        videoRef.current.play();
      } else if (data === "pause") {
        videoRef.current.pause();
      }
    });
    socketRef.current.on("reset", function () {
      videoRef.current.currentTime = 0;
    });
    socketRef.current.on("skip", function (value) {
      videoRef.current.currentTime += value;
    });
  }, [params.id]);

  // socket.on("current", function (data) {
  //   videoRef.current.currentTime = data;
  // });

  const handlePlayVideo = () => {
    videoRef.current.play();
    // socket.emit("playPause", "play");
    // socket.emit("current", videoRef.current.currentTime);
    socketRef.current.emit("playPause", "play");
    socketRef.current.emit("current", videoRef.current.currentTime);
    console.log("Play video");
  };
  const handlePauseVideo = () => {
    videoRef.current.pause();
    socketRef.current.emit("playPause", "pause");
    socketRef.current.emit("current", videoRef.current.currentTime);
    console.log("Pause Video");
  };
  const handleResetVideo = () => {
    videoRef.current.currentTime = 0;
    socketRef.current.emit("reset");
    console.log("Reset Video");
  };
  const handleSkipForw = (value) => () => {
    videoRef.current.currentTime += value;
    socketRef.current.emit("skip", value);
    socketRef.current.emit("current", videoRef.current.currentTime);
    console.log("Skip 5s");
  };

  const handleSkipBack = (value) => () => {
    videoRef.current.currentTime += value;
    socketRef.current.emit("skip", value);
    socketRef.current.emit("current", videoRef.current.currentTime);
    console.log("Skip -5s");
  };

  function formatDur(thoigian) {
    thoigian = Math.round(thoigian);
    var minute = Math.floor(thoigian / 60);
    var second = Math.floor(thoigian - minute * 60);
    second = second < 10 ? "0" + second : second;
    return minute + ":" + second;
  }

  function CurrentTimeFunction() {
    document.getElementById("currentTime").innerHTML = formatDur(
      videoRef.current.currentTime
    );
  }

  if (!flim.name) {
    return <div>Không có phim</div>;
  }

  return (
    <div>
      <div>
        <Link to="/">Trang chủ</Link>
      </div>
      <div className="container">
        <h1>
          Tên Phim: {flim.tenphim} - {flim.duration}
        </h1>
      </div>
      <video
        controls
        muted
        style={{ height: "500px", width: "1000px" }}
        id="movie"
        name="movie"
        ref={videoRef}
        onTimeUpdate={CurrentTimeFunction}
      >
        <source
          src={`http://localhost:8080/media/video/${flim.name}`}
          type="video/mp4"
        ></source>
      </video>
      <div className="columm" style={{ padding: "10px" }}>
        {/* Video currentTime */}
        <div>
          <b id="currentTime">0:00</b>
        </div>
        {/* Video currentTime */}

        <div style={{ marginBottom: "20px", padding: "10px" }}>
          <button
            id="play"
            onClick={handlePlayVideo}
            className="btn btn-primary"
            style={{ margin: "10px" }}
          >
            <b> Phát</b>
          </button>
          <button
            id="pause"
            onClick={handlePauseVideo}
            className="btn btn-light"
            style={{ margin: "10px" }}
          >
            <b>Dừng</b>
          </button>
          <button
            id="fastFwd"
            onClick={handleSkipForw(5)}
            className="btn btn-warning"
            style={{ margin: "10px" }}
          >
            <b> Tua 5s</b>
          </button>
          <button
            id="rew"
            onClick={handleSkipBack(-5)}
            className="btn btn-info"
            style={{ margin: "10px" }}
          >
            <b>Về 5s</b>
          </button>
          <button
            id="restart"
            onClick={handleResetVideo}
            className="btn btn-danger "
            style={{ margin: "10px" }}
          >
            <b>Reset</b>
          </button>
        </div>
      </div>
    </div>
  );
}
export default VideoPlayer;
