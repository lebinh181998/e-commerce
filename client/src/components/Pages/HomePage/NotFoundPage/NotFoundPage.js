import React, { useEffect } from "react";
import NavBar from "../../../NavBar/NavBar";
import useHttp from "../../../../hook/use-http";

const NotFoundPage = () => {
  const { SendToServer } = useHttp();

  useEffect(() => {
    // SendToServer();
  }, []);

  return (
    <div className="container">
      <NavBar />
      <h3 className="text-center mt-5">Not found page.</h3>
    </div>
  );
};
export default NotFoundPage;
