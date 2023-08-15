const express = require('express');
const router = express.Router();
const { create, read, update, remove } = require('../common/crud');
const Modem = require('../models/modem');
const {  onlyMember, notFound } = require('../middleware/index');

const {
  checkGroupExists,
  checkModemExistsInGroup,
  checkTypeGetModem,
  checkModemId,
  checkGroupModemOnUser,
} = require('../middleware/module/modem');

router
  .use(onlyMember)

  .post('', checkGroupModemOnUser, checkGroupExists, checkModemExistsInGroup, create(Modem))
  // .get('', onlyAdmin, read(Modem))
  .get('/:_id', checkTypeGetModem, read(Modem))
  .put('/:_id', checkModemId, checkGroupModemOnUser, update(Modem))
  .delete('/:_id', checkModemId, remove(Modem))

  .use(notFound);

module.exports = router;
