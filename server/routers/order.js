const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const orderController = require("../controllers/order");
const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

router.get("/admin/orders", isAuth, isAdmin, orderController.getOrders);

router.get("/orders", isAuth, orderController.getOrdersByUser);

router.get("/orders/:orderID", isAuth, orderController.getOrder);

router.post(
  "/create-order",
  isAuth,
  [
    body("fullName")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field full name"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("phoneNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field phone number"),
    body("address")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter field address"),
  ],
  orderController.createOrder
);

router.put("/update-order", isAuth, isAdmin, orderController.updateOrder);

router.delete(
  "/delete-order/:orderID",
  isAuth,
  isAdmin,
  orderController.deleteOrder
);

module.exports = router;
