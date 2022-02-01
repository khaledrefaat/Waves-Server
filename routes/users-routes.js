const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');

const {
  login,
  signup,
  getUsers,
  updateUser,
} = require('../controllers/users-controllers');

router.get('/', getUsers);

router.post('/login', login);

router.post(
  '/signup',
  [
    body('username', 'Please Enter a valid username.').not().isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async value => {
        let user;
        try {
          user = await User.findOne({ email: value });
        } catch (err) {
          console.log(err);
          return Promise.reject(
            'Something went wrong, please try again later.'
          );
        }
        if (user) {
          return Promise.reject(
            'Email already exists, please use different one.'
          );
        }
      }),
    body(
      'password',
      'Please Enter a valid password with min length of 6'
    ).isLength({ min: 6 }),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    }),
  ],
  signup
);

router.patch('/', updateUser);

module.exports = router;
