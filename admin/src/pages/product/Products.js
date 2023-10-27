import React, { useEffect, useState } from "react";
import classes from "./Products.module.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Product from "./Product";
import useHttp from "../../hooks/use-http";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { SendToServer, isLoading } = useHttp();
  const isLogin = useSelector((state) => state.account.isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    // window.scrollTo(0, 0);
    // console.log(isLogin);
    SendToServer(`/products`, (data, err) => {
      if (!err) {
        // console.log(data);
        setProducts(data.products);
      } else {
        alert(data.message);
        if (!isLogin) {
          navigate("/admin/login");
        }
      }
    });
  }, [isLogin]);

  const onDeleteProduct = (productID) => {
    if (window.confirm("Are you sure delete this product")) {
      SendToServer(
        "/delete-product/" + productID,
        (data, err) => {
          if (!err) {
            alert("Deleted the product");
            setProducts((prev) =>
              prev.filter((product) => product._id !== productID)
            );
            alert(data.message);
          } else {
            alert(data.message);
          }
        },
        "DELETE"
        // null,
        // {"Content-Type": "application/json"}
      );
    }
  };

  return (
    <div className={`${classes.products}`}>
      <div className={`${classes.title}`}>
        <p className="fs-4 mb-0">Products</p>
        <Link to="/admin/new-product">Add New</Link>
      </div>
      <input
        type="text"
        className={`${classes["search-input"]}`}
        placeholder="Enter Search!"
      />
      {isLoading && (
        <p className="text-center text-black-50">Loading products...</p>
      )}
      {products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                <p>ID</p>
              </th>
              <th>
                <p>Name</p>
              </th>
              <th>
                <p>Price</p>
              </th>

              <th>
                <p>Image</p>
              </th>
              <th>
                <p>Category</p>
              </th>
              <th>
                <p>Count</p>
              </th>
              <th>
                <p>Edit</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Product
                key={product._id}
                product={product}
                onDeleteProduct={onDeleteProduct}
              />
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && products.length <= 0 && <h3>No product.</h3>}
    </div>
  );
};
export default Products;
