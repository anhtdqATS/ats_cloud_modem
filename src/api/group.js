const express = require('express');
const router = express.Router();
const { create, read, update, remove } = require('../common/crud');
const Group = require('../models/group');
const { errorRes, successRes } = require('../common/response');
const { notOnlyOwner, notFound } = require('../middleware/index');
const jwt = require('jsonwebtoken');
const { jwtSecretSalt } = require('../config');
const User = require('../models/users');

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
    //get token header Authorization
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      const err = 'Unauthorized';
      return errorRes(res, err, err, 401);
    }

    const token = bearerToken.split(' ')[1];
    const decodedToken = jwt.verify(token, jwtSecretSalt);
    const userId = decodedToken._id;

    const user = await User.findById(userId);
    if (!user) {
      const err = 'User not found';
      return errorRes(res, err, err, 404);
    }

    let groupIds = [];
    if (user.type === 'member') {
      groupIds = user.groups;
    } else if (user.type === 'owner' || user.type === 'admin') {
      // if type "owner" or "admin", get all group
      const allGroups = await Group.find();
      groupIds = allGroups.map((group) => group._id);
    }

    req.body = { _id: { $in: groupIds } };

    next();
  } catch (error) {
    console.log(error, 'error1');
    return errorRes(res, error, error);
  }
};



router
  .use(notOnlyOwner)

  .post('', isGroupNameExists, create(Group))
  .get('', filterGroupsByUser, read(Group))
  .put('/:_id', update(Group))
  .delete('/:_id', remove(Group))

  .use(notFound);

module.exports = router;
