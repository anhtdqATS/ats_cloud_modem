const express = require('express');
const router = express.Router();
const User = require('../models/users');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const { errorRes, successRes, errData } = require('../common/response');
const { readOne } = require('../common/crud');
const { notFound } = require('../middleware/index');
const bcrypt = require('bcrypt');
const { saltRounds, jwtSecretSalt, jwtSecretRefreshSalt, tokenLife, refreshTokenLife } = require('../config');

const isValidPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    const err = `invalid password: ${password}`;
    const errMsg = 'password is too short';
    return errorRes(res, err, errMsg);
  }
  return next();
};

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hashed) => {
    if (err) return errorRes(res, err, 'unable to sign up, try again');
    req.body.password = hashed;
    return next();
  });
};

const signUp = (req, res) => {
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });
  return newUser
    .save()
    .then((data) => {
      const { _id, user, type } = data;
      return successRes(res, { _id, user, type });
    })
    .catch((err) => {
      return errorRes(res, err, 'unable to create user');
    });
};

const findByUser = (req, res, next) => {
  const { user, password } = req.body;
  User.findOne({ user }, '+password', { lean: true })
    .then((data) => {
      if (!data) return errorRes(res, 'invalid login', 'invalid password or email');
      req.body = { unhashedPassword: password, ...data };
      return next();
    })
    .catch((err) => errorRes(res, err, 'error finding user'));
};

const verifyPassword = (req, res, next) => {
  const { unhashedPassword, password, ...userData } = req.body;
  bcrypt.compare(unhashedPassword, password, (err, same) => {
    if (same) {
      req.body = userData;
      return next();
    } else return errorRes(res, err, 'password error, try again');
  });
};

const login = (req, res) => {
  try {
    const token = jwt.sign(req.body, jwtSecretSalt, {
      algorithm: 'HS512',
      expiresIn: tokenLife,
    });
    console.log(jwtSecretRefreshSalt, 'jwtSecretRefreshSalt1');
    const refreshToken = jwt.sign(req.body, jwtSecretRefreshSalt, {
      algorithm: 'HS512',
      expiresIn: refreshTokenLife,
    });
    const data = {
      token: token,
      refreshToken: refreshToken,
    };

    // refreshTokens[refreshToken] = response
    return successRes(res, data);
  } catch (error) {
    return errorRes(res, error);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findOne({ id: userId }).exec();
    return user;
  } catch (error) {
    return null;
  }
};

const getRefreshToken = (req, res) => {
  const { refreshToken } = req.body;
  // if refresh token exists
  console.log(jwtSecretRefreshSalt, 'jwtSecretRefreshSalt2');
  jwt.verify(refreshToken, jwtSecretRefreshSalt, (err, decoded) => {
    if (err) {
      errorRes(res, err);
    } else {
      const user = getUserById(decoded.id);
      if (user) {
        // create New JWT

        const accessToken = jwt.sign(req.body, jwtSecretSalt, {
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

  .post('/signup', isValidPassword, hashPassword, signUp)
  .post('/login', findByUser, verifyPassword, login)
  .post('/tokenRefresh', getRefreshToken)

  .use(notFound);

module.exports = router;
