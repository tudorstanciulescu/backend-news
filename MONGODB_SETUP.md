# 🔧 Configurare MongoDB Atlas

## Problema actuală
Serverul nu se poate conecta la MongoDB Atlas. Eroare: `ENOTFOUND _mongodb._tcp.news.utmqdic.mongodb.net`

## ✅ Soluție - Pași de urmat:

### 1. Verifică Network Access în MongoDB Atlas

1. Mergi la [MongoDB Atlas](https://cloud.mongodb.com/)
2. Loghează-te cu contul tău
3. Selectează proiectul tău
4. Click pe **"Network Access"** în meniul din stânga
5. Verifică dacă există o regulă care permite IP-ul tău sau adaugă:
   - Click pe **"Add IP Address"**
   - Selectează **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Sau adaugă IP-ul tău specific
6. Salvează

### 2. Verifică Database User

1. În MongoDB Atlas, click pe **"Database Access"**
2. Verifică dacă user-ul `tudorstanciulescu` există
3. Verifică parola (dacă ai schimbat-o, actualizează în `backend/server.js`)
4. Asigură-te că user-ul are rol de **"Read and write to any database"**

### 3. Obține Connection String-ul corect

1. Click pe **"Connect"** la cluster-ul tău
2. Selectează **"Connect your application"**
3. Copiază connection string-ul
4. Înlocuiește `<password>` cu parola ta
5. Înlocuiește `<dbname>` cu `news`

Ar trebui să arate așa:
```
mongodb+srv://tudorstanciulescu:<password>@news.utmqdic.mongodb.net/news?retryWrites=true&w=majority
```

### 4. Actualizează credențialele în cod

Dacă connection string-ul este diferit, actualizează în:
- `backend/server.js` (linia 12)
- `backend/createAdmin.js` (linia 6)

### 5. Repornește serverul

După ce ai făcut modificările în MongoDB Atlas:
1. Oprește serverul backend (închide fereastra PowerShell)
2. Pornește-l din nou: `cd backend && node server.js`
3. Ar trebui să vezi: `✅ Conectat la MongoDB - Baza de date: news`

### 6. Creează user-ul admin

După ce conexiunea funcționează, rulează:
```bash
cd backend
node createAdmin.js
```

Sau folosește ruta de register:
```bash
curl -X POST http://localhost:5000/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## 📊 Schema User

Fiecare user va avea:
- **username**: String (unic, obligatoriu)
- **password**: String (hash-uit cu bcrypt, obligatoriu)
- **createdAt**: Date (timestamp automat la creare)
- **updatedAt**: Date (timestamp automat la update)

## 🔐 Credențiale Admin (după creare)

- **Username**: `admin`
- **Password**: `admin123`

## ⚠️ Important

Dacă nu poți rezolva problema cu MongoDB Atlas, pot să:
1. Instalez MongoDB local
2. Configurez proiectul să folosească MongoDB local
3. Sau pot să te ajut să creezi un nou cluster MongoDB Atlas

