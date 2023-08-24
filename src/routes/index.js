const express = require('express');
const router = express.Router();
const user = require('../api/user.js');
const auth = require('../api/auth.js');
const group = require('../api/group.js');
const modem = require('../api/modem.js');
const vpn = require('../api/vpn.js');
const diagnostics = require('../api/diagnostic.js');
const { notFound } = require('../middleware/index.js');

router
  .use('/auth', auth)
  .use('/user', user)
  .use('/group', group)
  .use('/modem', modem)
  .use('/vpn', vpn)
  .use('/diagnostic', diagnostics)
  .use(notFound);

module.exports = router;
