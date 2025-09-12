const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session"); // ✅ need session for passport
const cors = require("cors");
require("dotenv").config();
require("./config/passport-setup");

const authRoutes = require("./routes/auth");

const app = express();

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ setup express-session BEFORE passport.session()
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true if HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session()); // ✅ enable session support

app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
