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

const checkAuth = require('../middlewares/check-auth');

router.get('/', getSongs);

router.get('/:songId', getSong);

router.get('/user/:userId', getUserSongs);

router.use(checkAuth);

router.post(
  '/',
  [
    check('song').not().isEmpty(),
    check('songName').not().isEmpty(),
    check('songCover').not().isEmpty(),
  ],
  postSong
);

router.patch(
  '/:songId',
  [[check('song').not().isEmpty(), check('songName').not().isEmpty()]],
  updateSong
);

router.delete('/:songId', deleteSong);
module.exports = router;
