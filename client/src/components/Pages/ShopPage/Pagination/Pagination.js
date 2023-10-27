import React from "react";
import classes from "./Pagination.module.css";
import { Link, NavLink } from "react-router-dom";

const Pagination = (props) => {
  const { products, category, pageParam, maxPage } = props;
  let pageNum = 0;
  const limit = 6;
  return (
    <div className={`${classes.pagination}`}>
      {pageParam > 1 && (
        <Link to={`?category=${category}&page=${Number(pageParam) - 1}`}>
          <i className="fa fa-angle-double-left"></i>
        </Link>
      )}

      <p className={classes.active}>{pageParam}</p>

      {pageParam < maxPage && (
        <Link to={`?category=${category}&page=${Number(pageParam) + 1}`}>
          <i className="fa fa-angle-double-right"></i>
        </Link>
      )}
    </div>
  );
};
export default Pagination;
