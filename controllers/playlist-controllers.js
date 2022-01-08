const mongoose = require('mongoose');

const Playlist = require('../models/playlist');
const User = require('../models/user');
const Song = require('../models/song');
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
    playlist = await Playlist.findById(playlistId).populate(
      'creator',
      'username _id'
    );
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

  const { playlistName, playlistCover } = req.body;

  let user;
  try {
    user = await User.findById(req.userData.userId);
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
    creator: req.userData.userId,
    songs: [],
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlaylist.save({ session });
    user.playlists.push(createdPlaylist);
    await user.save({ session });
    session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating playlist failed, please try again later.', 500)
    );
  }

  res.json({ createdPlaylist });
};

exports.postSongToPlaylist = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return next(
      new HttpError(
        'Adding song to playlist failed, please try again later',
        500
      )
    );
  }

  const { songId, playlistId } = req.body;

  let song, playlist;

  try {
    song = await Song.findById(songId);
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        'Adding song to playlist failed, please try again later',
        500
      )
    );
  }

  if (!song || !playlist) {
    return next(
      new HttpError(
        'Adding song to playlist failed, please try again later',
        500
      )
    );
  }

  try {
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        'Adding song to playlist failed, please try again later',
        500
      )
    );
  }

  // this is preventing to make many playlists in the same song but not making many songs in the same playlist

  const findSongPlaylist = song.playlists.find(
    playlist => playlist._id.toString() === playlistId.toString()
  );

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    playlist.songs.push(song);
    song.playlists.push(playlist);
    await playlist.save({ session });
    if (!findSongPlaylist) {
      await song.save({ session });
    }
    session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        'Adding song to playlist failed, please try again later',
        500
      )
    );
  }
  next();
};

exports.updatePlaylist = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return next(
      new HttpError('Updating playlist failed, please try again later', 500)
    );
  }

  const { playlistId } = req.params;
  const { playlistName, playlistCover } = req.body;

  let playlist;
  try {
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Updating playlist failed, please try again later', 500)
    );
  }

  if (!playlist) {
    return next(
      new HttpError('Updating playlist failed, please try again later', 500)
    );
  }

  playlist.playlistName = playlistName;
  playlist.playlistCover = playlistCover;

  try {
    await playlist.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Updating playlist failed, please try again later', 500)
    );
  }

  next();
};

exports.deleteSongFromPlaylist = async (req, res, next) => {
  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return next(
      new HttpError(
        'Deleting song from playlist failed, please try again later',
        500
      )
    );
  }

  const { songId, playlistId } = req.body;

  let song, playlist;

  try {
    song = await Song.findById(songId);
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        'Deleting song from playlist failed, please try again later',
        500
      )
    );
  }

  if (!song || !playlist) {
    return next(
      new HttpError(
        'Deleting song from playlist failed, please try again later',
        500
      )
    );
  }

  const playlistCurrentSongs = playlist.songs.filter(
    song => song._id.toString() === songId
  );

  if (playlistCurrentSongs.length > 1) {
    try {
      playlistCurrentSongs.splice(-1);
      playlist.songs = playlistCurrentSongs;
      await playlist.save();
    } catch (err) {
      console.log(err);
      return next(
        new HttpError(
          'Deleting song from playlist failed, please try again later',
          500
        )
      );
    }
    return next();
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    playlist.songs.pull(song);
    song.playlists.pull(playlist);
    await song.save({ session });
    await playlist.save({ session });
    session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        'Deleting song from playlist failed, please try again later',
        500
      )
    );
  }
  next();
};

exports.deletePlaylist = async (req, res, next) => {
  const { playlistId } = req.body;

  let playlist;
  try {
    playlist = await Playlist.findById(playlistId).populate(
      'creator',
      'playlists'
    );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Deleting playlist failed, please try again later', 500)
    );
  }

  if (!playlist) {
    return next(
      new HttpError('Deleting playlist failed, please try again later', 500)
    );
  }

  try {
    playlist.creator.playlists.pull(playlist);
    await playlist.creator.save();
    await playlist.remove();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Deleting playlist failed, please try again later', 500)
    );
  }

  next();
};
