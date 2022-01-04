const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const {
  postSong,
  getSongs,
  getSong,
  getUserSongs,
} = require('../controllers/songs-controllers');

router.get('/', getSongs);

router.get('/:songId', getSong);

router.get('/user/:userId', getUserSongs);

router.post(
  '/',
  [check('song').not().isEmpty(), check('songName').not().isEmpty()],
  postSong
);

module.exports = router;
