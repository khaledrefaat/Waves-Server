const Playlist = require('../models/playlist');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

exports.getPlaylists = async (req, res, next) => {
  let playlists;

  try {
    playlists = await Playlist.find({});
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  res.json(playlists);
};

exports.getPlaylist = async (req, res, next) => {
  const { playlistId } = req.params;

  let playlist;

  try {
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  if (!playlist) {
    return next(new HttpError('Couldnt find this playlist.', 422));
  }

  res.json(playlist);
};

exports.getUserPlaylists = async (req, res, next) => {
  const { userId } = req.params;

  let user;

  try {
    user = await User.findById(userId)
      .select('username _id')
      .populate('playlists');
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  if (!user) {
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  res.json(user);
};

exports.postPlaylist = async (req, res, next) => {
  const validationResultError = validationResult(req);

  console.log(validationResultError.isEmpty());
  if (!validationResultError.isEmpty()) {
    return next(new HttpError('Invalid Inputs!', 500));
  }

  const { playlistName, playlistCover, userId } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating playlist failed, please try again later.', 500)
    );
  }

  if (!user) {
    return next(
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
    return next(
      new HttpError('Creating playlist failed, please try again later.', 500)
    );
  }

  res.json({ createdPlaylist, user });
};
