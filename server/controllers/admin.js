const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const Room = require("../models/room");

exports.getInfoBoard = async (req, res, next) => {
  try {
    let users = await User.find();
    let orders = await Order.find().sort({ created: -1 });
    let earnings = 0;
    let countLatestOrder = 0;
    //lây các tài khoản có role = User
    users = users.filter(
      (user) => user.role !== "Admin" && user.role !== "Consultant"
    );
    //tính doanh thu trung bình hàng tháng
    if (orders.length > 0) {
      orders.map((order) => (earnings += Number(order.total)));
    }
    const earningsByMonth = earnings / (new Date().getMonth() + 1);

    //orders gần nhất(trong ngày)
    if (orders.length > 0) {
      orders.map((order) => {
        const curDate = new Date();
        const orderDate = new Date(order.createdAt);
        if (
          curDate.getDate() === orderDate.getDate() &&
          curDate.getMonth() + 1 === orderDate.getMonth() + 1 &&
          curDate.getFullYear() === orderDate.getFullYear()
        ) {
          countLatestOrder++;
        }
      });
    }

    res.status(200).json({
      status: true,
      infoBoard: {
        countUsers: users.length,
        earningsByMonth: earningsByMonth,
        countOrders: countLatestOrder,
      },
    });
  } catch (error) {
    return next(error);
  }
};

//lấy các room
exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({ status: true, rooms: rooms });
  } catch (error) {
    return next(error);
  }
};
