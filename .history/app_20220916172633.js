require("dotenv").config();
require("./config/database").connect();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const express = require("express");
var cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

// Logic goes here

module.exports = app;

// importing user context
const User = require("./model/user");
const TimeEntries = require("./model/time-entries");

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  const auth = require("./middleware/auth");

app.post("/add-entry", auth, async(req, res) => {
  try {
    // Get user input
    const { type } = req.body;
    console.log(req.user);
    const entry = await TimeEntries.create({
      type,
      loggedBy: req.user.user_id
    });
    // return new user
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(400).send("Welcome 🙌 ");
  }
  
});

app.post("/logged-status", auth, async (req, res) => {
  try {
    // Get user input
    const lastRecord = await await TimeEntries.find({loggedBy: req.user.user_id}).sort({"dateTime": -1}).limit(1);
    console.log(lastRecord);
    res.status(200).json({});
  } catch (err) {
    res.status(400).send("Welcome 🙌 ");
  }
});

app.get("/test", (req, res) => {
  
  res.status(200).send("Welcome 🙌 ");
});

