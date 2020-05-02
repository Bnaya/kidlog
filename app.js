const express = require('express');
const morganBody = require('morgan-body');
const app = express();

const mongoose = require('mongoose');
require('dotenv').config();
const db = mongoose.connection;

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
  res.status(404).json({
    message: 'Route Not Found',
  });
});

mongoose.set('useUnifiedTopology', true);
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));



app.use((req, res, next) => {
  res.status(404).send('page not found');
});

mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true },

  () => {
    app.listen(3003, () => console.log('server started'));
  }
);
