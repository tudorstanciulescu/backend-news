const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Conectare MongoDB
mongoose.connect("mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News")
  .then(async () => {
    console.log("✅ Conectat la MongoDB");
    
    // Verifică dacă admin există deja
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("⚠️  User-ul admin există deja!");
      process.exit(0);
    }

    // Creează admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "admin",
      password: hashedPassword
    });

    console.log("✅ Admin creat cu succes!");
    console.log("Username: admin");
    console.log("Password: admin123");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Eroare:", err);
    process.exit(1);
  });

