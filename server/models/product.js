const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img1: {
      type: String,
      required: true,
    },
    img2: {
      type: String,
      required: false,
    },
    img3: {
      type: String,
      required: false,
    },
    img4: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: true,
    },
    short_desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    long_desc: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      requitrd: true,
    },
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
