import React, { useEffect, useState } from "react";
import classes from "./CheckoutPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import usePriceTypes from "../../../hook/use-pricetypes";
import useHttp from "../../../hook/use-http";
import useInput from "../../../hook/use-input";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const { Dot, Total } = usePriceTypes();
  const { SendToServer, isLoading } = useHttp();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.account.isLogin);

  const {
    valueInput: valueFullName,
    valueErrorInput: valueErrorFullName,
    eventChangeInput: eventChangeFullName,
    onSetValueErrorInput: onSetValueErrorFullName,
    resetInput: resetFullName,
  } = useInput(() => {});

  const {
    valueInput: valueEmail,
    valueErrorInput: valueErrorEmail,
    eventChangeInput: eventChangeEmail,
    onSetValueErrorInput: onSetValueErrorEmail,
    resetInput: resetEmail,
  } = useInput(() => {});

  const {
    valueInput: valuePhoneNumber,
    valueErrorInput: valueErrorPhoneNumber,
    eventChangeInput: eventChangePhoneNumber,
    onSetValueErrorInput: onSetValueErrorPhoneNumber,
    resetInput: resetPhoneNumber,
  } = useInput(() => {});

  const {
    valueInput: valueAddress,
    valueErrorInput: valueErrorAddress,
    eventChangeInput: eventChangeAddress,
    onSetValueErrorInput: onSetValueErrorAddress,
    resetInput: resetAddress,
  } = useInput(() => {});

  useEffect(() => {
    SendToServer("/cart", (data, err) => {
      if (!err) {
        // console.log(data.cart);
        setCart(data.cart);
      } else {
        alert(data.message);
        if (!isLogin) {
          navigate("/login");
        }
      }
    });
  }, [isLogin]);

  const onSubmitCheckout = (e) => {
    e.preventDefault();
    const method = "POST";
    const body = {
      fullName: valueFullName,
      email: valueEmail,
      phoneNumber: valuePhoneNumber,
      address: valueAddress,
      total: Total(cart),
    };
    const headers = { "Content-Type": "application/json" };
    SendToServer(
      "/create-order",
      (data, err) => {
        if (!err) {
          alert(data.message);
          navigate("/history");
        } else {
          if (data.errors) {
            data.errors.map((error) => {
              if (error.path === "fullName") {
                onSetValueErrorFullName(error.msg);
              }
              if (error.path === "email") {
                onSetValueErrorEmail(error.msg);
              }
              if (error.path === "phoneNumber") {
                onSetValueErrorPhoneNumber(error.msg);
              }
              if (error.path === "address") {
                onSetValueErrorAddress(error.msg);
              }
            });
          } else {
            alert(data.message);
          }
        }
      },
      method,
      JSON.stringify(body),
      headers
    );
  };

  return (
    <div className={`${classes["checkout-container"]}`}>
      <div className="current-page">
        <h1>Checkout</h1>
        <div className="url-page">
          <Link to={`/`}>HOME</Link>
          <Link to={`/cart`}>CART</Link>
          <Link to={`/checkout`}>CHECKOUT</Link>
        </div>
      </div>
      <h3>BILLING DETAILS</h3>
      <div className={`${classes["checkout-form"]}`}>
        <form onSubmit={onSubmitCheckout} noValidate>
          <div className="mb-4">
            <div className={`${classes["text-input"]}`}>
              <label htmlFor="fullname">FULL NAME:</label>
              {valueErrorFullName.trim() !== "" && (
                <span>{valueErrorFullName}</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter Your Full Name Here!"
              id="fullname"
              onChange={eventChangeFullName}
              value={valueFullName}
            />
          </div>
          <div className="mb-4">
            <div className={`${classes["text-input"]}`}>
              <label htmlFor="email">EMAIL:</label>
              {valueErrorEmail.trim() !== "" && <span>{valueErrorEmail}</span>}
            </div>
            <input
              type="email"
              placeholder="Enter Your Email Here!"
              id="email"
              onChange={eventChangeEmail}
              value={valueEmail}
            />
          </div>
          <div className="mb-4">
            <div className={`${classes["text-input"]}`}>
              <label htmlFor="phone">PHONE NUMBER:</label>
              {valueErrorPhoneNumber.trim() !== "" && (
                <span>{valueErrorPhoneNumber}</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter Your Phone Number Here!"
              id="phone"
              onChange={eventChangePhoneNumber}
              value={valuePhoneNumber}
            />
          </div>
          <div className="mb-4">
            <div className={`${classes["text-input"]}`}>
              <label htmlFor="address">ADDRESS:</label>
              {valueErrorAddress.trim() !== "" && (
                <span>{valueErrorAddress}</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter Your Address Here!"
              id="address"
              onChange={eventChangeAddress}
              value={valueAddress}
            />
          </div>
          <button
            type="submit"
            className="bg-dark text-light py-2 px-3 border-0 fw-light"
          >
            Place Order
          </button>
        </form>
      </div>
      <div className={`${classes["checkout-total"]}`}>
        <h4 className="mb-3">YOUR ORDER</h4>
        {cart.map((item) => (
          <div
            key={item.product._id}
            className={`${classes.total} mt-2 border-bottom`}
          >
            <p className="fw-semibold text-dark">{item.product.name}</p>
            <p className="">
              {Dot(item.product.price)} VND x {item.quantity}
            </p>
          </div>
        ))}
        <div className={`${classes.total} mt-2`}>
          <p className="fw-bolder fs-6 text-dark">TOTAL</p>
          <p className="text-dark fs-5 text-end">
            {Dot(String(Total(cart)))} VND
          </p>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
