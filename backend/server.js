const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session"); // ✅ use express-session
const cors = require("cors");
require("dotenv").config();
require("./config/passport-setup");

const authRoutes = require("./routes/auth");

const app = express();

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ setup express-session
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure:true if HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
