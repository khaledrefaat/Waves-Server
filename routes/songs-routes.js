const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const { postSong, getSongs } = require('../controllers/songs-controllers');

router.get('/', getSongs);

router.post(
  '/',
  [check('song').not().isEmpty(), check('songName').not().isEmpty()],
  postSong
);

module.exports = router;
