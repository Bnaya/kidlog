const express = require('express');
const morganBody = require('morgan-body');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const childrenRouter = require('./routes/children');

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  morganBody(app);
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/', limiter);

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
