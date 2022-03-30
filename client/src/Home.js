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
<h2>RẠP CHIẾU PHIM</h2>

  return (
    <div className="App App-header">
      <div className="container">
      
      <h3>PHIM HAY TRONG TUẦN</h3>
      <br></br>
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
          <div class="container">
            <div class="row">
              <div class="col-md-3">
                <br></br>
              
              <h5>Contact: tranminhtamhutech@gmail.com</h5>
              <h5>Phone: 0333387818</h5>
                </div> 
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}
