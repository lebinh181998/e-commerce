import React, { useEffect, useState } from "react";
import classes from "./OrderPage.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../hook/use-http";
import { useSelector } from "react-redux";
import usePriceTypes from "../../../hook/use-pricetypes";

const OrderPage = () => {
  const { SendToServer, isLoading } = useHttp();
  const [order, setOrder] = useState({});
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.account.isLogin);
  const { Dot } = usePriceTypes();
  const params = useParams();
  useEffect(() => {
    // window.scrollTo(0, 0);
    SendToServer(`/orders/` + params.orderID, (data, err) => {
      if (!err) {
        setOrder(data.order);
      } else {
        alert(data.message);
        if (!isLogin) {
          navigate("/login");
        }
      }
    });
  }, [isLogin]);

  const validURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  return (
    <div className={`${classes["order-container"]}`}>
      <h1>INFORMATION ORDER</h1>
      <div className={`${classes["info-order"]}`}>
        <p>ID User: {order._id}</p>
        <p>Full Name: {order.fullName}</p>
        <p>Phone: {order.phoneNumber}</p>
        <p>Address: {order.address}</p>
        <p>Total: {order.total && Dot(order.total)} VND</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID PRODUCT</th>
            <th>IMAGE</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>COUNT</th>
          </tr>
        </thead>
        <tbody>
          {order.products &&
            order.products.map((item, i) => {
              return (
                <tr key={item.product._id}>
                  <td>{item.product._id}</td>
                  <td>
                    <img
                      src={
                        validURL(item.product.img1)
                          ? item.product.img1
                          : `https://backend-ass3.onrender.com/${item.product.img1}`
                      }
                      alt={item.product.name}
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>{Dot(item.product.price)} VND</td>
                  <td>{item.quantity}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default OrderPage;
