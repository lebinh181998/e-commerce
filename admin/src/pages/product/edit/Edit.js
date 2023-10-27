import React, { useEffect, useState } from "react";
import classes from "./Edit.module.css";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import useInput from "../../../hooks/use-input";

const Edit = () => {
  const { SendToServer, isLoading } = useHttp();
  const isLogin = useSelector((state) => state.account.isLogin);
  const navigate = useNavigate();
  const params = useParams();
  const productID = params.productID ? params.productID : null;
  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const {
    valueInput: valueName,
    valueErrorInput: valueErrorName,
    eventChangeInput: eventChangeName,
    onSetValueErrorInput: onSetValueErrorName,
    onSetFirstValueInput: onSetFirstValueName,
  } = useInput(() => {});
  const {
    valueInput: valueCategory,
    valueErrorInput: valueErrorCategory,
    eventChangeInput: eventChangeCategory,
    onSetValueErrorInput: onSetValueErrorCategory,
    onSetFirstValueInput: onSetFirstValueCategory,
  } = useInput(() => {});
  const {
    valueInput: valuePrice,
    valueErrorInput: valueErrorPrice,
    eventChangeInput: eventChangePrice,
    onSetValueErrorInput: onSetValueErrorPrice,
    onSetFirstValueInput: onSetFirstValuePrice,
  } = useInput(() => {});
  const {
    valueInput: valueShortDesc,
    valueErrorInput: valueErrorShortDesc,
    eventChangeInput: eventChangeShortDesc,
    onSetValueErrorInput: onSetValueErrorShortDesc,
    onSetFirstValueInput: onSetFirstValueShortDesc,
  } = useInput(() => {});
  const {
    valueInput: valueLongDesc,
    valueErrorInput: valueErrorLongDesc,
    eventChangeInput: eventChangeLongDesc,
    onSetValueErrorInput: onSetValueErrorLongDesc,
    onSetFirstValueInput: onSetFirstValueLongDesc,
  } = useInput(() => {});
  const {
    valueInput: valueCount,
    valueErrorInput: valueErrorCount,
    eventChangeInput: eventChangeCount,
    onSetValueErrorInput: onSetValueErrorCount,
    onSetFirstValueInput: onSetFirstValueCount,
  } = useInput(() => {});
  const {
    valueInput: valueImage,
    valueErrorInput: valueErrorImage,
    eventChangeInput: eventChangeImage,
    onSetValueErrorInput: onSetValueErrorImage,
    onSetFirstValueInput: onSetFirstValueImage,
  } = useInput(() => {});

  useEffect(() => {
    if (productID) {
      SendToServer(`/products/` + productID, (data, err) => {
        if (!err) {
          const product = data.product;
          const images = [];
          images.push(product.img1);
          product.img2.trim() !== "" && images.push(product.img2);
          product.img3.trim() !== "" && images.push(product.img3);
          product.img4.trim() !== "" && images.push(product.img4);

          onSetFirstValueName(product.name);
          onSetFirstValueCategory(product.category);
          onSetFirstValuePrice(product.price);
          onSetFirstValueShortDesc(product.short_desc);
          onSetFirstValueLongDesc(product.long_desc);
          onSetFirstValueCount(product.count);
          setImages(images);
        } else {
          if (data.message) {
            alert(data.message);
            navigate("/admin/products");
          } else {
            if (!isLogin) {
              navigate("/admin/login");
            }
          }
        }
      });
    } else {
      onSetFirstValueName("");
      onSetFirstValueCategory("");
      onSetFirstValuePrice("");
      onSetFirstValueShortDesc("");
      onSetFirstValueLongDesc("");
      onSetFirstValueCount("");
    }
  }, [isLogin, productID]);

  const onSubmitEditProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", valueName);
    formData.append("category", valueCategory);
    formData.append("price", valuePrice);
    formData.append("short_desc", valueShortDesc);
    formData.append("long_desc", valueLongDesc);
    formData.append("count", valueCount);
    if (valueImage.length > 0) {
      for (let i = 0; i < valueImage.length; i++) {
        formData.append("images", valueImage[i]);
      }
    }

    if (!productID) {
      SendToServer(
        "/create-product",
        (data, err) => {
          console.log(data);
          if (!err) {
            alert("Created a new product");
            navigate("/admin/products");
          } else {
            errMsgInActionProduct(data.errors);
          }
        },
        "POST",
        formData
      );
    } else {
      formData.append("productID", productID);
      if (deleteImages.length > 0) {
        for (let i = 0; i < deleteImages.length; i++) {
          formData.append("deleteImages", deleteImages[i]);
        }
      }

      SendToServer(
        "/update-product",
        (data, err) => {
          console.log(data);
          if (!err) {
            alert("Updated the product");
            navigate("/admin/products");
          } else {
            errMsgInActionProduct(data.errors);
          }
        },
        "PUT",
        formData
      );
    }
  };

  const onCheckedToDeleteImage = (data) => {
    if (data.checked) {
      setDeleteImages((prev) => [...prev, data.image]);
    } else {
      setDeleteImages((prev) => prev.filter((image) => image !== data.image));
    }
    onSetValueErrorImage("");
  };

  const errMsgInActionProduct = (errors) => {
    errors.map((error) => {
      if (error.path === "name") {
        onSetValueErrorName(error.msg);
      }
      if (error.path === "category") {
        onSetValueErrorCategory(error.msg);
      }
      if (error.path === "price") {
        onSetValueErrorPrice(error.msg);
      }
      if (error.path === "short_desc") {
        onSetValueErrorShortDesc(error.msg);
      }
      if (error.path === "long_desc") {
        onSetValueErrorLongDesc(error.msg);
      }
      if (error.path === "count") {
        onSetValueErrorCount(error.msg);
      }
      if (error.path === "images") {
        onSetValueErrorImage(error.msg);
      }
    });
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
    <div className={`${classes.edit}`}>
      <form onSubmit={onSubmitEditProduct}>
        <div className={classes["form-input-group"]}>
          <label>
            <span>Product Name</span>
            {valueErrorName.trim() !== "" && (
              <span className="text-danger">{valueErrorName}</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter Product Name"
            onChange={eventChangeName}
            value={valueName}
          />
        </div>
        <div className={classes["form-input-group"]}>
          <label>
            <span>Category</span>
            {valueErrorCategory.trim() !== "" && (
              <span className="text-danger">{valueErrorCategory}</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter Category"
            onChange={eventChangeCategory}
            value={valueCategory}
          />
        </div>
        <div className={classes["form-input-group"]}>
          <label>
            <span>Price</span>
            {valueErrorPrice.trim() !== "" && (
              <span className="text-danger">{valueErrorPrice}</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter Price"
            onChange={eventChangePrice}
            value={valuePrice}
          />
        </div>
        <div className={classes["form-input-group"]}>
          <label>
            <span>Count</span>
            {valueErrorCount.trim() !== "" && (
              <span className="text-danger">{valueErrorCount}</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter Count"
            onChange={eventChangeCount}
            value={valueCount}
          />
        </div>
        <div className={classes["form-input-group"]}>
          <label>
            <span>Short Description</span>
            {valueErrorShortDesc.trim() !== "" && (
              <span className="text-danger">{valueErrorShortDesc}</span>
            )}
          </label>
          <textarea
            placeholder="Enter Short Description"
            onChange={eventChangeShortDesc}
            value={valueShortDesc}
          ></textarea>
        </div>
        <div className={classes["form-input-group"]}>
          <label>
            <span>Long Description</span>
            {valueErrorLongDesc.trim() !== "" && (
              <span className="text-danger">{valueErrorLongDesc}</span>
            )}
          </label>
          <textarea
            placeholder="Enter Long Description"
            onChange={eventChangeLongDesc}
            value={valueLongDesc}
          ></textarea>
        </div>
        <div className={classes["form-input-group"]}>
          <label>
            <span>{`Upload Image (4 images)`}</span>
            {valueErrorImage.trim() !== "" && (
              <span className="text-danger">{valueErrorImage}</span>
            )}
          </label>
          <input
            type="file"
            className="border-0 d-inline-block"
            multiple
            onChange={eventChangeImage}
            accept="image/*"
          />
          {productID && (
            <div className={`${classes.images}`}>
              {images.length > 0 &&
                images.map((image, i) => (
                  <div key={image + i} className={`${classes.image}`}>
                    <input
                      id={i}
                      type="checkbox"
                      className={classes.checkbox}
                      onChange={(e) =>
                        onCheckedToDeleteImage({
                          image: image,
                          checked: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor={i}>
                      <img
                        src={
                          validURL(image)
                            ? image
                            : `https://backend-ass3.onrender.com/${image}`
                        }
                        alt={productID}
                      />
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
        <button type="submit">{productID ? "Update" : "Add New"}</button>
      </form>
    </div>
  );
};
export default Edit;
