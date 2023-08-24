const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    ipLocal: { type: String, required: true },
    vpnIp: { type: String, required: true },
    type: {
      type: String,
      enum: ['OpenVPN', 'Ipsec', 'L2TP/Ipsec'],
      required: true,
    },
    timeConnect: {
      type: Number,
      required: true,
    },
  },
  { collection: 'VPNClient' },
);

module.exports = mongoose.model('VPNClient', groupSchema);
