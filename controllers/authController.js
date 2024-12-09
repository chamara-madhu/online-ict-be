const { userLogin, userSignUp } = require("../services/authService");

exports.userLogin = (req, res) => {
  return userLogin(req.body, res);
};

exports.userSignUp = (req, res) => {
  return userSignUp(req.body, res);
};
