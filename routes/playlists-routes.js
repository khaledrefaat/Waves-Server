const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  getPlaylists,
  getPlaylist,
  getUserPlaylists,
  postPlaylist,
  postSongToPlaylist,
  updatePlaylist,
  deleteSongFromPlaylist,
  deletePlaylist,
} = require('../controllers/playlist-controllers');

const checkAuth = require('../middlewares/check-auth');

router.get('/', getPlaylists);

router.get('/:playlistId', getPlaylist);

router.get('/user/:userId', getUserPlaylists);

router.use(checkAuth);

router.post(
  '/',
  [
    check('playlistName').not().isEmpty(),
    check('playlistCover').not().isEmpty(),
  ],
  postPlaylist
);

router.post(
  '/song',
  [[check('songId').not().isEmpty(), check('playlistId').not().isEmpty()]],
  postSongToPlaylist
);

router.patch(
  '/:playlistId',
  [
    check('playlistName').not().isEmpty(),
    check('playlistCover').not().isEmpty(),
  ],
  updatePlaylist
);

router.delete(
  '/song',
  [[[check('songId').not().isEmpty(), check('playlistId').not().isEmpty()]]],
  deleteSongFromPlaylist
);

router.delete('/:playlistId', deletePlaylist);

module.exports = router;
