const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') next();

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Authentication failed!', 401));
    }
    const decodedToken = jwt.verify(token, 'a/Z%;@y3X-dvzBpD"!z4w(+{?>tb4e');
    req.userData = {
      userId: decodedToken.userId,
      username: decodedToken.username,
    };
    next();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Authentication failed!', 401));
  }
};
