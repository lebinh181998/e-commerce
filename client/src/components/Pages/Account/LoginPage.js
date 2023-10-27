import React, { useState } from "react";
import classes from "./LoginPage.module.css";
import useInput from "../../../hook/use-input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { accountActions } from "../../../store/reducerAccount";
import useHttp from "../../../hook/use-http";

const LoginPage = () => {
  const { SendToServer, isLoading } = useHttp();
  const dispatch = useDispatch();

  const {
    valueInput: valueUsername,
    valueErrorInput: valueErrorUsername,
    eventChangeInput: eventChangeUsername,
    onSetValueErrorInput: onSetValueErrorUsername,
    resetInput: resetUsername,
  } = useInput(() => {});

  const {
    valueInput: valuePassword,
    valueErrorInput: valueErrorPassword,
    eventChangeInput: eventChangePassword,
    onSetValueErrorInput: onSetValueErrorPassword,
    resetInput: resetPassword,
  } = useInput(() => {});

  //kiểm tra đăng nhập
  const navigate = useNavigate();
  const resolveFetchData = (data, err) => {
    if (!err) {
      dispatch(accountActions.ON_LOGIN(data.user));
      navigate("/");
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
      <img src="./img/banner1.jpg" />
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
        <p className={`text-center mt-5 ${classes.signup}`}>
          Create an account?
          <Link to="/register" className={`text-primary `}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
