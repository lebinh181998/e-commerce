import React, { useEffect, useState } from "react";
import classes from "./Orders.module.css";
import useHttp from "../../../hooks/use-http";
import Order from "./Order";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { SendToServer, isLoading } = useHttp();
  const isLogin = useSelector((state) => state.account.isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    // window.scrollTo(0, 0);
    SendToServer(`/admin/orders`, (data, err) => {
      if (!err) {
        // console.log(data);
        setOrders(data.orders);
      } else {
        alert(data.message);
      }
    });
  }, []);

  return (
    <div className={`${classes.orders}`}>
      <p className="fs-4">History</p>
      {isLoading && (
        <p className="text-center text-black-50">Loading today...</p>
      )}
      {!isLoading && orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                <p>ID User</p>
              </th>
              <th>
                <p>Name</p>
              </th>
              <th>
                <p>Phone</p>
              </th>
              <th>
                <p>Address</p>
              </th>
              <th>
                <p>Total</p>
              </th>
              <th>
                <p>Delivery</p>
              </th>
              <th>
                <p>Status</p>
              </th>
              <th>
                <p>Detail</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const curDate = new Date();
              const orderDate = new Date(order.createdAt);
              if (
                curDate.getDate() === orderDate.getDate() &&
                curDate.getMonth() + 1 === orderDate.getMonth() + 1 &&
                curDate.getFullYear() === orderDate.getFullYear()
              ) {
                return <Order key={order._id} order={order} />;
              } else {
                return;
              }
            })}
          </tbody>
        </table>
      )}
      {!isLoading && orders.length <= 0 && <h3>No order.</h3>}
    </div>
  );
};
export default Orders;
