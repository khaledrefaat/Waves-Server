const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        'Something went wrong when loading users, please try again later',
        500
      )
    );
  }

  res.json(users);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signup failed, please try again later', 500));
  }

  if (!user || user.password !== password)
    return next(new HttpError('Incorrect username or password', 401));

  res.json({ user, message: 'Logged In ^_^' });
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
    console.log(err);
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
    console.log(err);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  res.json(createdUser);
};
