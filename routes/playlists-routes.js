const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const Playlist = require('../models/playlist');
const Song = require('../models/song');

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

const errorText = 'Adding song to playlist failed, please try again later';

const throwError = async (value, model, error) => {
  let item;
  try {
    item = await model.findById(value);
    console.log(item);
  } catch (err) {
    console.log(err);
    return Promise.reject(error);
  }
  if (!item) {
    return Promise.reject(error);
  }
};

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
  [
    body('songId', errorText)
      .not()
      .isEmpty()
      .custom(async value => throwError(value, Song, errorText)),
    body('playlistId')
      .not()
      .isEmpty()
      .custom(async value => throwError(value, Playlist, errorText)),
  ],
  postSongToPlaylist
);

router.patch(
  '/:playlistId',
  [body('playlistName').not().isEmpty(), body('playlistCover').not().isEmpty()],
  updatePlaylist
);

router.delete(
  '/song',
  [
    body('songId')
      .not()
      .isEmpty()
      .custom(async value => throwError(value, Song, errorText)),
    body('playlistId')
      .not()
      .isEmpty()
      .custom(async value => throwError(value, Playlist, errorText)),
  ],
  deleteSongFromPlaylist
);

router.delete('/:playlistId', deletePlaylist);

module.exports = router;
