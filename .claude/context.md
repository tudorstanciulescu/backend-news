# Context pentru Claude — continuare sesiune

> Notă pentru Claude: citește asta la începutul sesiunii dacă user-ul te întreabă „unde am rămas?" sau continuă lucrul pe proiectul ăsta de pe alt PC. Conține starea proiectului la data de 2026-04-20 și decizii luate care nu sunt evidente din cod.

## Despre proiect

**Biblioteca lui Nico** — site cu cărți ilustrate pentru Nico, protejate prin login. Înlocuiește un site vechi de știri/admin (structură complet schimbată).

Repo: `github.com/tudorstanciulescu/backend-news` (contul **fără** `97` — există și un `tudorstanciulescu97` dar NU se folosește).

- Frontend: React + Vite + react-pageflip → Vercel
- Backend: Node + Express + Mongoose (JWT auth) → Render
- DB: MongoDB Atlas (cluster `news`, DB `news`, colecția `users`)

## URL-uri live

- Frontend: `https://www.stanciulescutudor.ro` (Vercel, domeniu custom)
- Backend: `https://backend-news-ww6b.onrender.com` (Render)
- Health check: `/api/health` → `{"ok":true,"service":"gradina-lui-nini"}`

## Credențiale aplicație

- User: `nico` / parolă: `sticlimarci` (bcrypt hash în Mongo, NU hardcodat)
- Single-user app momentan, fără admin/roles

## Cărți implementate

Definite hardcodat în `backend/server.js` în array-ul `BOOKS`:
1. **Grădina lui Nini** (`gradina-lui-nini`) — 18 pagini, complet
2. **Ferma lui Nini** (`ferma-lui-nini`) — 11 pagini, complet
3. **Casa lui Nini** (`casa-lui-nini`) — `locked: true`, `pages: []`. Apare cu overlay grayscale + lacăt + "Coming Soon..." + animație wiggle la click. Backend returnează 423 la `/api/books/casa-lui-nini`.

Imaginile sunt în `frontend/public/images/<book-id>/*.jpg`. Toate PNG-urile inițiale (8MB fiecare) au fost comprimate cu `sharp` la JPG quality 85 — reducere 163MB → 14MB. Scriptul de comprimare a fost șters (`compress-images.mjs`) — recreezi din README dacă e nevoie.

## Env vars

### Backend (Render)
- `MONGO_URI` = `mongodb+srv://tudorstanciulescu:DontShareThisPassword@news.flryfbd.mongodb.net/news?retryWrites=true&w=majority&appName=News`
- `JWT_SECRET` = string lung random (setat pe Render)
- `FRONTEND_ORIGIN` = URL-ul Vercel, ex. `https://www.stanciulescutudor.ro,https://stanciulescutudor.ro`
- **NU** seta `PORT` — Render îl pune automat; setarea manuală a cauzat `no-server` la un moment dat.

Numele variabilei Mongo trebuie să fie **`MONGO_URI`** (nu `MONGODB_URI` — a existat confuzie pe Render la un moment dat).

### Frontend (Vercel)
- `VITE_API_BASE` = `https://backend-news-ww6b.onrender.com` (env var Vite → se bakează la build; la schimbare trebuie redeploy FĂRĂ cache).

### MongoDB Atlas
- Network Access: `0.0.0.0/0` (Render folosește IP-uri dinamice, altfel nu se conectează).

## Decizii importante / gotchas

1. **2 conturi GitHub**: user-ul are `tudorstanciulescu` și `tudorstanciulescu97`. Repo-ul Vercel + Render e pe **fără 97**. Git config local user.name = `tudorstanciulescu`. Dacă `git push` dă "permission denied", user-ul șterge intrările `git:https://github.com` din Windows Credential Manager și reautentifică la push.

2. **Structura repo aplatizată**: Inițial era `frontend/frontend/` (dublu nested). S-a aplatizat la `frontend/`. Vercel Root Directory trebuie să fie `frontend` (fără dublu).

3. **Backend nu are `.env` în git** (e gitignored). Pe PC nou trebuie copiat `.env.example` → `.env` și completat.

4. **Seed user**: `cd backend && npm run seed` — upsertează user-ul `nico`. Hardcodat în `seed.js`. Dacă user-ul vrea alt user, editează `USERNAME`/`PASSWORD`/`DISPLAY_NAME` în `seed.js`.

5. **Render free tier**: serverul doarme după 15 min idle; primul request după asta durează 30-60s să-l trezească. Nu e bug.

6. **Nu folosim MongoDB vechi cu Mongoose hardcodat URL**. User-ul ține la Mongo (are Atlas setup), dar NU la connection string hardcodat din vechiul cod. Totul prin env vars.

## TODO / în progress

Nimic la momentul 2026-04-20. Ultimele modificări:
- `9790220` — Expand README with full setup/deploy/auth instructions
- `899d21b` — Add 'Coming Soon' overlay with wiggle on locked book click (Casa lui Nini)
- `71e1af9` — Compress page images (163MB -> 14MB)

Posibile viitoare:
- User-ul va adăuga coperta pentru Casa lui Nini și eventual paginile ei.
- Dacă vrea să deblocheze cartea, trebuie: 1) pune imaginile, 2) modifică entry-ul în `server.js` (șterge `locked`, adaugă array `pages`), 3) commit+push.

## Stil colaborare

- User scrie în română, răspunde tot în română.
- Răspunsuri scurte, direct la obiect. Nu commentarii lungi.
- User NU e developer — explică fără jargon, cu pași clari numerotați când e deployment/config.
- Face deploy-urile singur pe Render/Vercel (GUI), Claude îi dă doar instrucțiuni pas cu pas.
- Push-urile se fac de pe Claude (bash), nu din GitHub Desktop.
