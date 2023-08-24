const { errorRes } = require('../../common/response');

const checkTypeVPN = async (req, res, next) => {
  try {
    const { typeVPN } = req.params;
    console.log(typeVPN, 'typeVPN');
    req.body.type = typeVPN;
    return next();
  } catch (error) {
    return errorRes(res, error, error, 500);
  }
};
module.exports = {
  checkTypeVPN,
};
