const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user");

const app = express();
console.log(process.env.MONGO_USER);
console.log(process.env.MONGO_PASSWORD);
console.log(process.env.MONGO_DATABASE);
console.log(process.env.CORS_CLIENT_URL);
console.log(process.env.CORS_ADMIN_URL);
console.log(process.env.COOKIE_SECURE);
console.log(process.env.COOKIE_SAMESITE);
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.iewp9yb.mongodb.net/${process.env.MONGO_DATABASE}`;

const store = new MongoDBSession({
  uri: MONGO_URI,
  collection: "sessions",
});
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [process.env.CORS_CLIENT_URL, process.env.CORS_ADMIN_URL],
    methods: ["GET", "POST", "PUT", "PATH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "ecommerceapp",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, //false cho localhost
      sameSite: "none",
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
    },
    store: store,
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    req.user = user;
  }
  next();
});

//routers
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
app.use("/admin", adminRouter);
app.use(authRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(userRouter);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ status: false, message: "Error server" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    const server = app.listen(PORT);
    const io = require("./socket/socket").init(server);
    const { socketON } = require("./socket/socket-action");
    console.log("connected db");
    io.on("connection", (socket) => {
      // console.log("listenned socket");
      socketON(socket, "messages");
    });
  })
  .catch((err) => console.log(err));
