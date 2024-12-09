const jwt = require("jsonwebtoken");
const { secretOfKey, USER_ROLES } = require("../config/constant");

exports.isAuth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];

    console.log("token", token);

    jwt.verify(token, secretOfKey, (err, user) => {
      if (!err) {
        req.user = user;
        console.log("req.user", req.user);
        next();
      } else res.status(401).json({ error: "User access denied" });
    });
  } else {
    res.status(401).json({ error: "User access denied" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role == USER_ROLES.ADMIN) {
    next();
  } else res.status(401).json({ error: "User access denied" });
};

exports.isStudent = (req, res, next) => {
  if (req.user.role == USER_ROLES.STUDENT) {
    next();
  } else res.status(401).json({ error: "User access denied" });
};
