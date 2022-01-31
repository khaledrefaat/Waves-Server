const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

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
    body('email', 'Please enter a valid email.').normalizeEmail().isEmail(),
    body(
      'password',
      'Please Enter a valid password with min length of 6'
    ).isLength({ min: 6 }),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw Error('Passwords must match');
      }
      return true;
    }),
  ],
  signup
);

router.patch('/', updateUser);

module.exports = router;
