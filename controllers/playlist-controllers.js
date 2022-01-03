const Playlist = require('../models/playlist');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

exports.postPlaylist = async (req, res, next) => {
  const validationResultError = validationResult(req);

  console.log(validationResultError.isEmpty());
  if (!validationResultError.isEmpty()) {
    next(new HttpError('Invalid Inputs!', 500));
  }

  const { playlistName, playlistCover, userId } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    next(
      new HttpError('Creating playlist failed, please try again later.', 500)
    );
  }

  if (!user) {
    next(
      new HttpError('Creating playlist failed, please try again later.', 422)
    );
  }

  const createdPlaylist = new Playlist({
    playlistName,
    playlistCover,
    creator: userId,
    songs: [],
  });

  try {
    await createdPlaylist.save();
    user.playlists.push(createdPlaylist);
    await user.save();
  } catch (err) {
    console.log(err);
    next(
      new HttpError('Creating playlist failed, please try again later.', 500)
    );
  }

  res.json({ createdPlaylist, user });
};
