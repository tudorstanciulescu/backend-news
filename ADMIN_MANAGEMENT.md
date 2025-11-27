# 👥 Gestionarea Adminilor

## 🎯 Cum să creezi un admin nou

### Metoda 1: Script din linia de comandă (Recomandat) ⭐

```bash
cd backend
node createUser.js <username> <password>
```

**Exemple:**
```bash
# Creează admin cu username "admin2" și parola "parola456"
node createUser.js admin2 parola456

# Creează admin cu username "tudor" și parola "tudor123"
node createUser.js tudor tudor123

# Creează admin cu username "editor" și parola "editor2025"
node createUser.js editor editor2025
```

### Metoda 2: Folosind API-ul (POST request)

Poți folosi ruta `/auth/register` pentru a crea useri noi:

**Cu PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/auth/register" -Method POST -ContentType "application/json" -Body '{"username":"admin2","password":"parola456"}'
```

**Cu curl:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin2","password":"parola456"}'
```

**Cu Postman sau Insomnia:**
- URL: `http://localhost:5000/auth/register`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "username": "admin2",
  "password": "parola456"
}
```

### Metoda 3: Creează o pagină de Register în frontend (Opțional)

Dacă vrei, pot să îți creez o pagină `/register` în frontend pentru a adăuga admini noi prin interfață.

## 📋 Verificare useri existenți

Pentru a vedea toți userii din baza de date:

```bash
cd backend
node -e "const mongoose = require('mongoose'); const User = require('./models/User'); mongoose.connect('mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News').then(async () => { const users = await User.find(); console.log('Useri:', users.length); users.forEach(u => console.log('- Username:', u.username, '| Created:', new Date(u.createdAt).toLocaleString())); process.exit(0); });"
```

## 🗑️ Ștergere admin

Pentru a șterge un admin, poți folosi:

```bash
cd backend
node -e "const mongoose = require('mongoose'); const User = require('./models/User'); mongoose.connect('mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News').then(async () => { await User.deleteOne({ username: 'admin2' }); console.log('User șters!'); process.exit(0); });"
```

Înlocuiește `'admin2'` cu username-ul pe care vrei să-l ștergi.

## 🔐 Schimbare parolă

Pentru a schimba parola unui admin:

```bash
cd backend
node -e "const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); const User = require('./models/User'); mongoose.connect('mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News').then(async () => { const newPassword = await bcrypt.hash('noua_parola', 10); await User.updateOne({ username: 'admin' }, { password: newPassword }); console.log('Parolă schimbată!'); process.exit(0); });"
```

Înlocuiește:
- `'noua_parola'` cu parola nouă
- `'admin'` cu username-ul căruia vrei să-i schimbi parola

## 📊 Schema User

Fiecare user are:
```javascript
{
  username: String,      // Unic, obligatoriu
  password: String,      // Hash-uit cu bcrypt
  createdAt: Date,       // Timestamp creare
  updatedAt: Date        // Timestamp ultima modificare
}
```

## ⚠️ Important

1. **Parolele sunt hash-uite** - nu pot fi recuperate, doar resetate
2. **Username-ul trebuie să fie unic** - nu poți avea 2 useri cu același username
3. **Nu există roluri diferite** - toți userii sunt admini cu aceleași drepturi
4. **Ruta `/auth/register` este publică** - în producție ar trebui protejată!

## 🔒 Securitate în producție

Pentru producție, ar trebui:
1. Să protejezi ruta `/auth/register` cu autentificare
2. Să adaugi un sistem de roluri (admin, editor, etc.)
3. Să folosești variabile de mediu pentru credențiale
4. Să implementezi rate limiting pentru login

## 📝 Fișiere importante

- `backend/createUser.js` - Script pentru creare useri
- `backend/createAdmin.js` - Script pentru creare admin default
- `backend/models/User.js` - Schema User
- `backend/routes/auth.js` - Rute autentificare (login, register)

---

**Credențiale curente:**
- Username: `admin`
- Password: `admin123`

