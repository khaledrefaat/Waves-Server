const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const {
  getSongs,
  getSong,
  getUserSongs,
  postSong,
  deleteSong,
  updateSong,
} = require('../controllers/songs-controllers');

router.get('/', getSongs);

router.get('/:songId', getSong);

router.get('/user/:userId', getUserSongs);

router.post(
  '/',
  [check('song').not().isEmpty(), check('songName').not().isEmpty()],
  postSong
);

router.patch(
  '/:songId',
  [[check('song').not().isEmpty(), check('songName').not().isEmpty()]],
  updateSong
);

router.delete('/', deleteSong);
module.exports = router;
