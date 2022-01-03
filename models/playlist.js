const { Schema, model, Types } = require('mongoose');

const playlistSchema = new Schema({
  playlistName: {
    type: String,
    required: true,
  },
  playlistCover: {
    type: String,
    required: true,
  },
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  songs: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'Song',
    },
  ],
});

module.exports = model('Playlist', playlistSchema);
