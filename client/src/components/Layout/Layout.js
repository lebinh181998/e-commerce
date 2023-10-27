import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

import classes from "./Layout.module.css";
import LiveChat from "../LiveChat/LiveChat";
import useHttp from "../../hook/use-http";
import { useDispatch } from "react-redux";
import { accountActions } from "../../store/reducerAccount";
// import connectSocket from "socket.io-client";

const Layout = () => {
  const { SendToServer, isLoading, isConnect } = useHttp();
  const dispatch = useDispatch();

  const resolveDataFetch = (data, err) => {
    if (!err) {
      onSetTimeLogout();
      dispatch(accountActions.ON_LOGIN(data.user));
      // const socket = connectSocket("http://localhost:5000", {
      //   transports: ["websocket"],
      // });
      // socket.on("messages", (data) => {
      //   console.log(data);
      // });
      // socket.emit("messages", { action: "send" });
    }
  };

  const fetchCheckLogin = () => {
    SendToServer("/check-login", resolveDataFetch);
  };
  useEffect(() => {
    fetchCheckLogin();
  }, []);

  const onSetTimeLogout = () => {
    setTimeout(() => {
      SendToServer("/logout", (data, err) => {
        if (!err) {
          dispatch(accountActions.ON_LOGOUT());
        }
      });
    }, 60 * 60 * 10000);
  };

  return (
    <div id="body-container" className={`${classes["body-container"]}`}>
      <div className="container">
        <NavBar />
        <Outlet />
      </div>
      <Footer />
      <LiveChat />
      <div id="popup-product" className={`${classes["popup-product"]}`}></div>
    </div>
  );
};
export default Layout;
