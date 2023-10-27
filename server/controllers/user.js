const Product = require("../models/product");
const io = require("../socket/socket");
const Message = require("../models/message");

//lấy cart của user
exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.product");
    res.status(200).json({ status: true, cart: user.cart });
  } catch (error) {
    return next(error);
  }
};
//điều chỉnh số lượng hoặc thêm 1 product dựa vào productID vào trong cart
exports.setCountProductToCart = async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const updatedCart = [...user.cart];
    const productIndex = updatedCart.findIndex(
      (item) => item.product.toString() === body._id.toString()
    );
    const product = await Product.findById(body._id);
    const countProduct = product.count;
    let changeCount = 0;
    //kiểm tra product được chọn có trong cart không
    //có: sửa quantity
    //không: thêm product vào cart
    //sửa count product trong cả 2 trường hợp
    if (body.quantity >= 1) {
      if (productIndex >= 0) {
        changeCount = body.quantity - updatedCart[productIndex].quantity;
        updatedCart[productIndex].quantity = body.quantity;
      } else {
        changeCount = body.quantity;
        updatedCart.push({ product: body._id, quantity: body.quantity });
      }
    }
    if (countProduct - changeCount < 0) {
      return res
        .status(200)
        .json({ status: false, message: "Not enough count product" });
    }
    user.cart = updatedCart;
    product.count = countProduct - changeCount;
    await user.save();
    await product.save();

    res.status(201).json({ status: true, message: "Added product to cart" });
  } catch (error) {
    return next(error);
  }
};
//xoá 1 product dựa vào productID trong cart
exports.deleteProductInCart = async (req, res, next) => {
  try {
    const productID = req.params.productID;
    const user = req.user;
    const updatedCart = [...user.cart];
    const productIndex = updatedCart.findIndex(
      (item) => item.product.toString() === productID.toString()
    );
    //kiểm tra product được chọn có trong cart không
    //không: gửi phản hồi
    //có: next
    if (productIndex < 0) {
      return res
        .status(404)
        .json({ status: false, message: "Not found product in cart" });
    }
    user.cart = updatedCart.filter(
      (item) => item.product.toString() !== productID.toString()
    );
    const product = await Product.findById(updatedCart[productIndex].product);
    const countProduct = product.count;
    product.count = countProduct + updatedCart[productIndex].quantity;

    await user.save();
    await product.save();

    res.status(201).json({ status: true, message: "Deleted product in cart" });
  } catch (error) {
    return next(error);
  }
};
//lấy các message dựa vào roomID
exports.getMessages = async (req, res, next) => {
  const roomID = req.params.roomID === "null" ? null : req.params.roomID;

  let messages = [];
  try {
    messages = await Message.find({ roomID: roomID }).sort({
      createdAt: -1,
    });

    res.status(200).json({ status: true, messages: messages });
  } catch (error) {
    return next(error);
  }
};
