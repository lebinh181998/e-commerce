const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const productController = require("../controllers/product");
const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/products", productController.getProducts);

router.get("/products/trending", productController.getProductsByTrending);

router.get("/products/categories", productController.getProductsByCategory);

router.get("/products/:productID", productController.getProduct);

router.post(
  "/create-product",
  isAuth,
  isAdmin,
  upload.array("images"),
  [
    body("name").trim().not().isEmpty().withMessage("Please enter field name"),
    body("category")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field category"),
    body("price")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field price"),
    body("short_desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field short description"),
    body("long_desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field long description"),
    body("count")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field count"),
  ],

  productController.createProduct
);

router.put(
  "/update-product",
  isAuth,
  isAdmin,
  upload.array("images"),
  [
    body("name").trim().not().isEmpty().withMessage("Please enter field name"),
    body("price")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field price"),
    body("short_desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field short description"),
    body("category")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field category"),
    body("long_desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field long description"),
    body("count")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field count"),
  ],
  productController.updateProduct
);

router.delete(
  "/delete-product/:productID",
  isAuth,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;
