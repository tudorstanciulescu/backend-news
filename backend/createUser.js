const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Conectare MongoDB
mongoose.connect("mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News")
  .then(async () => {
    console.log("✅ Conectat la MongoDB");
    
    // Citește argumentele din linia de comandă
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
      console.log("❌ Trebuie să specifici username și parolă!");
      console.log("Utilizare: node createUser.js <username> <password>");
      console.log("Exemplu: node createUser.js admin2 parola123");
      process.exit(1);
    }

    // Verifică dacă user-ul există deja
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`⚠️  User-ul "${username}" există deja!`);
      process.exit(0);
    }

    // Creează user nou
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username,
      password: hashedPassword
    });

    console.log("✅ User creat cu succes!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Eroare:", err);
    process.exit(1);
  });

