const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/user");
//đăng ký
exports.signup = async (req, res, next) => {
  const errResult = validationResult(req);
  const errors = errResult.array();
  //kiểm tra lỗi từ  validationResult
  //có: phản hồi lỗi
  //không: next
  if (errors.length > 0) {
    return res.status(422).json({ status: false, errors: errors });
  }

  try {
    const body = req.body;
    const password = await bcrypt.hash(body.password, 12);

    const user = new User({
      username: body.username,
      password: password,
      cart: [],
      role: "User",
    });
    await user.save();

    res.status(201).json({ status: true, message: "Created a new user" });
  } catch (error) {
    console.log();
    return next(error);
  }
};
//đăng nhập
exports.login = async (req, res, next) => {
  const errResult = validationResult(req);
  const errors = errResult.array();
  //kiểm tra lỗi từ  validationResult
  //có: phản hồi lỗi
  //không: next
  if (errors.length > 0) {
    return res.status(422).json({ status: false, errors: errors });
  }

  try {
    const body = req.body;
    const user = await User.findOne({ username: body.username });
    const validatePass = await bcrypt.compare(body.password, user.password);
    //kiểm tra password
    //sai: phản hồi lỗi
    //đúng: next
    if (!validatePass) {
      return res.status(422).json({
        status: false,
        errors: [...errors, { path: "password", msg: "Password is wrong" }],
      });
    }

    req.session.user = user;
    req.session.isLoggedIn = true;
    return req.session.save((err) => {
      if (!err) {
        return res
          .status(200)
          .json({ status: true, message: "Logged in", user: user });
      }
    });
  } catch (error) {
    return next(error);
  }
};
//đăng xuất
exports.logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.status(201).json({ status: true, message: "Logged out" });
      }
    });
  } catch (error) {
    return next(error);
  }
};
//check login
exports.checkLogin = async (req, res, next) => {
  try {
    if (req.user) {
      res.status(200).json({ status: true, user: req.user });
    } else {
      res.status(200).json({ status: false, message: "Please login" });
    }
  } catch (error) {
    return next(error);
  }
};
//check admin
exports.checkAdmin = async (req, res, next) => {
  try {
    console.log("controller");
    if (req.user) {
      if (req.user.role === "Admin") {
        return res.status(200).json({ status: true, user: req.user });
      } else {
        return res.status(200).json({ status: false, message: "Is not Admin" });
      }
    } else {
      return res.status(200).json({ status: false, message: "Please login" });
    }
  } catch (error) {
    return next(error);
  }
};
