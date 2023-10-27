import React from "react";
import classes from "./Order.module.css";
import { Link } from "react-router-dom";
import usePriceTypes from "../../../hooks/use-pricetypes";

const Order = (props) => {
  const { order } = props;
  const { Dot } = usePriceTypes();

  return (
    <tr className={`${classes.order}`}>
      <td>{order.user}</td>
      <td>{order.fullName}</td>
      <td>{order.phoneNumber}</td>
      <td>{order.address}</td>
      <td>{Dot(order.total)}</td>
      <td>{order.status ? "Đã Vận Chuyển" : "Chưa Vận Chuyển"}</td>
      <td>{order.status ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</td>
      <td>
        <Link to={`/admin/orders/` + order._id}>View</Link>
      </td>
    </tr>
  );
};
export default Order;
