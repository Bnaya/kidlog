const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config();

const db = mongoose.connection;

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true },

  () => {
    app.listen(3003, () => console.log('server started'));
  }
);
