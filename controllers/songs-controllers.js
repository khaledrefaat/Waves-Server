const Song = require('../models/song');
const Playlist = require('../models/playlist');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator');

exports.postSong = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return next(new HttpError('Invalid Inputs!', 422));
  }

  const { song, songName, songCover, songArtist, playlistId, userId } =
    req.body;

  let user, playlist;

  try {
    user = await User.findById(userId);
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  if (!playlist || !user) {
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  const createdSong = new Song({
    song,
    songName,
    songCover,
    songArtist,
    playlist: playlistId,
    creator: userId,
  });

  try {
    await createdSong.save();
    playlist.songs.push(createdSong);
    user.songs.push(createdSong);
    await playlist.save();
    await user.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  res.json(createdSong);
};

exports.getSongs = async (req, res, next) => {
  let songs;

  try {
    songs = await Song.find({});
  } catch (err) {
    return next(
      new HttpError('Something went wrong, please try again later', 500)
    );
  }

  res.json({ songs });
};
