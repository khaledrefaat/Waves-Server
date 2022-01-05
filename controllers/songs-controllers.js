const Song = require('../models/song');
const Playlist = require('../models/playlist');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator');

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

exports.getSong = async (req, res, next) => {
  const { songId } = req.params;

  let song;
  try {
    song = await Song.findById(songId).populate('creator', 'username _id');
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later', 500)
    );
  }

  if (!song) {
    return next(new HttpError('Couldnt find this song.', 422));
  }

  res.json(song);
};

exports.getUserSongs = async (req, res, next) => {
  const { userId } = req.params;

  let user;

  try {
    user = await User.findById(userId).select('username _id').populate('songs');
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later', 500)
    );
  }

  if (!user) {
    return next(
      new HttpError('Something went wrong, please try again later', 500)
    );
  }

  res.json(user);
};

exports.postSong = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return next(new HttpError('Invalid Inputs!', 422));
  }

  const { song, songName, songCover, songArtist, userId } = req.body;

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  if (!user) {
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  const createdSong = new Song({
    song,
    songName,
    songCover,
    songArtist,
    playlists: [],
    creator: userId,
  });

  try {
    await createdSong.save();
    user.songs.push(createdSong);
    await user.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  res.json(createdSong);
};
