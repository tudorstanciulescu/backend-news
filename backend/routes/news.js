const router = require("express").Router();
const News = require("../models/News");
const jwt = require("jsonwebtoken");

// JWT Secret din environment variable
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// middleware verificare token
function verify(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Neautorizat");

  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      // Token expirat sau invalid
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expirat", expired: true });
      }
      return res.status(401).json("Token invalid");
    }
    req.user = data;
    next();
  });
}

// GET știri
router.get("/", async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.json(news);
});

// POST știre
router.post("/", verify, async (req, res) => {
  const news = await News.create({
    title: req.body.title,
    content: req.body.content,
  });
  res.json(news);
});

// DELETE știre
router.delete("/:id", verify, async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ message: "Știre ștearsă" });
});

module.exports = router;
