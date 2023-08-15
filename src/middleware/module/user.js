const User = require('../../models/users');
const { errorRes } = require('../../common/response');
const { saltRounds } = require('../../config');
const { findById } = require('../../common/activeDB');
const bcrypt = require('bcrypt');
const { onlyOwner, onlyAdmin } = require('../index');

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

const CheckValidPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next();
  } else {
    isValidPassword(req, res, () => {
      hashPassword(req, res, next);
    });
  }
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

const checkUsername = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username }).lean();

    if (user) {
      const err = 'Username already exists';
      return errorRes(res, err, err, 404);
    }

    next();
  } catch (err) {
    return errorRes(res, err, 'Error finding Username');
  }
};

const findByUser = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }, '+password', { lean: true })
    .then((data) => {
      if (!data) return errorRes(res, 'invalid login', 'invalid password or email');
      req.body = { unhashedPassword: password, ...data };
      return next();
    })
    .catch((err) => errorRes(res, err, 'error finding user'));
};

const customQuery = (req, res, next) => {
  try {
    if (req.user.type === 'admin') {
      req.body = { type: { $ne: 'owner' } };
    } else if (req.user.type === 'owner') {
      req.body = {};
    } else {
      const error = 'Access is not accepted';
      throw new Error(error);
    }
    next();
  } catch (error) {
    return errorRes(res, error.message, error.message, 405);
  }
};

const checkTypeUser = async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!type) {
      return next();
    }

    if (type !== 'owner') {
      return next();
    } else {
      const error = 'Access is not accepted';
      return errorRes(res, error, error, 405);
    }
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};

const updateGroups = async (req, res, next) => {
  const userId = req.params._id;
  try {
    const user = await findById(User, userId);

    if (!user) {
      const error = 'User not found';
      return errorRes(res, error, error, 404);
    }
    if (user.type !== 'member' && req.body.groups) {
      const err = 'Forbidden: Only members can update groups';

      return errorRes(res, err, err, 403);
    }
    next();
  } catch (error) {
    return errorRes(res, error);
  }
};
const checkTypeRemove = async (req, res, next) => {
  const userId = req.params._id;

  try {
    const user = await findById(User, userId);

    if (!user) {
      return errorRes(res, 'User not found', 'User not found', 404);
    }

    if (user.type === 'member') {
      onlyAdmin(req, res, next);
    } else if (user.type === 'admin') {
      onlyOwner(req, res, next);
    } else {
      const error = 'Access is not accepted';
      return errorRes(res, error, error, 405);
    }
  } catch (error) {
    return errorRes(res, error);
  }
};
const checkIdByMember = async (req, res, next) => {
  try {
    if (req.user.type !== 'member') {
      return next();
    }
    const userId = req.params._id;
    if (userId !== req.user._id) {
      const error = 'Access is not accepted';
      return errorRes(res, error, error, 405);
    }
    return next();
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};
module.exports = {
  isValidPassword,
  CheckValidPassword,
  hashPassword,
  checkUsername,
  findByUser,
  verifyPassword,
  customQuery,
  checkTypeUser,
  updateGroups,
  checkTypeRemove,
  checkIdByMember,
};
