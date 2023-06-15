const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  enabled: Boolean,
});

module.exports = mongoose.model("Group", groupSchema);
