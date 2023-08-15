const Group = require('../../models/group');
const { errorRes } = require('../../common/response');
const authenticateToken = require('../checkToken');
const { findById } = require('../../common/activeDB');
const User = require('../../models/users');
const isGroupNameExists = async (req, res, next) => {
  const { name } = req.body;

  try {
    const groupExists = await Group.exists({ name });

    if (groupExists) {
      const err = 'group name already exists';
      return errorRes(res, err, err, 400);
    }

    next();
  } catch (error) {
    return errorRes(res, error, error);
  }
};

const filterGroupsByUser = async (req, res, next) => {
  try {
    let groupIds = [];
    if (req.user.type === 'member') {
      groupIds = req.user.groups;
    } else if (req.user.type === 'owner' || req.user.type === 'admin') {
      // if type "owner" or "admin", get all group
      const allGroups = await Group.find();
      groupIds = allGroups.map((group) => group._id);
    }

    req.body = { _id: { $in: groupIds } };

    next();
  } catch (error) {
    return errorRes(res, error, error);
  }
};
const checkGroupByMember = async (req, res, next) => {
  try {
    if (req.user.type !== 'member') {
      return next();
    }
    const userGroup = await findById(User, req.user._id, { groups: 1 });
    if (!userGroup.groups.includes(req.params._id)) {
      const error = 'permission to change group';
      return errorRes(res, error, error, 409);
    }
    return next();
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};
module.exports = {
  isGroupNameExists,
  filterGroupsByUser,
  checkGroupByMember,
};
