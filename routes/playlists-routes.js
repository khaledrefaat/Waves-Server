const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

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
  [body('playlistName').not().isEmpty(), body('playlistCover').not().isEmpty()],
  postPlaylist
);

router.post(
  '/song',
  [[body('songId').not().isEmpty(), body('playlistId').not().isEmpty()]],
  postSongToPlaylist
);

router.patch(
  '/:playlistId',
  [body('playlistName').not().isEmpty(), body('playlistCover').not().isEmpty()],
  updatePlaylist
);

router.delete(
  '/song',
  [[[body('songId').not().isEmpty(), body('playlistId').not().isEmpty()]]],
  deleteSongFromPlaylist
);

router.delete('/:playlistId', deletePlaylist);

module.exports = router;
