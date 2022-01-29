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
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = model('Song', songSchema);
