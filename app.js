const express = require('express');
const app = express();
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const MONGODB_URI = 'mongodb://localhost:27017/waves';

const usersRouter = require('./routes/users-routes');
const songsRouter = require('./routes/songs-routes');
const playlistsRouter = require('./routes/playlists-routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/songs', songsRouter);
app.use('/playlists', playlistsRouter);

app.use(() => {
  throw new HttpError('Couldnt find this route');
});

app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ message: err.message || 'An unkown error occured!' });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(9000))
  .catch(err => console.log(err));
