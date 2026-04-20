# Biblioteca lui Nico

Site cu cărți ilustrate protejate prin login.

- **Backend**: Node.js + Express + Mongoose (JWT auth, rate-limiting) → deploy pe **Render**
- **Frontend**: React + Vite + react-pageflip → deploy pe **Vercel**
- **DB**: MongoDB Atlas

Repo: `github.com/tudorstanciulescu/backend-news` (contul **fără** `97`).

---

## Setup pe PC nou

### 1. Clone

```bash
git clone https://github.com/tudorstanciulescu/backend-news.git
cd backend-news
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editează `backend/.env` și completează:
- `MONGO_URI` — connection string-ul de la MongoDB Atlas
- `JWT_SECRET` — string lung random
- `FRONTEND_ORIGIN` — `http://localhost:5173` (pentru dev)

Pornește backend-ul:
```bash
npm run dev
# → http://localhost:4000
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

Nu ai nevoie de `.env` local — Vite proxy-uiește `/api/*` către backend (`localhost:4000`).

Pornește frontend-ul:
```bash
npm run dev
# → http://localhost:5173
```

### 4. Seed user în MongoDB (doar prima dată per bază de date)

```bash
cd backend
npm run seed
```

Creează/actualizează user-ul `nico` cu parola `sticlimarci`. Dacă vrei alt user, editezi variabilele din `backend/seed.js` și rulezi din nou.

### 5. Login
- user: `nico`
- parolă: `sticlimarci`

---

## Deploy

### Backend (Render)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Env vars:
  - `MONGO_URI` — connection string Atlas
  - `JWT_SECRET` — string lung random
  - `FRONTEND_ORIGIN` — URL-ul Vercel (ex: `https://www.stanciulescutudor.ro,https://stanciulescutudor.ro`)
  - **Nu seta `PORT` manual** — Render îl setează automat
- Pe MongoDB Atlas → Network Access → `0.0.0.0/0` (altfel Render nu se poate conecta)

### Frontend (Vercel)
- Root directory: `frontend`
- Framework preset: Vite (auto-detect)
- Env var:
  - `VITE_API_BASE` — URL-ul backend-ului Render (ex: `https://backend-news-ww6b.onrender.com`)
- Pe Production + Preview + Development

URL-urile live curent:
- Frontend: `https://www.stanciulescutudor.ro`
- Backend: `https://backend-news-ww6b.onrender.com`

---

## Structură

```
backend/
  server.js          Express app + BOOKS data (hardcodat aici)
  models/User.js     schema Mongoose pentru users
  seed.js            creează/updatează user-ul în DB
  .env.example       variabilele de env necesare
frontend/
  src/
    App.jsx                routing minim cu History API
    context/AuthContext.jsx  login + authFetch + API_BASE
    components/
      LoginGate.jsx        pagina de login
      BookLibrary.jsx      lista de cărți
      BookViewer.jsx       citește cartea (page-flip)
  public/images/
    gradina-lui-nini/  imagini pentru cartea 1
    ferma-lui-nini/    imagini pentru cartea 2
    casa-lui-nini/     imagini pentru cartea 3 (locked, doar cover)
  vercel.json          SPA rewrites
```

---

## Adăugat o carte nouă

1. Pune imaginile JPG (quality 85, max ~800KB fiecare) în `frontend/public/images/nume-carte/`.
   - Convenție: `cover.jpg`, `page-01-nume.jpg`, `page-02-nume.jpg`, etc.
   - Pentru comprimare, ai `frontend/compress-images.mjs` (șters după ultima rulare — recreezi dacă ai nevoie, cu `sharp`).
2. În `backend/server.js`, în array-ul `BOOKS`, adaugă:
   ```js
   {
     id: "nume-carte",
     title: "Titlu Carte",
     subtitle: "Subtitlu",          // opțional
     cover: "/images/nume-carte/cover.jpg",
     pages: [
       { id: 1, image: "/images/nume-carte/page-01.jpg", lines: ["rând 1", "rând 2"] },
       // ...
     ],
   },
   ```
3. Commit + push. Render + Vercel se redeploy-ează automat.

### Cărți "locked" (teaser fără conținut)
Adaugi `locked: true` și `pages: []`. Va apărea în bibliotecă cu grayscale + lacăt + "Coming Soon...". Backend-ul refuză cu 423 dacă cineva încearcă să forțeze URL-ul.

---

## Adăugat un user nou

Editezi `backend/seed.js` (schimbi `USERNAME`, `PASSWORD`, `DISPLAY_NAME`) și rulezi `npm run seed`. Dacă vrei mai mulți useri, duplici scriptul sau rulezi de mai multe ori cu valori diferite.

---

## Git — push la repo corect

Repo-ul este pe **`tudorstanciulescu`** (fără `97`). Dacă git push dă "permission denied":

1. Windows → Credential Manager → Windows Credentials → șterge intrările `git:https://github.com`
2. Fă un push → browser-ul o să-ți ceară login → te autentifici cu contul `tudorstanciulescu`
3. La următoarele push-uri merge automat
