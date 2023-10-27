const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

const adminController = require("../controllers/admin");

router.get("/infoboard", isAuth, isAdmin, adminController.getInfoBoard);

router.get("/rooms", isAuth, isAdmin, adminController.getRooms);

module.exports = router;
