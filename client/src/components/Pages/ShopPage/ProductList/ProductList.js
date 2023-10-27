import React from "react";
import classes from "./ProductList.module.css";
import Pagination from "../Pagination/Pagination";
import ProductItem from "./ProductItem";

const ProductList = (props) => {
  const { products, category, pageParam, limit } = props;

  return (
    <>
      <div className={`row`}>
        {products.length > 0 &&
          products.map((product) => {
            return (
              product && <ProductItem key={product._id} product={product} />
            );
          })}
      </div>
    </>
  );
};
export default React.memo(ProductList);
