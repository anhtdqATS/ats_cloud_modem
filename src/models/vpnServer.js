const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
    type: {
      type: String,
      enum: ['OpenVPN', 'Ipsec', 'L2TP/Ipsec'],
      required: true,
    },
  },
  { collection: 'VPN' },
);

module.exports = mongoose.model('VPN', groupSchema);
