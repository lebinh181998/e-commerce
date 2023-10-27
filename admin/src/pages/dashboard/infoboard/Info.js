import React, { useEffect } from "react";
import classes from "./Info.module.css";

const Info = (props) => {
  const { title, content, icon } = props;
  return (
    <div className={`${classes.info}`}>
      <div className={``}>
        <p className={`fs-4 fw-bold text-dark ${classes.content}`}>
          <span>{content}</span>
          {typeof content === "string" && <span className="fs-6">VND</span>}
        </p>
        <p className={`${classes.title} mb-2`}>{title}</p>
      </div>
      <div className={``}>
        <i className={`${icon} ${classes.icon} p-2 rounded-1 fs-5 `}></i>
      </div>
    </div>
  );
};
export default React.memo(Info);
