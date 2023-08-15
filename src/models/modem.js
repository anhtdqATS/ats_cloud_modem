const mongoose = require('mongoose');

const modemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  description: String,
  enabled: { type: Boolean, required: true },
  lat: String,
  lng: String,
  type: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
});

module.exports = mongoose.model('Modem', modemSchema);
