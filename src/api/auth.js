const express = require('express');
const router = express.Router();
const User = require('../models/users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { errorRes, successRes, errData } = require('../common/response');
const { notFound } = require('../middleware/index');
const { findById } = require('../common/activeDB');

const {
  isValidPassword,
  hashPassword,
  checkUsername,
  findByUser,
  verifyPassword,
} = require('../middleware/module/user');
const { jwtSecretSalt, jwtSecretRefreshSalt, tokenLife, refreshTokenLife } = require('../config');

const signUp = async (req, res) => {
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });
  try {
    const data = await newUser.save();
    const { _id, username, type } = data;
    return successRes(res, { _id, username, type });
  } catch (err) {
    return errorRes(res, err, 'unable to create user');
  }
};

const login = (req, res) => {
  try {
    if (!req.body.type || typeof req.body.type !== 'string') {
      throw new Error('Invalid request data');
    }
    const token = jwt.sign(req.body, jwtSecretSalt, {
      algorithm: 'HS512',
      expiresIn: tokenLife,
    });
    const refreshToken = jwt.sign(req.body, jwtSecretRefreshSalt, {
      algorithm: 'HS512',
      expiresIn: refreshTokenLife,
    });
    const data = {
      token: token,
      refreshToken: refreshToken,
    };
    res.cookie('token', token, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    // refreshTokens[refreshToken] = response
    return successRes(res, data);
  } catch (error) {
    return errorRes(res, error);
  }
};

const getRefreshToken = (req, res) => {
  const { refreshToken } = req.body;
  // if refresh token exists
  jwt.verify(refreshToken, jwtSecretRefreshSalt, (err, decoded) => {
    if (err) {
      return errorRes(res, err);
    } else {
      const user = findById(decoded.id);
      if (user) {
        // create New JWT
        delete decoded.iat;
        delete decoded.exp;
        const accessToken = jwt.sign(decoded, jwtSecretSalt, {
          algorithm: 'HS512',
          expiresIn: tokenLife,
        });
        const data = {
          token: accessToken,
        };

        // return JWT
        return successRes(res, data);
      } else {
        return errorRes(res, 'No create new TOKEN');
      }
    }
  });
};

router

  .post('/signup', checkUsername, isValidPassword, hashPassword, signUp)
  .post('/login', findByUser, verifyPassword, login)
  .post('/tokenRefresh', getRefreshToken)

  .use(notFound);

module.exports = router;
