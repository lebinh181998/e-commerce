const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    people: {
      type: String,
      required: true,
    },
    roomID: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Message", messageSchema);
