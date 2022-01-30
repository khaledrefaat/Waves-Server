const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const HttpError = require('./models/http-error');

const MONGODB_URI = 'add_your_api_key_here';

const usersRouter = require('./routes/users-routes');
const songsRouter = require('./routes/songs-routes');
const playlistsRouter = require('./routes/playlists-routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/users', usersRouter);
app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);

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

// start next time by adding sessions and protect routes by middleware
