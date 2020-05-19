const express = require('express');
const { protect } = require('./controllers/authController');
const app = express();
const morganBody = require('morgan-body');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const childrenRouter = require('./routes/children');

app.use(express.json());
morganBody(app);

//*****GENERAL ROUTEES*****
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Kidlog project!',
  });
});

//*****OTHER ROUTEES*****
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/users', childrenRouter);

// send 404 if no other route matched
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
