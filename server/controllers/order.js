const Order = require("../models/order");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const mailTransportter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "binhlfx23210@funix.edu.vn",
    pass: "0z0z0z0z",
  },
});

//lấy tất cả order
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, orders: orders });
  } catch (error) {
    return next(error);
  }
};
//lấy tất cả order của 1 user
exports.getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, orders: orders });
  } catch (error) {
    return next(error);
  }
};
//lấy 1 order dựa vào orderID
exports.getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find();
    const isOrder = orders.filter(
      (order) => order._id.toString() === req.params.orderID.toString()
    );
    let order;
    if (isOrder.length <= 0) {
      return res
        .status(404)
        .json({ status: false, message: "Not found order" });
    } else {
      order = await Order.findById(req.params.orderID).populate(
        "products.product"
      );
    }
    res.status(200).json({ status: true, order: order });
  } catch (error) {
    return next(error);
  }
};
//tạo 1 order
exports.createOrder = async (req, res, next) => {
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
    const user = await req.user.populate("cart.product");
    const order = new Order({
      products: user.cart,
      user: user._id,
      fullName: body.fullName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      address: body.address,
      total: body.total,
      status: false,
    });
    await order.save();
    // console.log(order);
    let mail = {
      from: "binhlfx23210@funix.edu.vn",
      to: order.email,
      subject: "You has just created a new order",
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your order</title>
            <style>
              table {
                width: 100%;
              }
              
              thead,
              tbody {
                text-align: center;
                padding: 8px;
              }
              
              thead {
                background-color: #f8f9fa;
              }
              thead tr th {
                padding: 12px;
              }
              tbody tr td {
                font-weight: 100;
                font-size: 14px;
                padding: 12px;
                color: #939393;
                width: 30%;
              }
              tbody tr td img {
                width: 50%;
              }
            </style>
        </head>
        <body>
          <h1>Xin chào ${order.fullName}</h1>
          <p>Phone: ${order.phoneNumber}</p>
          <p>Address: ${order.address}</p>
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${user.cart.map(
                (item, i) =>
                  `<tr key=${item.product._id}>
                  <td class="fw-bold text-dark fs-6">${item.product.name}</td>
                  <td>
                    <img src=${
                      validURL(item.product.img1)
                        ? item.product.img1
                        : `https://backend-ass3.onrender.com/${item.product.img1}`
                    } alt=${item.product.name} />
                  </td>
                  <td class="text-end">${Dot(item.product.price)} VND</td>
                  <td>${item.quantity}</td>
                  <td class="text-end">
                    ${Dot(
                      String(Number(item.product.price) * item.quantity)
                    )} VND
                  </td>
                </tr>`
              )}
            </tbody>
          </table>
          <h1>Tổng thanh toán</h1>
          <h1>${Dot(order.total)} VND</h1>
          <h1>Cảm ơn bạn!</h1>
        </body>
      </html>
        `,
    };

    user.cart = [];
    await user.save();
    res.status(201).json({ status: true, message: "Created a new order" });
    return mailTransportter.sendMail(mail, (err) => {
      !err ? console.log("success") : console.log(err);
    });
  } catch (error) {
    return next(error);
  }
};
//sửa trạng thái 1 order
exports.updateOrder = async (req, res, next) => {
  try {
    const body = req.body;
    const order = await Order.findById(body.orderID).populate(
      "products.product"
    );

    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Not found order" });
    }

    order.status = body.status;
    await order.save();

    res.status(201).json({ status: true, order: order });
  } catch (error) {
    return next(error);
  }
};
//xoá 1 order
exports.deleteOrder = async (req, res, next) => {
  try {
    const orderID = req.params.orderID;
    if (!orderID) {
      return res
        .status(404)
        .json({ status: false, message: "Not found order" });
    }

    await Order.findByIdAndRemove(orderID);

    res.status(201).json({ status: true, message: "Created a new order" });
  } catch (error) {
    return next(error);
  }
};

//hàm tạo giá trị tiền có dấu chấm ngăn cách
const Dot = (value) => {
  const price = value.split("");
  let plus = 0;
  for (let i = price.length; i > 0; i--) {
    plus++;
    if (plus % 3 === 0 && i < price.length && i > 1) {
      price.splice(i - 1, 0, ".");
    }
  }
  return price.join("");
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
