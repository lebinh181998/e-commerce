const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fs = require("fs");

//lấy tất cả product
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: true, products: products });
  } catch (error) {
    return next(error);
  }
};
//lấy 1 product dựa vào productID
exports.getProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    const isProduct = products.filter(
      (product) => product._id.toString() === req.params.productID.toString()
    );
    let product;
    //lỗi không tìm được product
    if (isProduct.length <= 0) {
      return res
        .status(404)
        .json({ status: false, message: "Not found product" });
    } else {
      product = await Product.findById(req.params.productID);
    }
    res.status(200).json({ status: true, product: product });
  } catch (error) {
    return next(error);
  }
};
//lấy tất cả product dựa vào category và page
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const query = req.query;
    const limit = 6;
    const page = (query.page - 1) * limit;

    let maxPage;
    let products;
    let allProduct;
    if (query.category) {
      allProduct = await Product.find({ category: query.category });
      products = await Product.find({ category: query.category })
        .skip(page)
        .limit(limit);
    } else {
      allProduct = await Product.find();
      products = await Product.find().skip(page).limit(limit);
    }
    maxPage = Math.ceil(allProduct.length / limit);

    res
      .status(200)
      .json({ status: true, products: products, maxPage: maxPage });
  } catch (error) {
    return next(error);
  }
};
//lấy 8 product dắt nhất(không tìm được giá trị để làm logic trending)
exports.getProductsByTrending = async (req, res, next) => {
  try {
    const products = await Product.find().limit(8);
    res.status(200).json({ status: true, products: products });
  } catch (error) {
    return next(error);
  }
};
//tạo 1 product
exports.createProduct = async (req, res, next) => {
  const errResult = validationResult(req);
  const errors = errResult.array();
  const images = req.files;

  //kiểm tra image
  //<=0 || >4: thêm lỗi image
  if (images.length <= 0) {
    errors.push({ path: "images", msg: "Please choose an image" });
  } else if (images.length > 4) {
    errors.push({ path: "images", msg: "Only 4 iamges" });
  }

  //kiểm tra lỗi từ errors validationResult
  //có: phản hồi lỗi
  //không: next
  if (errors.length > 0) {
    //xoá các iamge đã lưu vì tạo product thất bại
    if (images.length > 0) {
      images.map((image) => {
        fs.unlink(image.path, () => {});
      });
    }
    return res.status(422).json({ status: false, errors: errors });
  }

  try {
    const body = req.body;

    const product = new Product({
      name: body.name,
      img1: images[0].path,
      img2: images[1] ? images[1].path : "",
      img3: images[2] ? images[2].path : "",
      img4: images[3] ? images[3].path : "",
      price: body.price,
      count: body.count,
      short_desc: body.short_desc,
      category: body.category,
      long_desc: body.long_desc,
    });
    await product.save();
    res.status(201).json({ status: true, product: product });
  } catch (error) {
    if (images.length > 0) {
      images.map((image) => {
        fs.unlink(image.path, () => {});
      });
    }
    return next(error);
  }
};
//sửa 1 product dựa vào productID
exports.updateProduct = async (req, res, next) => {
  const errResult = validationResult(req);
  const errors = errResult.array();
  const images = req.files;

  try {
    const body = req.body;
    //tạo mảng image cần xoá của product
    let deleteImages = [];
    if (body.deleteImages) {
      deleteImages =
        typeof body.deleteImages === "string"
          ? [...[], body.deleteImages]
          : body.deleteImages;
    }

    const products = await Product.find();
    const isProduct = products.filter(
      (product) => product._id.toString() === body.productID.toString()
    );
    let product;
    //lỗi không tìm được product
    if (isProduct.length <= 0) {
      console.log(1);
      return res
        .status(404)
        .json({ status: false, message: "Not found product" });
    } else {
      product = await Product.findById(body.productID);
    }

    //tạo mảng image đang có trong product
    let productImages = [];
    productImages.push(product.img1);
    product.img2 && productImages.push(product.img2);
    product.img3 && productImages.push(product.img3);
    product.img4 && productImages.push(product.img4);

    if (deleteImages.length > 0) {
      deleteImages.map(
        (image) =>
          (productImages = productImages.filter((img) => img !== image))
      );
    }

    const countImages = productImages.length + images.length;
    //kiểm tra image
    //<=0 || >4: thêm lỗi image
    if (countImages <= 0) {
      errors.push({ path: "images", msg: "Product's image is emptying" });
    } else if (countImages > 4) {
      errors.push({
        path: "images",
        msg: "Product's image is not more than 4 images",
      });
    }
    //kiểm tra lỗi từ errors validationResult
    //có: phản hồi lỗi
    //không: next
    if (errors.length > 0) {
      //xoá các iamge đã lưu vì tạo product thất bại
      if (images.length > 0) {
        images.map((image) => {
          fs.unlink(image.path, () => {});
        });
      }
      return res.status(422).json({ status: false, errors: errors });
    }
    //lưu images vào database
    if (images.length > 0) {
      const mergeImages = [...productImages, ...images];
      mergeImages[0]
        ? (product.img1 = mergeImages[0].path
            ? mergeImages[0].path
            : mergeImages[0])
        : (product.img1 = "");

      mergeImages[1]
        ? (product.img2 = mergeImages[1].path
            ? mergeImages[1].path
            : mergeImages[1])
        : (product.img2 = "");

      mergeImages[2]
        ? (product.img3 = mergeImages[2].path
            ? mergeImages[2].path
            : mergeImages[2])
        : (product.img3 = "");

      mergeImages[3]
        ? (product.img4 = mergeImages[3].path
            ? mergeImages[3].path
            : mergeImages[3])
        : (product.img4 = "");
    } else {
      const mergeImages = [...productImages];
      mergeImages[0] ? (product.img1 = mergeImages[0]) : (product.img1 = "");

      mergeImages[1] ? (product.img2 = mergeImages[1]) : (product.img2 = "");

      mergeImages[2] ? (product.img3 = mergeImages[2]) : (product.img3 = "");

      mergeImages[3] ? (product.img4 = mergeImages[3]) : (product.img4 = "");
    }
    product.name = body.name;
    product.price = body.price;
    product.count = body.count;
    product.short_desc = body.short_desc;
    product.category = body.category;
    product.long_desc = body.long_desc;

    await product.save();

    deleteImages.map((image) =>
      fs.unlink(image, (err) => {
        console.log(err);
      })
    );

    res.status(201).json({ status: true, product: product });
  } catch (error) {
    if (images.length > 0) {
      images.map((image) => {
        fs.unlink(image.path, () => {});
      });
    }
    return next(error);
  }
};
//xoá 1 product dựa vào productID
exports.deleteProduct = async (req, res, next) => {
  const productID = req.params.productID;

  try {
    const product = await Product.findById(productID);
    //lỗi không tìm được product
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Not found product" });
    }
    let productImages = [];
    productImages.push(product.img1);
    product.img2 && productImages.push(product.img2);
    product.img3 && productImages.push(product.img3);
    product.img4 && productImages.push(product.img4);

    productImages.map((image) =>
      fs.unlink(image, (err) => {
        console.log(err);
      })
    );
    await Product.findByIdAndRemove(productID);

    res.status(201).json({ status: true, message: "Deleted the product" });
  } catch (error) {
    return next(error);
  }
};
