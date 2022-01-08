const Song = require('../models/song');
const Playlist = require('../models/playlist');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

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

  const { song, songName, songCover, songArtist } = req.body;

  let user;

  try {
    user = await User.findById(req.userData.userId);
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
    songArtist: songArtist,
    playlists: [],
    creator: req.userData.userId,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdSong.save({ session });
    user.songs.push(createdSong);
    await user.save({ session });
    session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating song failed, please try again later', 500)
    );
  }

  res.json(createdSong);
};

exports.updateSong = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return next(new HttpError('Invalid Inputs!', 422));
  }

  const { songId } = req.params;

  const { song, songName, songCover, songArtist } = req.body;

  let currentSong;
  try {
    currentSong = await Song.findById(songId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Update song failed, please try again later', 500)
    );
  }

  if (!currentSong) {
    return next(
      new HttpError('Update song failed, please try again later', 500)
    );
  }

  currentSong.song = song;
  currentSong.songName = songName;
  currentSong.songCover = songCover;
  currentSong.songArtist = songArtist;
  try {
    await currentSong.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Update song failed, please try again later', 500)
    );
  }
  next();
};

exports.deleteSong = async (req, res, next) => {
  const { songId } = req.body;

  let song;
  try {
    song = await Song.findById(songId).populate('creator');
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Deleting song failed, please try again later', 500)
    );
  }

  if (!song) {
    return next(
      new HttpError('Deleting song failed, please try again later', 500)
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    song.creator.songs.pull(song);

    await Playlist.updateMany(
      { _id: { $in: song.playlists } },
      { $pullAll: { songs: [songId] } }
    );

    await song.creator.save({ session });
    await song.remove({ session });

    session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Deleting song failed, please try again later', 500)
    );
  }

  next();
};
