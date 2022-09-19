const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  type: { type: String, default: null },
  loggedBy: { type: String, default: null},
  dateTime: { type: String, default: Date.now},
  created: { type: String , default: Date.now},
  modified: { type: String , default: Date.now}
});

module.exports = mongoose.model("time-entries", entrySchema);