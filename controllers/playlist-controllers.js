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
    playlist.songs.push(song);
    playlist.save();
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
  const songPlaylist = song.playlists.find(
    playlist => playlist._id.toString() === playlistId.toString()
  );
  if (songPlaylist) {
    return next();
  }

  try {
    song.playlists.push(playlist);
    song.save();
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

  console.log(song);
  console.log(playlist);
  try {
    playlist.songs.pull(song);
    await song.playlists.pull(playlist);
    await song.save();
    playlist.save();
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
