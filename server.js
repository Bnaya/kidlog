const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config();

// const db = mongoose.connection;

// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log('connected to database'));

// mongoose.connect(
//   process.env.DATABASE_URL,
//   {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   },

//   () => {
//     app.listen(3003, () => console.log('server started'));
//   }
// );

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App running on port ${port}`));
