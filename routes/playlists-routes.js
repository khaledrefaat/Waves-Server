const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  postPlaylist,
  getPlaylists,
  getPlaylist,
  getUserPlaylists,
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

module.exports = router;
