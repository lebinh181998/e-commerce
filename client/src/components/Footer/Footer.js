import { NavLink } from "react-router-dom";
import React from "react";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={classes.footer}>
      <div className="container">
        <div className="row">
          <div className="col-4">
            <h4>CUSTOMER SERVICES</h4>
            <ul className={classes["footer-li-list"]}>
              <li>
                <a href="#">Help & Contact Us</a>
              </li>
              <li>
                <a href="#">Returns & Refunds</a>
              </li>
              <li>
                <a href="#">Online Stores</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
            </ul>
          </div>
          <div className="col-4">
            <h4>COMPANY</h4>
            <ul className={classes["footer-li-list"]}>
              <li>
                <a href="#">What We Do</a>
              </li>
              <li>
                <a href="#">Available Services</a>
              </li>
              <li>
                <a href="#">Latest Posts</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
            </ul>
          </div>
          <div className="col-4">
            <h4>SOCIAL MEDIA</h4>
            <ul className={classes["footer-li-list"]}>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Pinterest</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
