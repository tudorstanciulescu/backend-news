# 🚀 Ghid Deployment - Portal de Știri

## 🎯 Recomandare: Setup Gratuit + Domeniu

### Costul total: ~15 EUR/an (doar domeniul)

**Stack recomandat:**
- **Domeniu**: Namecheap sau Hostinger (~15 EUR/an)
- **Frontend**: Vercel (GRATUIT)
- **Backend**: Render (GRATUIT)
- **Database**: MongoDB Atlas (GRATUIT - folosești deja)

---

## 📝 Pas cu Pas: Deployment Complet

### Etapa 1: Pregătește Codul

#### 1.1. Creează fișier `.gitignore` (dacă nu există)

```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local

# Build
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

#### 1.2. Creează fișier `.env` pentru backend

Creează `backend/.env`:
```env
MONGODB_URI=mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News
JWT_SECRET=secret123
PORT=5000
```

#### 1.3. Actualizează `backend/server.js` pentru variabile de mediu

```javascript
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectare MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://...", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Conectat la MongoDB - Baza de date: news");
  } catch (err) {
    console.error("❌ Eroare MongoDB:", err.message);
  }
};

connectDB();

// Rute
app.use("/auth", require("./routes/auth"));
app.use("/news", require("./routes/news"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));
```

#### 1.4. Instalează dotenv în backend

```bash
cd backend
npm install dotenv
```

#### 1.5. Actualizează `backend/package.json`

```json
{
  "name": "backend-news",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^9.0.0"
  }
}
```

---

### Etapa 2: Deploy Backend pe Render

#### 2.1. Creează cont pe [Render.com](https://render.com/)

#### 2.2. Push codul pe GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/backend-news.git
git push -u origin main
```

#### 2.3. Creează Web Service pe Render
1. Click pe "New +" → "Web Service"
2. Conectează repository-ul GitHub
3. Setări:
   - **Name**: `news-backend` (sau alt nume)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Environment Variables (Add):
   - `MONGODB_URI`: connection string-ul tău MongoDB
   - `JWT_SECRET`: `secret123`
   - `PORT`: `5000`

5. Click "Create Web Service"

#### 2.4. Notează URL-ul backend-ului
După deploy, vei primi un URL gen: `https://news-backend.onrender.com`

---

### Etapa 3: Deploy Frontend pe Vercel

#### 3.1. Creează fișier `.env` pentru frontend

Creează `frontend/frontend/.env`:
```env
VITE_API_URL=https://news-backend.onrender.com
```

#### 3.2. Actualizează toate URL-urile API în frontend

În loc de `http://localhost:5000`, folosește:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Exemplu în Login.jsx:
axios.post(`${API_URL}/auth/login`, { username, password })
```

#### 3.3. Creează cont pe [Vercel.com](https://vercel.com/)

#### 3.4. Deploy pe Vercel
1. Click "Add New..." → "Project"
2. Import repository GitHub
3. Setări:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Environment Variables:
   - `VITE_API_URL`: `https://news-backend.onrender.com`

5. Click "Deploy"

#### 3.5. Notează URL-ul frontend-ului
Vei primi un URL gen: `https://news-portal.vercel.app`

---

### Etapa 4: Configurează Domeniul

#### 4.1. Cumpără domeniul
De exemplu: `portalstiri.ro` de pe Hostinger

#### 4.2. Configurează DNS în Vercel (pentru frontend)

În Vercel:
1. Mergi la Project Settings → Domains
2. Adaugă domeniul tău: `portalstiri.ro`
3. Vercel îți va da recorduri DNS

În Hostinger (sau alt registrar):
1. Mergi la DNS Management
2. Adaugă recordurile date de Vercel:
   - Type: `A` → Value: IP-ul dat de Vercel
   - Type: `CNAME` → Value: `cname.vercel-dns.com`

#### 4.3. Configurează subdomeniu pentru backend (opțional)

Poți folosi `api.portalstiri.ro` pentru backend:

În Render:
1. Settings → Custom Domain
2. Adaugă: `api.portalstiri.ro`

În DNS:
1. Adaugă CNAME: `api` → `news-backend.onrender.com`

Apoi actualizează în frontend:
```env
VITE_API_URL=https://api.portalstiri.ro
```

---

## 🔒 Securitate pentru Producție

### 1. Actualizează CORS în backend

```javascript
// backend/server.js
const allowedOrigins = [
  'https://portalstiri.ro',
  'https://www.portalstiri.ro',
  'http://localhost:5173' // pentru development
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### 2. Protejează ruta de register

```javascript
// backend/routes/auth.js
const jwt = require("jsonwebtoken");

// Middleware verificare admin
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Neautorizat");
  
  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, data) => {
    if (err) return res.status(401).json("Token invalid");
    req.user = data;
    next();
  });
}

// Protejează ruta de register
router.post("/register", verifyAdmin, async (req, res) => {
  // ... cod existent
});
```

### 3. Folosește variabile de mediu pentru JWT secret

```javascript
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123");
```

---

## 💰 Estimare Costuri

### Varianta Gratuită:
- **Domeniu .ro**: ~15 EUR/an
- **Frontend (Vercel)**: GRATUIT
- **Backend (Render)**: GRATUIT (cu limitări)
- **Database (MongoDB Atlas)**: GRATUIT (512MB)
- **Total**: ~15 EUR/an

### Varianta Plătită (Recomandată pentru trafic mare):
- **Domeniu .ro**: ~15 EUR/an
- **VPS (Hetzner)**: ~4.5 EUR/lună = 54 EUR/an
- **Database (MongoDB Atlas)**: GRATUIT sau $9/lună
- **Total**: ~70-180 EUR/an

---

## 🚀 Alternative Complete

### Opțiunea 1: Totul pe Vercel
- Frontend + Backend pe Vercel
- Vercel suportă și API routes (Node.js)
- ~$20/lună pentru plan Pro

### Opțiunea 2: VPS (Control total)
- Cumpără VPS de la Hetzner (~€4.5/lună)
- Instalează Node.js, Nginx, PM2
- Deploy manual dar control complet
- Tutoriale: [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)

### Opțiunea 3: Hosting Shared (Mai simplu)
- Hostinger Web Hosting (~€3/lună)
- Suportă Node.js
- Mai puțin flexibil dar mai simplu

---

## 📚 Resurse Utile

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Namecheap DNS Setup](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)

---

## ✅ Checklist Final

- [ ] Cod push-uit pe GitHub
- [ ] Backend deploiat pe Render
- [ ] Frontend deploiat pe Vercel
- [ ] Domeniu cumpărat
- [ ] DNS configurat
- [ ] SSL activ (automat pe Vercel/Render)
- [ ] CORS configurat corect
- [ ] Variabile de mediu setate
- [ ] Ruta /register protejată
- [ ] Testat pe domeniul final

---

## 🆘 Probleme Comune

### Backend-ul "doarme" pe Render (plan gratuit)
**Soluție**: 
- Upgrade la plan plătit ($7/lună)
- SAU folosește un cron job pentru a-l "trezi" la fiecare 10 minute

### CORS errors
**Soluție**: Verifică că backend-ul permite origin-ul frontend-ului

### MongoDB connection timeout
**Soluție**: Verifică IP whitelist în MongoDB Atlas (0.0.0.0/0 pentru toate IP-urile)

---

**Succes cu deployment-ul! 🚀**

