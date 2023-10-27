import React, { useState } from "react";
import classes from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";

const Login = () => {
  const { SendToServer, isLoading } = useHttp();

  const {
    valueInput: valueUsername,
    valueErrorInput: valueErrorUsername,
    eventChangeInput: eventChangeUsername,
    onSetValueErrorInput: onSetValueErrorUsername,
  } = useInput(() => {});

  const {
    valueInput: valuePassword,
    valueErrorInput: valueErrorPassword,
    eventChangeInput: eventChangePassword,
    onSetValueErrorInput: onSetValueErrorPassword,
  } = useInput(() => {});

  //kiểm tra đăng nhập
  const navigate = useNavigate();
  const resolveFetchData = (data, err) => {
    if (!err) {
      if (data.user.role === "User") {
        SendToServer("/logout", (data, err) => {
          if (!err) {
            alert("This account is not Admin");
            navigate("/admin/login");
          }
        });
      } else {
        navigate("/admin");
      }
    } else {
      if (data.errors) {
        data.errors.map((error) => {
          if (error.path === "username") {
            onSetValueErrorUsername(error.msg);
          }
          if (error.path === "password") {
            onSetValueErrorPassword(error.msg);
          }
        });
      } else {
        alert(data.message);
      }
    }
  };
  const onSubmitLogin = (e) => {
    e.preventDefault();
    const method = "PUT";
    const body = {
      username: valueUsername,
      password: valuePassword,
    };
    const headers = { "Content-Type": "application/json" };
    SendToServer(
      "/login",
      resolveFetchData,
      method,
      JSON.stringify(body),
      headers
    );
  };

  return (
    <div className={`${classes["login-container"]}`}>
      <img src="/img/banner1.jpg" />
      <div className={`${classes["login-form"]}`}>
        <h3 className="text-center text-black-50">Sign In</h3>
        <form onSubmit={onSubmitLogin} className="">
          <input
            type="text"
            style={{
              borderBottom: `${
                valueErrorUsername.trim() !== "" ? "1px solid #e3e3e3" : "none"
              }`,
            }}
            placeholder="Username"
            onChange={eventChangeUsername}
            value={valueUsername}
          />
          {valueErrorUsername.trim() !== "" && (
            <p style={{ fontSize: "14px" }} className="text-danger ">
              {valueErrorUsername}
            </p>
          )}
          <input
            type="password"
            placeholder="Password"
            onChange={eventChangePassword}
            value={valuePassword}
          />
          {valueErrorPassword.trim() !== "" && (
            <p style={{ fontSize: "14px" }} className="text-danger">
              {valueErrorPassword}
            </p>
          )}
          <input
            type="submit"
            className={`text-light ${classes["not-action"]}`}
            value={isLoading ? "LOGGING IN..." : "SIGN IN"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};
export default Login;
