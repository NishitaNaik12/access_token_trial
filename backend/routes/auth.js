const router = require("express").Router();
const passport = require("passport");

// Start auth with Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard"); // frontend redirect
  }
);

// Get logged in user
router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {});
  res.redirect("http://localhost:5173/");
});

module.exports = router;
