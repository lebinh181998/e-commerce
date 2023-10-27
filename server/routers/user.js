const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const isAuth = require("../middlewares/is-auth");

router.get("/cart", isAuth, userController.getCart);

router.put("/update-cart", isAuth, userController.setCountProductToCart);

router.delete("/cart/:productID", isAuth, userController.deleteProductInCart);

router.get("/messages/:roomID", userController.getMessages);

module.exports = router;
