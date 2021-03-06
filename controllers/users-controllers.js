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

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Logging in failed, please try again later', 500)
    );
  }

  if (!existingUser || existingUser.password !== password)
    return next(new HttpError('Incorrect username or password', 401));

  let token;

  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
      },
      'a/Z%;@y3X-dvzBpD"!z4w(+{?>tb4e',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Logging in failed, please try again later', 500)
    );
  }

  res.json({ userId: existingUser._id, token });
};

exports.signup = async (req, res, next) => {
  const errorResult = validationResult(req);

  if (!errorResult.isEmpty())
    return next(new HttpError(errorResult.array()[0].msg, 422));

  const {
    username,
    email,
    password,
    image = 'uploads/images/avatar.png',
  } = req.body;

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

  let token;

  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
        username: createdUser.username,
      },
      'a/Z%;@y3X-dvzBpD"!z4w(+{?>tb4e',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.log(err);
    return next(HttpError('Signup failed, please try again later', 500));
  }

  res.json({ userId: createdUser._id, token });
};

exports.updateUser = async (req, res, next) => {
  const { username, image } = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Updating user failed, please try again later.', 500)
    );
  }

  if (username) existingUser.username = username;
  if (image) existingUser.image = image;

  try {
    await existingUser.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Updating user failed, please try again later.', 500)
    );
  }

  next();
};
