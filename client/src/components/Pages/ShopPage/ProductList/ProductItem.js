import React from "react";
import classes from "./ProductItem.module.css";
import { useNavigate } from "react-router-dom";
import usePriceTypes from "../../../../hook/use-pricetypes";

const ProductItem = (props) => {
  const { product } = props;
  const navigate = useNavigate();
  const { Dot } = usePriceTypes();

  const onShowDetail = () => {
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
    <div className="col-4">
      <div className={`position-relative  ${classes.pointer}`}>
        <img
          src={
            validURL(product.img1)
              ? product.img1
              : `https://backend-ass3.onrender.com/${product.img1}`
          }
          alt={product.short_desc}
        />
        <div onClick={onShowDetail} className="img-overlay"></div>
      </div>
      <div className={classes["product-info"]}>
        <p>{product.name}</p>
        <p>{Dot(product.price)} VND</p>
      </div>
    </div>
  );
};
export default ProductItem;
