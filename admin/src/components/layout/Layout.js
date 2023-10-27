import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./Layout.module.css";
import Sidebar from "../../pages/dashboard/sidebar/Sidebar";
import useHttp from "../../hooks/use-http";
import { useDispatch } from "react-redux";
import { accountActions } from "../../store/accountReducer";
// import connectSocket from "socket.io-client";

const Layout = () => {
  const isLogin = useSelector((state) => state.account.isLogin);
  const navigate = useNavigate();
  const { SendToServer, isLoading } = useHttp();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLogin) {
      SendToServer("/check-admin", (data, err) => {
        if (!err) {
          onSetTimeLogout();
          dispatch(accountActions.ON_LOGIN(data.user));
          // const socket = connectSocket("http://localhost:5000", {
          //   transports: ["websocket"],
          // });
          // socket.on("messages", (data) => {
          //   console.log(data);
          // });
          // socket.emit("messages", "asdas");
        } else {
          navigate("/admin/login");
        }
      });
    }
  }, [isLogin]);

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
    <div className={`${classes.layout}`}>
      {!isLoading && (
        <>
          <div className={`${classes["title-page"]} text-primary fs-5`}>
            Admin Page
          </div>
          <Sidebar />
          <div className={`${classes.outlet}`}>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};
export default Layout;
