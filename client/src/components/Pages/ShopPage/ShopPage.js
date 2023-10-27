import React, { useEffect, useState } from "react";
import classes from "./ShopPage.module.css";
import {
  useLoaderData,
  useRouteLoaderData,
  useSubmit,
  Link,
} from "react-router-dom";
import ProductList from "./ProductList/ProductList";
import Category from "./Category/Category";
import useHttp from "../../../hook/use-http";
import Pagination from "./Pagination/Pagination";

const ShopPage = () => {
  const data = useRouteLoaderData("home");
  const [products, setProducts] = useState([]);
  const dataParam = useLoaderData();
  const submit = useSubmit();
  const { SendToServer, isLoading } = useHttp();

  //lấy category và page từ url
  const categoryParam =
    dataParam && dataParam.categoryParam ? dataParam.categoryParam : "all";
  let pageParam = dataParam && dataParam.pageParam ? dataParam.pageParam : 1;

  const [category, setCategory] = useState(categoryParam);
  const [page, setPage] = useState(pageParam);
  const [maxPage, setMaxPage] = useState(0);

  //lấy giá trị category từ Category component để lọc product
  const onShowCategory = (data) => {
    // console.log(data);
    if (data.category && category !== data.category) {
      submit({ category: data.category });
      setCategory(data.category);
    }
    if (data.page && page !== data.page) {
      submit({ category: data.page });
      setPage(data.page);
    }
  };
  // console.log(categoryParam, pageParam);
  // console.log(category, page);
  //tìm product bằng cách nhập tên product
  const searchByName = (e) => {
    // console.log(e.target.value);
    const producsBytFilter = data.products.filter(
      (item) =>
        (category === "all" || item.category == category) &&
        item.name.toLowerCase().includes(e.target.value.toLowerCase().trim())
    );

    if (producsBytFilter.length != products.length) {
      setProducts(() => producsBytFilter);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    SendToServer(
      `/products/categories?category=${
        categoryParam === "all" ? "" : categoryParam
      }&&page=${pageParam}`,
      (data, err) => {
        // console.log(data);
        if (!err) {
          setProducts(data.products);
          setMaxPage(data.maxPage);
        } else {
          alert(data.message);
        }
      }
    );
  }, [categoryParam, pageParam]);

  return (
    <div className={`${classes.shop}`}>
      <div className="current-page">
        <h1>Shop</h1>
        <div className="url-page">
          <Link to={`/shop`}>SHOP</Link>
        </div>
      </div>
      <div className={`${classes["category-container"]}`}>
        <h3>CATEGORIES</h3>
        <Category onShowCategory={onShowCategory} />
      </div>
      <div className={`${classes["product-container"]}`}>
        <div className={`${classes.sort_and_search}`}>
          <input
            type="text"
            placeholder="Enter Search Here!"
            onChange={searchByName}
          />
          <select>
            <option value="asc">Default Sorting</option>
            <option value="desc">Desc Sorting</option>
          </select>
        </div>
        {isLoading && <h3 className="text-center">Loading...</h3>}
        {!isLoading && products.length <= 0 && (
          <h3 className="text-center">No products</h3>
        )}
        {!isLoading && (
          <ProductList
            products={products}
            // category={category}
            // pageParam={pageParam}
            // limit={limit}
          />
        )}
        {!isLoading && products.length > 0 && (
          <Pagination
            products={products}
            onShowCategory={onShowCategory}
            category={category}
            pageParam={pageParam}
            maxPage={maxPage}
          />
        )}
      </div>
    </div>
  );
};
export default ShopPage;

export function loader({ request }) {
  const newURL = new URL(request.url);
  const pageParam = newURL.searchParams.get("page");
  const categoryParam = newURL.searchParams.get("category");
  return {
    categoryParam,
    pageParam,
  };
}
