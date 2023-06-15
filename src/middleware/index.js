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

const invalidToken = (req, res) => {
  const errMsg = 'INVALID TOKEN';
  const userText = JSON.stringify(req.user);
  const err = `${errMsg} ERROR - user: ${userText}, IP:
  
  
  ${req.ip}`;
  return errorRes(res, err, errMsg, 401);
};

module.exports = { notFound, onlyAdmin, notOnlyOwner };
