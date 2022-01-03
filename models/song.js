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
  songCover: String,
  songArtist: String,
  playlist: {
    type: Types.ObjectId,
    required: true,
    ref: 'Playlist',
  },
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = model('Song', songSchema);
