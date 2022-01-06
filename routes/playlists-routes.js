const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  getPlaylists,
  getPlaylist,
  getUserPlaylists,
  postPlaylist,
  postSongToPlaylist,
  deleteSongFromPlaylist,
  deletePlaylist,
} = require('../controllers/playlist-controllers');

router.get('/', getPlaylists);

router.get('/:playlistId', getPlaylist);

router.get('/user/:userId', getUserPlaylists);

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

router.delete(
  '/song',
  [[[check('songId').not().isEmpty(), check('playlistId').not().isEmpty()]]],
  deleteSongFromPlaylist
);

router.delete('/', deletePlaylist);

module.exports = router;
