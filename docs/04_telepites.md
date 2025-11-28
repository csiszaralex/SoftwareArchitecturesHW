# 4. Telepítési és Üzemeltetési útmutató

Ez a fejezet bemutatja, hogyan indítható el a rendszer két külön módon:

1. **Docker Compose alapú futtatás** (EGY parancsból működik, ajánlott)
2. **Lokális futtatás konténerek nélkül** (Node.js + pnpm + lokális PostgreSQL)

Mindkét megoldáshoz szükséges:
- a `.env` és `.env.local` létrehozása a mellékelt `.env.example` fájlok alapján
- a `firebase-admin-sdk.json` bemásolása a backend gyökérkönyvtárába

---

# 4.1. Közös előkészületek (mindkét futtatási módhoz kötelező)

## 4.1.1. Környezeti változók

### Backend (`apps/api/.env`)
Hozza létre az `apps/api/.env` fájlt az `apps/api/.env.example` alapján:

```env
# Szerver beállítások
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Adatbázis kapcsolat (PostgreSQL Connection String)
# Lokális futtatás:
DATABASE_URL="postgresql://postgres:password@localhost:5432/parking_db?schema=public"
# Docker módban ezt a docker-compose.yml felülírja (host= db)

# JWT titkos kulcs
JWT_SECRET="szupertitkos_fejlesztoi_kulcs"

# Google OAuth2
GOOGLE_CLIENT_ID="<GOOGLE_CLIENT_ID>"
GOOGLE_CLIENT_SECRET="<GOOGLE_CLIENT_SECRET>"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Web Push VAPID kulcsok
VAPID_PUBLIC_KEY="<VAPID_PUBLIC_KEY>"
VAPID_PRIVATE_KEY="<VAPID_PRIVATE_KEY>"
VAPID_SUBJECT="mailto:admin@example.com"

# Firebase Storage
FIREBASE_STORAGE_BUCKET="<PROJECT_ID>.firebasestorage.app"
GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-sdk.json"
```

### Frontend (`apps/web/.env.local`)
Hozza létre az `apps/web/.env.local` fájlt az `apps/web/.env.local.example` alapján:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ<...>"
```

### Firebase Service Account
Másolja be a Google Cloud Console-ból letöltött:
`firebase-admin-sdk.json`
fájlt ide:
```apps/api/firebase-admin-sdk.json```

---

# 4.2. Docker Compose alapú futtatás

Ez a mód lehetővé teszi, hogy a teljes rendszer egy paranccsal induljon:

- PostgreSQL konténer
- Backend (NestJS)
- Frontend (Next.js)
- Prisma migrációk automatikusan lefutnak

## 4.2.1. Előfeltételek Dockerhez
Szükséges:

- Docker Desktop (Windows / macOS)
- Docker Engine + Docker Compose (Linux)

**Node.js, pnpm és PostgreSQL NEM kötelező**, mert minden konténerben fut.

## 4.2.2. Indítás Docker Compose-zal

Lépjen a projekt gyökérkönyvtárába, majd futtassa:

```bash
docker compose up -d --build
```

Ez:
- felépíti a Docker image-eket,
- elindítja a `db`, `api`, `web` konténereket,
- lefuttatja:
  - `pnpm exec prisma db push`
  - `pnpm exec prisma db seed`
- elindítja a NestJS és a Next.js szervereket.

## 4.2.3. Elérhetőségek Docker módban

- Backend API: <http://localhost:3001>
- Swagger: <http://localhost:3001/api-docs>
- Frontend: <http://localhost:3000>

## 4.2.4. Hasznos Docker parancsok

Leállítás:
```bash
docker compose down
```

Leállítás + adatbázis újraformázása:
```bash
docker compose down -v
```

Logok:
```bash
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db
```

---

# 4.3. Lokális futtatás konténerizáció nélkül

Ebben a módban **a fejlesztői gépen futtatjuk**:

- Node.js + pnpm
- lokális PostgreSQL
- lokális Prisma migrációk
- turborepo → `pnpm dev` indítja a projektet

## 4.3.1. Előfeltételek

A gépen legyen telepítve:

- Node.js (v20+)
- pnpm (v9+)
  - telepítés:  
    ```bash
    npm install -g pnpm
    ```
- PostgreSQL (v14+)
  - hozzon létre egy adatbázist: `parking_db`
  - felhasználó: `postgres`
  - jelszó: `password`
  (ennek megfelelően szerepel a `.env`-ben)

## 4.3.2. Telepítés

Lépjen a projekt gyökerébe:

```bash
pnpm install
```

## 4.3.3. Adatbázis migrációk futtatása

```bash
cd apps/api
pnpm exec prisma db push
pnpm exec prisma db seed
cd ../..
```

## 4.3.4. A rendszer indítása

```bash
pnpm dev
```

Elérhetőségek:

- Backend API: <http://localhost:3001>
- Swagger: <http://localhost:3001/api-docs>
- Frontend: <http://localhost:3000>

---

# 4.4. Hibaelhárítás (mindkét módhoz)

- **P1000 / PostgreSQL auth error**
  - lokális módban: rossz DB jelszó vagy nincs PostgreSQL futtatva
  - Docker módban: volume miatt régi DB jelszó él → használja:
    ```bash
    docker compose down -v
    docker compose up -d --build
    ```

- **Firebase / invalid_grant**
  - rossz service account JSON
  - rossz projekt bucket
  - JSON csere után kötelező: `docker compose up -d --build`

- **Mapbox nem tölt be**
  - `NEXT_PUBLIC_MAPBOX_TOKEN` rossz / hiányzik

- **Port ütközés**
  - módosítsa a 3000 vagy 3001 portot `.env`-ben és `docker-compose.yml`-ben is.