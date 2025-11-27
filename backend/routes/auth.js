const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register (pentru a crea admin)
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) return res.status(400).json("User-ul există deja");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    res.json({ message: "User creat cu succes", userId: user._id });
  } catch (err) {
    res.status(500).json("Eroare la creare user");
  }
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).json("User inexistent");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Parola greșită");

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token });
});

// Get all users (pentru admin dashboard)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude parola
    res.json(users);
  } catch (err) {
    res.status(500).json("Eroare la încărcarea userilor");
  }
});

module.exports = router;
