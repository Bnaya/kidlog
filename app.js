require("dotenv").config();
const morganBody = require('morgan-body');
const express = require("express");
const app = express();


const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
morganBody(app);

app.use("/posts", postsRouter);
app.use("/users", usersRouter);


const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));



app.use(express.json());

app.use((req, res, next) => {
  res.status(404).send("page not found");
});

mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true },

  () => {
    app.listen(3003, () => console.log("server started"));
  }
);