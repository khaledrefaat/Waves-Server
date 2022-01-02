const User = require('../models/user');
const HttpError = require('../models/user');

exports.login = (req, res, next) => {
  {
    console.log(req.body);
    next();
  }
};

exports.signup = async (req, res, next) => {
  const { username, password, email } = req.body;

  const createdUser = new User({ username, password, email });

  try {
    createdUser.save();
  } catch (err) {
    console.log(error);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  res.json(createdUser);
};
