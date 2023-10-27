import React from "react";
import classes from "./Category.module.css";
import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div className={classes.category}>
      <div className={`${classes["box-title"]}`}>
        <p>CAREFULLY CREATED COLLECTIONS</p>
        <h3>BROWSE OUR CATEGORIES</h3>
      </div>
      <div className="row">
        <div className="col-6">
          <Link to="/shop?category=iphone">
            <img src="./img/product_1.png" />
            <div className="img-overlay"></div>
          </Link>
        </div>
        <div className="col-6">
          <Link to="/shop?category=macbook">
            <img src="./img/product_2.png" />
            <div className="img-overlay"></div>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <Link to="/shop?category=ipad">
            <img src="./img/product_3.png" />
            <div className="img-overlay"></div>
          </Link>
        </div>
        <div className="col-4">
          <Link to="/shop?category=watch">
            <img src="./img/product_4.png" />
            <div className="img-overlay"></div>
          </Link>
        </div>
        <div className="col-4">
          <Link to="/shop?category=airpod">
            <img src="./img/product_5.png" />
            <div className="img-overlay"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Category;
