require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectare MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News";
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout după 5 secunde
    });
    console.log("✅ Conectat la MongoDB - Baza de date: news");
  } catch (err) {
    console.error("❌ Eroare MongoDB:", err.message);
    console.log("⚠️  Serverul va rula dar fără bază de date!");
    console.log("📝 Verifică:");
    console.log("   1. Credențialele MongoDB Atlas");
    console.log("   2. IP-ul tău este whitelisted (0.0.0.0/0 pentru toate IP-urile)");
    console.log("   3. Conexiunea la internet");
  }
};

connectDB();

// Rute
app.use("/auth", require("./routes/auth"));
app.use("/news", require("./routes/news"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));
