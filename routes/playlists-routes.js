const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { postPlaylist } = require('../controllers/playlist-controllers');

router.post(
  '/',
  [
    check('playlistName').not().isEmpty(),
    check('playlistCover').not().isEmpty(),
  ],
  postPlaylist
);

module.exports = router;
