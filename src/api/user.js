const express = require('express');
const router = express.Router();
const { create, read, update, remove } = require('../common/crud');
const User = require('../models/users');
const { errorRes } = require('../common/response');
const { onlyAdmin, notFound } = require('../middleware/index');

const bcrypt = require('bcrypt');
const { saltRounds, jwtSecretSalt } = require('../config');

const isValidPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next();
  } else if (password.length < 6) {
    const err = `invalid password: ${password}`;
    const errMsg = 'password is too short';
    return errorRes(res, err, errMsg);
  }
  return next();
};

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hashed) => {
    if (err) return errorRes(res, err, 'unable to create, try again');
    req.body.password = hashed;
    return next();
  });
};

const checkExistingUser = async (req, res, next) => {
  const { user } = req.body;
  const existingUser = await User.findOne({ user });

  if (existingUser) {
    const errMsg = 'User already exists';
    return errorRes(res, errMsg, errMsg, 409);
    // return res.status(409).json({ error: "User already exists" });
  }

  next();
};

const handlePassword = (req, res, next) => {
  const { password, ...body } = req.body;
  if (!password || password.length < 1) {
    req.body = body;
    return next();
  }
  if (password.length < 6) return errorRes(res, 'invalid password', 'password is too short');

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return errorRes(res, err, 'password error');

    const data = { ...body, password: hash };
    req.body = data;
    return next();
  });
};

const updateGroups = async (req, res, next) => {
  const userId = req.params._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return errorRes(res, 'User not found', 'User not found', 404);
    }

    if (user.type !== 'member' && req.body.groups) {
      const err = 'Forbidden: Only members can update groups';

      return errorRes(res, err, err, 403);
    }
  } catch (error) {
    return errorRes(res, error);
  }

  next();
};

router
  .use(onlyAdmin)

  .post('', isValidPassword, checkExistingUser, hashPassword, create(User))
  .get('', read(User))
  .put('/:_id', isValidPassword, updateGroups, checkExistingUser, handlePassword, update(User))
  .delete('/:_id', remove(User))

  .use(notFound);

module.exports = router;
