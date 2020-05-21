const express = require('express');
const morganBody = require('morgan-body');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const childrenRouter = require('./routes/children');

const app = express();

//**GLOBAL MIDDLEWARES */
//Set security HTTP Header
app.use(helmet());

//Development logging
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  morganBody(app);
}

//Limit Requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/', limiter);

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10k' }));

//CORS support cross-origin resource sharing or CORS
// app.use(cors());

//Serving static files - add this then building the client
// app.use(express.static(path.join(__dirname, '../client/build')));

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
