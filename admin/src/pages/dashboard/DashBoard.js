import React from "react";
import classes from "./DashBoard.module.css";
import InfoBoard from "./infoboard/InfoBoard";
import Orders from "./orders/Orders";

const DashBoard = () => {
  return (
    <div className={`${classes.dashboard} p-4`}>
      <p className={`fs-5 mb-5 ${classes.title}`}>Dashboard</p>
      <InfoBoard />
      <Orders />
    </div>
  );
};
export default DashBoard;
