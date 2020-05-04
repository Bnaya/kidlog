const express = require('express');

const app = express();
const morganBody = require('morgan-body');

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
app.use((req, res) => {
  return res.status(404).json({
    message: 'Route Not Found',
  });
});

module.exports = app;
