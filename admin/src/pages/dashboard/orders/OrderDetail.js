import React, { useEffect, useState } from "react";
import classes from "./OrderDetail.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import usePriceTypes from "../../../hooks/use-pricetypes";

const OrderDetail = () => {
  const { SendToServer, isLoading } = useHttp();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.account.isLogin);
  const { Dot } = usePriceTypes();
  const params = useParams();
  useEffect(() => {
    SendToServer(`/orders/` + params.orderID, (data, err) => {
      if (!err) {
        // console.log(data);
        setOrder(data.order);
      } else {
        if (data.message) {
          alert(data.message);
          navigate("/admin");
        } else {
          if (!isLogin) {
            navigate("/admin/login");
          }
        }
      }
    });
  }, [isLogin]);

  const onChangeStatusOrder = (status) => {
    if (!status) {
      if (window.confirm("OK and NOT again?")) {
        SendToServer(
          `/update-order`,
          (data, err) => {
            if (!err) {
              setOrder(data.order);
            } else {
              alert(data.message);
            }
          },
          "PUT",
          JSON.stringify({ orderID: order._id, status: true }),
          { "Content-Type": "application/json" }
        );
      }
    }
  };

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
    <div className={`${classes["order-detail-container"]}`}>
      <h1>INFORMATION ORDER</h1>

      {isLoading && <p>Loading order info...</p>}

      {!isLoading && order && (
        <div className={`${classes["info-order"]}`}>
          <p>ID User: {order._id}</p>
          <p>Full Name: {order.fullName}</p>
          <p>Phone: {order.phoneNumber}</p>
          <p>Address: {order.address}</p>
          <p>Total: {order.total && Dot(order.total)} VND</p>
          <p className={`${classes.status}`}>
            Status:{" "}
            <span>{order.status ? "Đã vận chuyển" : "Chưa vận chuyển"}</span>
            {!order.status && (
              <span onClick={onChangeStatusOrder.bind(null, order.status)}>
                Change
              </span>
            )}
          </p>
        </div>
      )}

      {!isLoading && order && (
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
      )}
    </div>
  );
};
export default OrderDetail;
