const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middleware/auth");

// Start auth with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

// Protected route
router.get("/user", verifyJWT, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  });
});

module.exports = router;
