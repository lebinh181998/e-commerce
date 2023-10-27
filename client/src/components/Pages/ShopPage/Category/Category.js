import React from "react";
import classes from "./Category.module.css";

const Category = (props) => {
  return (
    <ul className={`${classes.categories}`}>
      <li>
        <p>APPLE</p>
        <ul className={`${classes.category}`}>
          <li
            onClick={props.onShowCategory.bind(null, { category: "all" })}
            id="all"
          >
            All
          </li>
        </ul>
      </li>

      <li>
        <p>IPHONE & MAC</p>
        <ul className={`${classes.category}`}>
          <li
            onClick={props.onShowCategory.bind(null, { category: "iphone" })}
            id="iphone"
          >
            Iphone
          </li>
          <li
            onClick={props.onShowCategory.bind(null, { category: "ipad" })}
            id="ipad"
          >
            Ipad
          </li>
          <li
            onClick={props.onShowCategory.bind(null, { category: "macbook" })}
            id="macbook"
          >
            Macbook
          </li>
        </ul>
      </li>

      <li>
        <p>WIRELESS</p>
        <ul className={`${classes.category}`}>
          <li
            onClick={props.onShowCategory.bind(null, { category: "airpod" })}
            id="airpod"
          >
            Airpod
          </li>
          <li
            onClick={props.onShowCategory.bind(null, { category: "watch" })}
            id="watch"
          >
            Watch
          </li>
        </ul>
      </li>

      <li>
        <p>OTHER</p>
        <ul className={`${classes.category}`}>
          <li
            onClick={props.onShowCategory.bind(null, { category: "mouse" })}
            id="mouse"
          >
            Mouse
          </li>
          <li
            onClick={props.onShowCategory.bind(null, { category: "keyboard" })}
            id="keyboard"
          >
            Keyboard
          </li>
          <li
            onClick={props.onShowCategory.bind(null, { category: "other" })}
            id="other"
          >
            Other
          </li>
        </ul>
      </li>
    </ul>
  );
};
export default Category;
