const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}).select('_id username playlists image');
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

  let exsistingUser;
  try {
    exsistingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Loging in failed, please try again later', 500));
  }

  if (!exsistingUser || exsistingUser.password !== password)
    return next(new HttpError('Incorrect username or password', 401));

  let token;

  try {
    token = jwt.sign(
      {
        userId: exsistingUser._id,
        email: exsistingUser.email,
      },
      'a/Z%;@y3X-dvzBpD"!z4w(+{?>tb4e',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.log(err);
    return next(new HttpError('Loging in failed, please try again later', 500));
  }

  res.json({ user: exsistingUser, token });
};

exports.signup = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty())
    return next(new HttpError('Invalid Inputs!', 422));

  const {
    username,
    email,
    password,
    passwordConfirmation,
    image = 'https://manskkp.lv/assets/images/users/default-user.png',
  } = req.body;

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

  const createdUser = new User({
    username,
    password,
    email,
    image,
    playlists: [],
    songs: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  console.log(createdUser);

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      'a/Z%;@y3X-dvzBpD"!z4w(+{?>tb4e',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.log(err);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  res.json({ user: createdUser, token });
};

exports.updateUser = async (req, res, next) => {
  const { username, image } = req.body;

  let exsistingUser;

  try {
    exsistingUser = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Upading user failed, please try again later.', 500)
    );
  }

  if (!exsistingUser) {
    return next(
      new HttpError('Upading user failed, please try again later.', 500)
    );
  }

  if (username) exsistingUser.username = username;
  if (image) exsistingUser.image = image;

  try {
    await exsistingUser.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Upading user failed, please try again later.', 500)
    );
  }

  next();
};
