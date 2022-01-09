const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  playlists: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'Playlist',
    },
  ],
  songs: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'Song',
    },
  ],
});

module.exports = model('User', userSchema);
