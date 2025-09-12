const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: String,
  email: String,
  picture: String,
  accessToken: String, // 🔑 Store Google access token
  refreshToken: String, // (optional) Store refresh token for long-term access
});

module.exports = mongoose.model("User", UserSchema);
