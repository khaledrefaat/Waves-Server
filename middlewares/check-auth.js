const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') next();

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Authentication failed!', 401));
      const decodedToken = jwt.verify(token, 'SUPER_SECRET_DONT_EVER_SHARE');
      req.userData = { userId: decodedToken.userId };
    }
  } catch (err) {
    console.log(err);
    throw new Error('Authentication failed!');
  }
};
