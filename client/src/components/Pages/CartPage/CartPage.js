import React, { useEffect, useState } from "react";
import classes from "./CartPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import usePriceTypes from "../../../hook/use-pricetypes";
import useHttp from "../../../hook/use-http";
import { useSelector } from "react-redux";

const CartPage = () => {
  const { Dot, Total } = usePriceTypes();
  const { SendToServer, isLoading } = useHttp();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.account.isLogin);

  //tăng/giảm số lượng sản phẩm trong cart
  const onUpdateCart = (productData) => {
    const method = "PUT";
    const body = {
      ...productData.product,
      quantity: productData.quantity,
    };
    const headers = { "Content-Type": "application/json" };
    if (productData.quantity >= 1) {
      SendToServer(
        "/update-cart",
        (data, err) => {
          if (!err) {
            setCart((prev) => {
              const updatedCart = [...prev];
              const productIndex = updatedCart.findIndex(
                (item) => item.product._id === productData.product._id
              );
              if (productIndex >= 0) {
                updatedCart[productIndex].quantity = productData.quantity;
                return updatedCart;
              } else {
                return;
              }
            });
          } else {
            alert(data.message);
          }
        },
        method,
        JSON.stringify(body),
        headers
      );
    }
  };
  //xoá 1 product trong cart
  const onDeleteCart = (productId) => {
    const method = "DELETE";
    const headers = { "Content-Type": "application/json" };
    SendToServer(
      "/cart/" + productId,
      (data, err) => {
        if (!err) {
          setCart((prev) => {
            const updatedCart = [...prev];
            const cart = updatedCart.filter(
              (item) => item.product._id !== productId
            );
            return cart;
          });
        }
        alert(data.message);
      },
      method,
      null,
      headers
    );
  };

  useEffect(() => {
    SendToServer("/cart", (data, err) => {
      if (!err) {
        setCart(data.cart);
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
    <div className={`${classes["cart-container"]}`}>
      <div className="current-page">
        <h1>Cart</h1>
        <div className="url-page">
          <Link to={`/cart`}>CART</Link>
        </div>
      </div>
      <div className={`${classes["list-cart"]}`}>
        {!isLoading && cart.length <= 0 && (
          <h3 className="text-center">No product in cart</h3>
        )}
        {cart.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>IMAGE</th>
                <th className="w-25">PRODUCT</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>TOTAL</th>
                <th>REMOVE</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => {
                const product = item.product;
                const quantity = item.quantity;
                return (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={
                          validURL(product.img1)
                            ? product.img1
                            : `https://backend-ass3.onrender.com/${product.img1}`
                        }
                        alt={product.name}
                      />
                    </td>
                    <td className="fw-bold text-dark fs-6">{product.name}</td>
                    <td className="text-end">{Dot(product.price)} VND</td>
                    <td>
                      <div className={`${classes["update-cart"]}`}>
                        <p
                          onClick={onUpdateCart.bind(null, {
                            product: product,
                            quantity: quantity - 1,
                          })}
                        >
                          <i className="fa fa-caret-left"></i>
                        </p>
                        <p>{quantity}</p>
                        <p
                          onClick={onUpdateCart.bind(null, {
                            product: product,
                            quantity: quantity + 1,
                          })}
                        >
                          <i className="fa fa-caret-right"></i>
                        </p>
                      </div>
                    </td>
                    <td className="text-end">
                      {`${Dot(String(Number(product.price) * quantity))} VND`}
                    </td>
                    <td>
                      <i
                        id={i}
                        onClick={onDeleteCart.bind(null, product._id)}
                        className={`fa fa-trash ${classes.remove}`}
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!isLoading && cart.length > 0 && (
          <div className={`${classes["go-page"]}`}>
            <Link to="/shop">
              <i className="fa fa-long-arrow-left px-2"></i>Continue shopping
            </Link>
            <Link to="/checkout">
              Proceed to checkout<i className="fa fa-long-arrow-right px-2"></i>
            </Link>
          </div>
        )}
      </div>
      <div className={`${classes["cart-total"]}`}>
        <h4 className="mb-3">CART TOTAL</h4>
        <div className={`${classes.total} border-bottom pb-2`}>
          <p className="fw-bolder fs-6 text-dark m-0">SUBTOTAL</p>
          <p className="m-0">{Dot(String(Total(cart)))} VND</p>
        </div>
        <div className={`${classes.total} mt-2`}>
          <p className="fw-bolder fs-6 text-dark">TOTAL</p>
          <p className="text-dark fs-5">{Dot(String(Total(cart)))} VND</p>
        </div>
        <div className={`${classes.coupon} mt-2`}>
          <input type="text" className="p-2 " placeholder="Enter your coupon" />
          <button className="bg-dark text-light p-2">
            <i className="fa fa-gift me-1"></i>Apply coupon
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
