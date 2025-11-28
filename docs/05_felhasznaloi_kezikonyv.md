# 5. Felhasználói kézikönyv és az Alkalmazás bemutatása

Ez a fejezet képernyőképekkel illusztrálva mutatja be az elkészült szoftver főbb funkcióit, lehetővé téve a rendszer megismerését futtatás nélkül is.

## 5.1. Belépés

Az alkalmazás első megnyitásakor egy letisztult bejelentkező képernyő fogadja a felhasználót. Mivel PWA (Progressive Web App) alkalmazásról van szó, a felület mobil eszközökön is natív élményt nyújt.

- **Hitelesítés:** A "Belépés Google-lel" gombra kattintva a felhasználó a Google biztonságos oldalára irányítódik, majd sikeres azonosítás után visszakerül az alkalmazásba.

![Bejelentkezés képernyő](./images/login.png)

_1. ábra: Bejelentkező képernyő_

## 5.2. Térkép és Keresés

A sikeres belépés után a főoldalra, a térképnézetre jutunk. Itt láthatók a közösség által feltöltött parkolóhelyek.

- **Markerek:** A piros tűk jelölik a parkolókat.
- **Keresősáv:** A felső sávban név vagy cím alapján kereshetünk.
- **Fejlett szűrő:** A szűrő ikonra kattintva lenyílik a panel, ahol beállíthatjuk a **keresési sugarat (Radius)** egy csúszkával, illetve szűrhetünk **kategóriára** (pl. csak Ingyenes vagy P+R).
- **Sötét mód (Dark Mode):** A jobb felső sarokban található Nap/Hold ikonnal bármikor válthatunk a világos és sötét téma között. Ez nemcsak a felület színeit, hanem a **térkép stílusát** is azonnal módosítja (Mapbox Dark Style), ami éjszakai vezetésnél különösen hasznos.

|                Világos Mód (Light)                |                      Sötét Mód (Dark)                      |
| :-----------------------------------------------: | :--------------------------------------------------------: |
| ![Főoldal világos módban](./images/map_light.png) |       ![Főoldal sötét módban](./images/map_dark.png)       |
|        _2. ábra: Főoldal világos témával_         | _3. ábra: Ugyanaz az oldal sötét témával fejlett szűrővel_ |

## 5.3. Parkoló részletei és Navigáció

Ha a felhasználó rákattint egy markerre, egy információs ablak (Popup) jelenik meg.

- **Információk:** Látható a parkoló neve, címe, kategóriája (színes címkével) és a feltöltött fotó.
- **Távolság:** A rendszer kiszámolja és megjeleníti a felhasználó aktuális pozíciójától mért távolságot.
- **Navigáció:** A "Tervezés ide" (nyíl) ikonra kattintva a telefon automatikusan megnyitja az alapértelmezett navigációs alkalmazást (Google Maps, Waze vagy Apple Maps) az útvonaltervvel.

![Parkoló popup](./images/spot_popup.png)

_4. ábra: Parkoló részletei, fotóval és navigációs gombbal_

## 5.4. Új parkoló felvétele

A "Hozzáadás" gombbal (vagy a térképen jobb klikkel) nyitható meg a rögzítő űrlap.

- **Helyszín pontosítása:** A felhasználó egy mozgatható "célkereszt" segítségével pontosíthatja a parkoló helyét a térképen.
- **Képfeltöltés:** Fotó készíthető a kamerával vagy feltölthető a galériából. A kép a háttérben a Firebase felhőbe kerül.
- **Validáció:** Az űrlap csak akkor küldhető be, ha minden kötelező adat (név, kategória) helyesen ki van töltve.

![Új parkoló hozzáadása](./images/add_spot_dialog.png)

_5. ábra: Parkoló hozzáadása űrlap térképes helyválasztóval_

## 5.5. Parkolási folyamat (Session)

Ez az alkalmazás egyik legfontosabb funkciója.

1.  **Indítás:** A jobb alsó sarokban lévő "Leparkoltam itt" gombbal indítható a parkolás. Opcionálisan beállítható a jegy lejárati ideje.
2.  **Aktív státusz:** A térkép sarkában megjelenik egy kártya, amely mutatja, mióta parkolunk (vagy mennyi idő van hátra). A térképen egy "Autó" ikon jelzi a kocsi helyét.
3.  **Visszatalálás:** A "Visszatalálás" gomb megnyitja a navigációt a leparkolt autóhoz.
4.  **Értesítés:** Ha lejár az idő, a rendszer **Push Notificationt** küld a telefonra (akkor is, ha a képernyő le van zárva).

![Parkolásindítása ablak](./images/start_session.png)

_6. ábra: Parkolásindítása ablak_

![Aktív parkolás](./images/active_session.png)

_7. ábra: Folyamatban lévő parkolás időzítővel és az autó pozíciójával_
