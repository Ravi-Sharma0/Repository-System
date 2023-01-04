const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const publicationsRoutes = require('./routes/publications-routes');
const usersRoutes = require('./routes/users-routes');
const Errors = require('./models/errors');

const app = express();

app.use(bodyParser.json());

app.use('/api/publications', publicationsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new Errors('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred!'});
});

const url = 'mongodb+srv://Mitro9:iltutmis@cluster0.4fv8teb.mongodb.net/repository?retryWrites=true&w=majority';

try {
  mongoose.connect(url, () => {
    console.log('DB Connected...');
  });
  app.listen(5000);
} catch (err) {
  console.log(err);
}
