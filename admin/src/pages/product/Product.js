import React from "react";
import classes from "./Product.module.css";
import usePriceTypes from "../../hooks/use-pricetypes";
import { Link } from "react-router-dom";

const Product = (props) => {
  const { product, onDeleteProduct } = props;
  const { Dot } = usePriceTypes();

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

  const url = validURL(product.img1);

  return (
    <tr className={`${classes.product}`}>
      <td>{product._id}</td>
      <td>{product.name}</td>
      <td>{Dot(product.price)}</td>
      <td>
        <img
          src={
            url
              ? product.img1
              : `https://backend-ass3.onrender.com/${product.img1}`
          }
          alt={product.name}
        />
      </td>
      <td>{product.category}</td>
      <td>{product.count}</td>
      <td>
        <Link to={`/admin/update-product/` + product._id}>Update</Link>
        <Link to="#" onClick={onDeleteProduct.bind(null, product._id)}>
          Delete
        </Link>
      </td>
    </tr>
  );
};
export default Product;
