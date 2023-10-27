import React, { useEffect, useState } from "react";
import classes from "./Trending.module.css";
import { json, useRouteLoaderData } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../../../../store/reducerProduct";
import ReactDOM from "react-dom";
import Popup from "../Popup/Popup";
import usePriceTypes from "../../../../hook/use-pricetypes";
import useHttp from "../../../../hook/use-http";

const Trending = () => {
  const { Dot } = usePriceTypes();
  const { SendToServer } = useHttp();
  const [products, setProducts] = useState([]);

  // //lấy 8 product
  // const products = [];
  // const data = useRouteLoaderData("home");
  // for (let i = 0; i <= 7; i++) {
  //   products.push(data.products[i]);
  // }
  // console.log(data);

  //ẩn/hiện product ở HomePage
  const isShow = useSelector((state) => state.product.isShow);
  const productShow = useSelector((state) => state.product.product);
  const dispatch = useDispatch();
  const onShowProduct = (e) => {
    dispatch(productActions.SHOW_POPUP(products[e.target.id]));
  };
  const productHide = () => {
    dispatch(productActions.HIDE_POPUP());
  };

  useEffect(() => {
    SendToServer("/products/trending", (data, err) => {
      if (!err) {
        setProducts(data.products);
      } else {
        alert(data.message);
      }
    });
  }, []);

  return (
    <div className={classes.trending}>
      <div className={classes["box-title"]}>
        <p>MADE THE HARD WAY</p>
        <h3>TOP TRENDING PRODUCTS</h3>
      </div>
      <div className="row">
        {products.map((product, i) => {
          return (
            <div key={product._id} className="col-3">
              <div className={`position-relative  ${classes.pointer}`}>
                <img src={product.img1} alt={product.short_desc} />
                <div
                  id={i}
                  onClick={onShowProduct}
                  className="img-overlay"
                ></div>
              </div>
              <div className={classes["product-info"]}>
                <p
                  id={i}
                  onClick={onShowProduct}
                  className={`${classes.pointer}`}
                >
                  {product.name}
                </p>
                <p>{Dot(product.price)} VND</p>
              </div>
            </div>
          );
        })}
      </div>
      {isShow &&
        ReactDOM.createPortal(
          <div
            onClick={productHide}
            className={`${classes["body-overlay"]}`}
          ></div>,
          document.getElementById("body-container")
        )}
      {isShow &&
        ReactDOM.createPortal(
          <Popup product={productShow} productHide={productHide} />,
          document.getElementById("popup-product")
        )}
    </div>
  );
};
export default Trending;

export async function loader() {
  const res = await fetch("https://backend-ass3.onrender.com/products");
  // if (!res.status === 500) {
  //   return json(
  //     {
  //       message: "check url",
  //     },
  //     { status: 500 }
  //   );
  // }

  return res;
}
