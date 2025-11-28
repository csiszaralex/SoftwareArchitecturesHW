# 4. Telepítési és Üzemeltetési útmutató

Ez a fejezet lépésről lépésre bemutatja, hogyan állítható be a fejlesztői környezet és hogyan indítható el a rendszer helyi gépen, konténerizáció nélkül.

## 4.1. Előfeltételek (Prerequisites)
A szoftver futtatásához az alábbi szoftvereknek kell telepítve lenniük a gazdagépen:

* **Node.js (v20+):** JavaScript futtatókörnyezet.
* **pnpm (v9+):** Hatékony csomagkezelő (a Monorepo struktúra miatt ajánlott).
    * Telepítés: `npm install -g pnpm`
* **PostgreSQL (v14+):** Relációs adatbázis szerver.
    * Telepítve és futnia kell a háttérben (vagy elérhetőnek kell lennie egy felhő szolgáltatónál).
    * Létre kell hozni egy üres adatbázist (pl. `parking_db`).

## 4.2. Konfiguráció és Környezeti változók
A rendszer biztonsági okokból nem tárol titkos kulcsokat a forráskódban. Ezeket környezeti változókban (`.env`) kell megadni.

### 4.2.1. Backend konfiguráció (`apps/api/.env`)
Hozzon létre egy `.env` fájlt az `apps/api` mappában az alábbi tartalommal:

```env
# Szerver beállítások
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Adatbázis kapcsolat (PostgreSQL Connection String)
# Formátum: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/parking_db?schema=public"

# Biztonság (JWT titkos kulcs - tetszőleges hosszú string)
JWT_SECRET="szupertitkos_fejlesztoi_kulcs"

# Google OAuth2 (Google Cloud Console-ból)
GOOGLE_CLIENT_ID="<GOOGLE_CLIENT_ID>"
GOOGLE_CLIENT_SECRET="<GOOGLE_CLIENT_SECRET>"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Értesítések (VAPID kulcsok - generálható: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY="<VAPID_PUBLIC_KEY>"
VAPID_PRIVATE_KEY="<VAPID_PRIVATE_KEY>"
VAPID_SUBJECT="mailto:admin@example.com"

# Képfeltöltés (Firebase)
FIREBASE_STORAGE_BUCKET="<PROJECT_ID>.firebasestorage.app"
GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-sdk.json"
```

> **Fontos:** A Firebase Service Account kulcsfájlt (`firebase-admin-sdk.json`) másolja be az `apps/api/` gyökérkönyvtárába!

### 4.2.2. Frontend konfiguráció (`apps/web/.env.local`)
Hozzon létre egy `.env.local` fájlt az `apps/web` mappában:

```env
# Backend API elérhetősége
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Térkép (Mapbox Public Token)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ<...>"
```

## 4.3. Telepítés és Adatbázis inicializálás

Nyisson egy terminált a projekt gyökérkönyvtárában, és kövesse az alábbi lépéseket:

**1. Függőségek telepítése:**
Mivel Monorepo-t használunk, ez a parancs telepíti a backend, a frontend és a közös csomagok összes függőségét.
```bash
pnpm install
```

**2. Adatbázis séma szinkronizálása (Migráció):**
Ez a lépés létrehozza a szükséges táblákat (User, ParkingSpot, stb.) a megadott PostgreSQL adatbázisban.
```bash
# Lépjen a backend könyvtárba
cd apps/api

# Migráció futtatása
pnpm exec prisma db push

# (Opcionális) Tesztadatok feltöltése
pnpm exec prisma db seed
```

**3. Visszalépés a gyökérbe:**
```bash
cd ../..
```

## 4.4. A Rendszer Indítása

A fejlesztői környezet indításához (ahol a Frontend és a Backend párhuzamosan fut) használja az alábbi parancsot a gyökérkönyvtárban:

```bash
pnpm dev
```

A TurboRepo elindítja mindkét alkalmazást:
* **Backend API:** [http://localhost:3001](http://localhost:3001) (Swagger dokumentáció: `/api-docs`)
* **Frontend Web App:** [http://localhost:3000](http://localhost:3000)

## 4.5. Hibaelhárítás

* **Adatbázis hiba:** Győződjön meg róla, hogy a PostgreSQL fut, és a `DATABASE_URL` helyes felhasználónevet/jelszót tartalmaz.
* **Hiányzó kulcsok:** Ha a térkép nem tölt be, ellenőrizze a `NEXT_PUBLIC_MAPBOX_TOKEN`-t. Ha a képfeltöltés nem működik, ellenőrizze a `firebase-admin-sdk.json` meglétét.
* **Port ütközés:** Ha a 3000-es vagy 3001-es port foglalt, állítsa le a futó folyamatokat, vagy módosítsa a `PORT` változókat az `.env` fájlokban.
