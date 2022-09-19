const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  type: { type: String, default: null },
  loggedBy: { type: String, default: null},
  dateTime: { type: String, default: (new Date()).getTime() },
  created: { type: String , default: (new Date()).getTime()},
  modified: { type: String , default: (new Date()).getTime()}
});

module.exports = mongoose.model("time-entries", entrySchema);