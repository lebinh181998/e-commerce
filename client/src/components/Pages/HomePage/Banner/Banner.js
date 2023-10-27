import React from "react";
import classes from "./Banner.module.css";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className={classes["home-banner"]}>
      <img src="./img/banner1.jpg" alt="banner" />
      <div className={classes["description"]}>
        <p>NEW INSPIRATION 2020</p>
        <h3>20% OFF ON NEW SEASON</h3>
        <Link to="/shop">Browse Collections</Link>
      </div>
    </div>
  );
};
export default Banner;
