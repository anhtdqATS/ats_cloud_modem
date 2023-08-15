const Modem = require('../../models/modem');
const Group = require('../../models/group');
const User = require('../../models/users');

const { findById } = require('../../common/activeDB');

const { errorRes } = require('../../common/response');

const checkGroupExists = async (req, res, next) => {
  try {
    const groupId = req.body.group; // get ID on request body
    const group = await findById(Group, groupId);

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

const checkTypeGetModem = async (req, res, next) => {
  try {
    const { _id } = req.params; // get group ID on request params
    if (!(await checkGroupOnUserActive(req.user._id, _id))) {
      const error = 'permission to get modem on group';
      return errorRes(res, error, error, 404);
    }
    req.body.group = _id;
    return next();
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};

const checkModemId = async (req, res, next) => {
  try {
    const groupOnModem = await findById(Modem, req.params._id, { group: 1 });
    if (!(await checkGroupOnUserActive(req.user._id, groupOnModem.group))) {
      const error = 'permission to get modem on group 1';
      return errorRes(res, error, error, 404);
    }
    next();
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};

const checkGroupModemOnUser = async (req, res, next) => {
  try {
    const { group } = req.body;
    if (!group) {
      next();
    } else {
      if (!(await checkGroupOnUserActive(req.user._id, group))) {
        const error = 'permission to get modem on group 2';
        return errorRes(res, error, error, 404);
      }
      next();
    }
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};

const checkGroupOnUserActive = async (userId, groupId) => {
  const userGroup = await findById(User, userId, { groups: 1 });
  return userGroup.groups.includes(groupId);
};

module.exports = {
  checkGroupExists,
  checkModemExistsInGroup,
  checkTypeGetModem,
  checkModemId,
  checkGroupModemOnUser,
};
