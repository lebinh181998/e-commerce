import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center w-100 mt-5">
      <h1> Not found page</h1>
      <Link to="/admin" className="fs-5">
        back
      </Link>
    </div>
  );
};
export default NotFoundPage;
