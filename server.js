// importing libraries
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// initializing app
const app = express();

// connecting database with server
mongoose.connect(
  "mongodb+srv://riddhi-admin:riddhi123@cluster0.tc66n.mongodb.net/Db",
  { useNewUrlParser: true },
  () => {
    console.log("connected to database");
  }
);

// router files import
const user = require("./routers/user");
const index = require("./routers/index");

// morgan setup
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// router files config
app.use("/u", user);
app.use("/", index);

// listen to port 3000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
