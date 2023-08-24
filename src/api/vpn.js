const express = require('express');
const router = express.Router();
const { notOnlyOwner, notFound } = require('../middleware/index');
const VPN = require('../models/vpnServer');
const VPNClient = require('../models/vpnClient');
const { read } = require('../common/crud');
const { checkTypeVPN } = require('../middleware/module/vpn');

router
  .use(notOnlyOwner)
  .get('/vpnServer', read(VPN))
  .get('/vpnClient/:typeVPN', checkTypeVPN, read(VPNClient))
  .use(notFound);
module.exports = router;
