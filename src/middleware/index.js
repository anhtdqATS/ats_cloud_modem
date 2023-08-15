const { errorRes } = require('../common/response');
const authenticateToken = require('./checkToken');

const notFound = (req, res, _) => {
  return errorRes(res, 'no routes', 'you are lost.', 404);
};

const onlyAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.type === 'admin') {
      return next();
    } else {
      return invalidToken(req, res);
    }
  });
};

const notOnlyOwner = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.type === 'owner') {
      return invalidToken(req, res);
    } else {
      return next();
    }
  });
};

const onlyOwner = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.type === 'owner') {
      return next();
    } else {
      return invalidToken(req, res);
    }
  });
};

const notOnlyMember = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.type === 'member') {
      return invalidToken(req, res);
    } else {
      return next();
    }
  });
};

const onlyMember = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.type === 'member') {
      return next();
    } else {
      return invalidToken(req, res);
    }
  });
};

const allAuth = (req, res, next) => {
  authenticateToken(req, res, next);
};

const invalidToken = (req, res) => {
  const errMsg = 'INVALID TOKEN';
  const userText = JSON.stringify(req.user);
  const err = `${errMsg} ERROR - user: ${userText}, IP:
  
  
  ${req.ip}`;
  return errorRes(res, err, errMsg, 403);
};

module.exports = { notFound, onlyAdmin, notOnlyOwner, onlyOwner, notOnlyMember, onlyMember, allAuth };
