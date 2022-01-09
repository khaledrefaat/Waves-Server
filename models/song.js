const { Schema, model, Types } = require('mongoose');

const songSchema = new Schema({
  song: {
    type: String,
    required: true,
  },
  songName: {
    type: String,
    required: true,
  },
  songCover: {
    type: String,
    required: true,
  },
  songArtist: String,
  // i was about to make teh song may be in many playlists here and i was about to implement the code to make user can push song to play list
  playlists: [
    {
      type: Types.ObjectId,
      ref: 'Playlist',
    },
  ],
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = model('Song', songSchema);
