import React from "react";
import classes from "./Other.module.css";

const Other = () => {
  return (
    <div className={classes.other}>
      <div className="row text-center bg-light p-5 m-0">
        <div className={`col-4 ${classes["box-title"]}`}>
          <h4>FREE SHIPPING</h4>
          <p>Free shipping worlwide</p>
        </div>
        <div className={`col-4 ${classes["box-title"]}`}>
          <h4>24 X 7 SERVICE</h4>
          <p>Free shipping worlwide</p>
        </div>
        <div className={`col-4 ${classes["box-title"]}`}>
          <h4>FESTIVAL OFFER</h4>
          <p>Free shipping worlwide</p>
        </div>
      </div>
      <div className="row py-5 m-0">
        <div className={`col-6 text-start ${classes["box-title"]} px-0`}>
          <h4>LET'S BE FRIENDS!</h4>
          <p>Nisi nisi tempor consequat laboris nisi.</p>
        </div>
        <div className="col-6 text-end  px-0">
          <form className="form-group">
            <div className="form-group-input w-75 d-inline-block">
              <input
                type="text"
                className="form-control py-3 rounded-0"
                placeholder="Enter your email address"
              />
            </div>
            <div className="form-group-input w-25 d-inline-block">
              <input
                type="button"
                className="form-control bg-dark py-3 rounded-0 border-dark text-light"
                value="Subscribe"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Other;
