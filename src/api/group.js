const express = require('express');
const router = express.Router();
const { create, read, update, remove } = require('../common/crud');
const Group = require('../models/group');
const { notOnlyOwner, notFound } = require('../middleware/index');
const { isGroupNameExists, filterGroupsByUser, checkGroupByMember } = require('../middleware/module/group');
const { onlyAdmin } = require('../middleware/index');

router
  .use(notOnlyOwner)

  .post('', onlyAdmin, isGroupNameExists, create(Group))
  .get('', filterGroupsByUser, read(Group))
  .put('/:_id', checkGroupByMember, update(Group))
  .delete('/:_id', onlyAdmin, remove(Group))

  .use(notFound);

module.exports = router;
