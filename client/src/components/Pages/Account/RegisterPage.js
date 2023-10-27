import React from "react";
import classes from "./RegisterPage.module.css";
import useInput from "../../../hook/use-input";
import { Link, useNavigate } from "react-router-dom";
import useHttp from "../../../hook/use-http";

const RegisterPage = () => {
  const { SendToServer, isLoading } = useHttp();

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

  const {
    valueInput: valueConfirmPassword,
    valueErrorInput: valueErrorConfirmPassword,
    eventChangeInput: eventChangeConfirmPassword,
    onSetValueErrorInput: onSetValueErrorConfirmPassword,
    resetInput: resetConfirmPassword,
  } = useInput(() => {});

  //kiểm tra đăng ký
  const navigate = useNavigate();
  const resolveFetchData = (data, err) => {
    if (!err) {
      navigate("/login");
    } else {
      if (data.errors) {
        data.errors.map((error) => {
          if (error.path === "username") {
            onSetValueErrorUsername(error.msg);
          }
          if (error.path === "password") {
            onSetValueErrorPassword(error.msg);
          }
          if (error.path === "confirmPassword") {
            onSetValueErrorConfirmPassword(error.msg);
          }
        });
      } else {
        alert(data.message);
      }
    }
  };
  const onSubmitRegister = (e) => {
    e.preventDefault();
    const method = "POST";
    const body = {
      username: valueUsername,
      password: valuePassword,
      confirmPassword: valueConfirmPassword,
    };
    const headers = { "Content-Type": "application/json" };
    SendToServer(
      "/signup",
      resolveFetchData,
      method,
      JSON.stringify(body),
      headers
    );
  };

  return (
    <div className={`${classes["register-container"]}`}>
      <img src="./img/banner1.jpg" />
      <div className={`${classes["register-form"]}`}>
        <h3 className="text-center text-black-50">Sign Up</h3>
        <form onSubmit={onSubmitRegister} className="">
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
            style={{
              borderBottom: `${
                valueErrorPassword.trim() !== "" ? "1px solid #e3e3e3" : "none"
              }`,
            }}
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
            type="password"
            placeholder="Confirm Password"
            onChange={eventChangeConfirmPassword}
            value={valueConfirmPassword}
          />
          {valueErrorConfirmPassword.trim() !== "" && (
            <p style={{ fontSize: "14px" }} className="text-danger">
              {valueErrorConfirmPassword}
            </p>
          )}
          <input
            type="submit"
            className={`text-light ${classes["not-action"]}`}
            value={isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
            disabled={isLoading}
          />
        </form>
        <p className={`text-center mt-5 ${classes.signup}`}>
          Login?
          <Link to="/login" className={`text-primary `}>
            Click
          </Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
