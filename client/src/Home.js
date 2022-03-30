import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Home() {
  const [phim, setPhim] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/media/")
      .then((res) => {
        console.log(res);
        setPhim(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App App-header">
      <div className="container">
        <div className="row">
          {phim.map((item, index) => (
            <div className="col-md-4" key={index}>
              <Link to={`/video/${item.id}`}>
                <div className="card border-0">
                  <img alt={item.tenphim} src={item.hinhanh}></img>
                  <div className="card-body">
                    <p>
                      <b><b>{item.tenphim}</b></b>
                    </p>
                    <p>{item.duration}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
