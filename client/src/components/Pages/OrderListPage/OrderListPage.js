import React, { useEffect, useState } from "react";
import classes from "./OrderListPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import useHttp from "../../../hook/use-http";
import { useSelector } from "react-redux";
import usePriceTypes from "../../../hook/use-pricetypes";

const OrderListPage = () => {
  const { SendToServer, isLoading } = useHttp();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.account.isLogin);
  const { Dot } = usePriceTypes();

  useEffect(() => {
    // window.scrollTo(0, 0);
    SendToServer(`/orders`, (data, err) => {
      if (!err) {
        setOrders(data.orders);
      } else {
        alert(data.message);
        if (!isLogin) {
          navigate("/login");
        }
      }
    });
  }, [isLogin]);

  return (
    <div className={`${classes.orders}`}>
      <div className="current-page">
        <h1>HISTORY</h1>
        <div className="url-page">
          <Link to={`/shop`}>HISTORY</Link>
        </div>
      </div>

      <div className={`${classes["orders-container"]}`}>
        {isLoading && <h3 className="text-center">Loading...</h3>}
        {!isLoading && orders.length <= 0 && (
          <h3 className="text-center">No ORDER</h3>
        )}
        {orders.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID ORDER</th>
                <th>ID USER</th>
                <th>NAME</th>
                <th>PHONE</th>
                <th>ADDRESS</th>
                <th>TOTAL</th>
                <th>DELIVERY</th>
                <th>STATUS</th>
                <th>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user}</td>
                    <td>{order.fullName}</td>
                    <td>{order.phoneNumber}</td>
                    <td>{order.address}</td>
                    <td>{Dot(order.total)} VND</td>
                    <td>
                      {order.status ? "Progessed" : "Waiting for progressing"}
                    </td>
                    <td>{order.status ? "Done" : "Waiting for pay"}</td>
                    <td>
                      <Link to={`/history/${order._id}`}>
                        View <i className="fa fa-long-arrow-right p-0"></i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default OrderListPage;
