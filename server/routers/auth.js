const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middlewares/is-auth");

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Username must more than 4 characters")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ username: value });
        if (user) {
          return Promise.reject("Username has already existed");
        }
        if (value === "") {
          return Promise.reject("Please enter username");
        }
        return true;
      }),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter password")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must more than 6 characters")
      .bail(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject("Please confirm password");
      }
      return true;
    }),
  ],
  authController.signup
);

router.put(
  "/login",
  [
    body("username")
      .trim()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ username: value });
        if (value === "") {
          return Promise.reject("Please enter username");
        }
        if (!user) {
          return Promise.reject("Username is not exist");
        }
        return true;
      }),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter password"),
  ],
  authController.login
);

router.get("/logout", isAuth, authController.logout);

router.get("/check-login", authController.checkLogin);

router.get("/check-admin", authController.checkAdmin);

module.exports = router;
