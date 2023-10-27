import React from "react";
import classes from "./Popup.module.css";
import { useNavigate } from "react-router-dom";
import usePriceTypes from "../../../../hook/use-pricetypes";

const Popup = (props) => {
  const { product, productHide } = props;
  const { Dot } = usePriceTypes();

  const navigate = useNavigate();
  const onGoDetail = () => {
    productHide();
    navigate(`/detail/${product._id}`);
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
    <div className={`${classes["popup-product"]}`}>
      <div className={`${classes["popup-page"]}`}>
        <div className={`${classes["hide-popup"]}`}>
          <p onClick={productHide}>X</p>
        </div>
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
        <div className={`${classes["product-info"]} ${classes["box-title"]}`}>
          <h4>{product.name}</h4>
          <p>{Dot(product.price)} VND</p>
          <p>{product.short_desc}</p>
          <button onClick={onGoDetail}>
            <i className={`fa fa-shopping-cart`}></i>View Detail
          </button>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Popup);
