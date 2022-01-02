const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

exports.login = (req, res, next) => {
  {
    console.log(req.body);
    next();
  }
};

exports.signup = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty())
    return next(new HttpError('Invalid Inputs!', 422));

  const { username, email, password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation)
    return next(new HttpError('Invalid Inputs!', 422));

  let exsistingUser;

  try {
    exsistingUser = await User.findOne({ email });
  } catch (err) {
    console.log(error);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  if (exsistingUser)
    return next(
      new HttpError('User already exists, please login instead', 422)
    );

  const createdUser = new User({ username, password, email });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(error);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  res.json(createdUser);
};
