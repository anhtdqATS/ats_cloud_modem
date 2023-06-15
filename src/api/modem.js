const express = require('express');
const router = express.Router();
const { create, read, update, remove } = require('../common/crud');
const Modem = require('../models/modem');
const Group = require('../models/group');

const { errorRes } = require('../common/response');
const { notOnlyOwner, onlyAdmin, notFound } = require('../middleware/index');

const checkGroupExists = async (req, res, next) => {
  try {
    const groupId = req.body.group; // get ID on request body
    const group = await Group.findById(groupId);

    if (!group) {
      const err = 'Group not found';
      return errorRes(res, err, err, 404);
    }
    next();
  } catch (error) {
    return errorRes(res, error, error);
  }
};
const checkModemExistsInGroup = async (req, res, next) => {
  const { group, name } = req.body;

  try {
    const modem = await Modem.findOne({ name: name, group: group });

    if (modem) {
      const err = 'modem name already exists';
      return errorRes(res, err, err, 404);
    }

    next();
  } catch (error) {
    return errorRes(res, error, error);
  }
};


const addGroupToBody = (req, res, next) => {
  const { _id } = req.params; // get group ID on request params
  req.body.group = _id; // add group ID to req.body
  next();
}

router
  .use(notOnlyOwner)

  .post('', checkGroupExists, checkModemExistsInGroup, create(Modem))
  .get('', onlyAdmin, read(Modem))
  .get('/:_id',addGroupToBody, read(Modem))
  .put('/:_id', update(Modem))
  .delete('/:_id', remove(Modem))

  .use(notFound);

module.exports = router;
