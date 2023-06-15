const jwt = require("jsonwebtoken");
const { jwtSecretSalt } = require("../config");
const { errorRes, successRes, errData } = require("../common/response");

// Middleware auth token
const authenticateToken = (req, res, next) => {
  // get header Authorization
  const authHeader = req.headers.authorization;

  // Check header Authorization and Bearer token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    // auth token
    jwt.verify(token, jwtSecretSalt, (err, decodedToken) => {
      if (err) {

        errorRes(res, err)
      } else {
        req.user = decodedToken;

        // Tiếp tục thực hiện các middleware hoặc route tiếp theo
        next();
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticateToken;
