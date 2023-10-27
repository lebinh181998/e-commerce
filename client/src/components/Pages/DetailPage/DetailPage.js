import React, { useEffect } from "react";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import classes from "./DetailPage.module.css";
import ProductItem from "../ShopPage/ProductList/ProductItem";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/reducerCart";
import usePriceTypes from "../../../hook/use-pricetypes";
import useHttp from "../../../hook/use-http";

const DetailPage = () => {
  const { SendToServer, isLoading } = useHttp();
  const data = useRouteLoaderData("home");
  const param = useParams();
  const productId = data.products.findIndex(
    (item) => item._id == param.productId
  );
  const product =
    data.products && data.products[productId] ? data.products[productId] : null;
  const [quantity, setQuantity] = useState(1);
  const { Dot } = usePriceTypes();
  const navigate = useNavigate();
  const [productByCategory, setProductByCategory] = useState([]);
  const isLogin = useSelector((state) => state.account.isLogin);

  //tăng số lượng
  const increaseQuantity = (quantity) => {
    setQuantity(quantity);
  };

  //giảm số lượng
  const descreaseQuantity = (quantity) => {
    if (quantity >= 1) {
      setQuantity(quantity);
    }
  };

  // thêm sản phẩm vào strore
  const resolveFetchData = (data, err) => {
    if (!err) {
      alert(data.message);
      navigate("/cart");
    } else {
      alert(data.message);
    }
  };
  const onAddCart = () => {
    const method = "PUT";
    const body = {
      ...product,
      quantity,
    };
    const headers = { "Content-Type": "application/json" };
    SendToServer(
      "/update-cart",
      resolveFetchData,
      method,
      JSON.stringify(body),
      headers
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      //lấy sản phẩm cùng category với product hiện tại
      SendToServer(
        "/products/categories?category=" + product.category,
        (data, err) => {
          if (!err) {
            setProductByCategory(
              data.products.filter((item) => item._id !== product._id)
            );
          } else {
            alert(data.message);
          }
        }
      );
      //lấy quantity từ cart để show ở detailpage nếu người dùng quay lại trang này
      if (isLogin) {
        SendToServer("/cart", (data, err) => {
          if (!err) {
            const prod = data.cart.find(
              (item) => param.productId === item.product._id
            );

            if (prod) {
              setQuantity(prod.quantity);
            } else {
              setQuantity(1);
            }
          } else {
            alert(data.message);
          }
        });
      }
    } else {
      alert("Not found product");
      navigate("/");
    }
  }, [product]);

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
    <div className={`${classes.detail}`}>
      {/* info */}
      {product && (
        <>
          <div className={`${classes["product-info"]}`}>
            <div className={`${classes["img-container"]}`}>
              <img
                src={
                  validURL(product.img1)
                    ? product.img1
                    : `https://backend-ass3.onrender.com/${product.img1}`
                }
                alt={product.name}
              />
            </div>
            <div className={`${classes.info} ${classes["box-title"]}`}>
              <h2>{product.name}</h2>
              <p>{Dot(product.price)} VND</p>
              <p>{product.short_desc}</p>
              <p>
                <strong className="text-dark">CATEGORY: </strong>
                {product.category}
              </p>
              <div className={`${classes["add-cart"]}`}>
                <p>QUANTITY</p>
                <p onClick={descreaseQuantity.bind(null, quantity - 1)}>
                  <i className="fa fa-caret-left"></i>
                </p>
                <p>{quantity}</p>
                <p onClick={increaseQuantity.bind(null, quantity + 1)}>
                  <i className="fa fa-caret-right"></i>
                </p>
                <p onClick={onAddCart}>Add to cart</p>
              </div>
            </div>
          </div>

          {/* description */}
          <div
            className={`${classes["product-description"]} ${classes["box-title"]}`}
          >
            <p>DESCRIPTION</p>
            <h4>PRODUCT DESCRIPTION</h4>
            <div className={classes.feature}>
              {product.long_desc.split("\n").map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>

          {/* related */}
          <div className={`${classes.related}`}>
            <h4>RELATED PRODUCTS</h4>
            <div className="row">
              {productByCategory.map(
                (prod) =>
                  prod._id !== product._id && (
                    <ProductItem key={prod._id} product={prod} />
                  )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DetailPage;
