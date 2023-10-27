const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({}, { timestamp: true });
module.exports = mongoose.model("Room", roomSchema);
