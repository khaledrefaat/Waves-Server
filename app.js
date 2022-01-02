const express = require('express');
const app = express();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/waves';

const userRouter = require('./routes/users-routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', userRouter);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(9000))
  .catch(err => console.log(err));
