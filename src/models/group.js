const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  enabled: { type: Boolean, required: true },
});

module.exports = mongoose.model('Group', groupSchema);
