const express = require('express');
const router = express.Router();
const { create, read, update, remove } = require('../common/crud');
const User = require('../models/users');
const { notOnlyMember, notFound, allAuth } = require('../middleware/index');
const {
  isValidPassword,
  CheckValidPassword,
  hashPassword,
  checkUsername,
  customQuery,
  checkTypeUser,
  updateGroups,
  checkTypeRemove,
  checkIdByMember,
} = require('../middleware/module/user');

router
  .post('', notOnlyMember, checkTypeUser, isValidPassword, checkUsername, hashPassword, create(User))
  .get('', notOnlyMember, customQuery, read(User))
  .put('/:_id', allAuth, checkTypeUser, checkIdByMember, CheckValidPassword, updateGroups, update(User))
  .delete('/:_id', allAuth, notOnlyMember, checkTypeRemove, remove(User))

  .use(notFound);

module.exports = router;
