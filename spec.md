<!-- Spec -->

# Közösségi parkolást segítő portál  
## Követelményspecifikáció  
**Szoftverarchitektúrák tárgy projektmunka**

---

### Csapattagok

| Név | Neptun-kód | E-mail cím |
|-----|-------------|-------------|
| Csiszár Alex Gergő | PL4XKM | csiszaralex@edu.bme.hu |
| Sinkó Viktor Péter | XCT9YC | sinkoviktorpeter@gmail.com |
| Smuk Ferenc | NRWCFL | frigyes.smuk@gmail.com |
| Cseh Bálint István | WRNJPE | csehbalintistvan@edu.bme.hu |

**Konzulens:** Gazdi László  

---

## 1. Feladatkiírás  

A hallgatók feladata egy olyan térkép alapú online rendszer kifejlesztése, amelyik lehetővé teszi felhasználóinak, hogy megosszák az általuk ismert  ingyenes/előnyös parkolási lehetőségeket a többi felhasználóval. A rendszer legyen elérhető mobil készülékekről.

Az alkalmazás szükséges funkciói:

- fényképek feltöltése a parkolókról,
- a cím alapú keresés,
- a kiválasztott parkolóhoz való navigációt,
- GPS és készülékmozgás alapján ismerje fel, ha valaki leparkolt, és mentse a helyet
- segítsen a leparkolt autóhoz visszatalálni
- legyen lehetőség emlékeztető beállítására a parkolási díj fizetéséhez

A végleges követelmények a konzulenssel egyeztetve alakítandóak ki!

A technológia kiválasztása a hallgatók feladata!

---

## 2. Részletes feladatleírás  

### 2.1. Cél  
Egy térképalapú, közösségi portál létrehozása, ahol a felhasználók parkolási helyeket oszthatnak meg és kereshetnek.  
A rendszer a GPS-adatok alapján felismeri, ha a felhasználó leparkol, elmenti a helyet, és segít később visszatalálni.  

### 2.2. A rendszer funkciói  

#### Fő funkciók
- **Regisztráció és bejelentkezés** (Google / OAuth2)  
- **Parkolóhely hozzáadása**: cím, leírás, kategória és fénykép megadásával  
- **Térképes megjelenítés**: az összes felhasználói bejegyzés látható egy interaktív térképen  
- **Keresés és szűrés**: cím vagy kategória alapján  
- **Navigáció indítása**: a kiválasztott parkolóhoz külső navigációs app megnyitása  
- **Automatikus parkolásfelismerés**: GPS és mozgásérzékelés alapján  
- **Mentett hely visszakeresése**: az utolsó parkolási hely megjelenítése és útvonalterv  
- **Emlékeztető beállítása**: parkolási díj lejáratára push notification  

#### Admin funkciók (opcionális)
- Parkolóbejegyzések moderálása, hibás adatok törlése  
- Felhasználói fiókok kezelése  

---

## 3. Technikái paraméterek  

A rendszer **React + Next.js + TypeScript** technológiákra épül, a backend **Node.js (Express)** alapú REST API, az adatok tárolása **PostgreSQL** adatbázisban történik.

| Komponens | Technológia | Leírás |
|------------|--------------|--------|
| Frontend | React, Next.js, TypeScript | Reszponzív, dinamikus felhasználói felület |
| Backend | Node.js (Express) | REST API, hitelesítés, parkolóhelyek CRUD funkciói |
| Adatbázis | PostgreSQL | Parkolóhelyek, felhasználók tárolása |
| Térkép | Leaflet.js / Mapbox | Térképi megjelenítés és geokódolás |
| Hitelesítés | Firebase Auth / OAuth2 | Google-fiókos belépés |
| Fájlkezelés | Firebase Storage / AWS S3 | Képfeltöltés |

**Fejlesztési környezet:**    
- Git verziókezelés (GitHub repository)  
- Postman a backend API-k tesztelésére  

**Célplatform:**  
- Bármely modern böngésző (Chrome, Firefox)  
- Mobil: Android (opcionálisan iOS)  

---

## 4. A rendszer által használt fogalmak (Szótár)

| Fogalom | Jelentés |
|----------|-----------|
| **Parkolóhely** | Egy konkrét földrajzi hely, ahol gépjármű elhelyezhető. |
| **Felhasználó** | Regisztrált személy, aki parkolóhelyeket adhat hozzá és megtekintheti azokat. |
| **Metaadatok** | A parkolóhoz tartozó leíró információk (pl. cím, kategória, fénykép). |
| **GPS-helyzet** | A felhasználó aktuális földrajzi koordinátái. |
| **Automatikus parkolásfelismerés** | A rendszer mozgás és GPS-adatok alapján azonosítja a parkolást. |
| **Push notification** | Böngésző vagy mobilértesítés a felhasználónak. |

---

## 5. Esszenciális use-case-ek  

### 5.1. Use-case diagram

![Use-case diagram](usecase1.jpg)