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
    id: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    creator: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  songs: [
    {
      song: { type: Types.ObjectId, required: true, ref: 'Song' },
    },
  ],
});

module.exports = model('Playlist', playlistSchema);
