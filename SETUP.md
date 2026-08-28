# Koppla checklistan till Google Sheet och adminvyn

Målbild: **checklista → Google Sheet (databas) → adminvy**. Checklistan loggar varje utresa och slutrapport i ett kalkylark, slutrapporten mejlas som vanligt till filmteamet@xft.se, och adminvyn (`admin.html`) visar allt snyggt: vad som är ute i fält just nu, öppna avvikelser och status per pryl.

Installationen tar ungefär fem minuter och görs i ditt Google-konto.

## 1. Skapa kalkylarket

1. Gå till [sheets.new](https://sheets.new) och skapa ett nytt kalkylark.
2. Döp det till till exempel **XFT Utrustningslogg**.

Flikarna **Logg** och **Avvikelser** skapas automatiskt av skriptet vid första händelsen — du behöver inte förbereda något i arket.

## 2. Lägg in skriptet

1. I kalkylarket: öppna **Tillägg → Apps Script**.
2. Radera exempelkoden i editorn och klistra in hela innehållet i [`apps-script/Code.gs`](apps-script/Code.gs).
3. Ändra raden `const ADMIN_KEY = 'BYT-MIG-...'` till en egen, lång nyckel (till exempel en slumpad mening). Nyckeln är det enda som skyddar adminvyns data.
4. Spara (Ctrl/Cmd + S).

## 3. Publicera som webbapp

1. Klicka **Distribuera → Ny distribution**.
2. Välj typ **Webbapp** (kugghjulet uppe till vänster om rutan).
3. Ställ in: **Kör som: Jag** och **Vem har åtkomst: Alla**.
4. Klicka **Distribuera** och godkänn behörigheterna (skriptet behöver läsa/skriva arket och skicka mejl från ditt konto).
5. Kopiera **webbappens adress** — den slutar på `/exec`.

## 4. Anslut adminvyn

1. Öppna `admin.html` på er GitHub Pages-adress (samma adress som checklistan, men med `/admin.html` på slutet).
2. Klistra in webbappens adress och admin-nyckeln. Uppgifterna sparas bara i den webbläsaren, så du och produktionschefen gör detta en gång var.

## 5. Koppla in checklistan

Checklistan skickar till Google först när webbappens adress är inlagd i `index.html`:

- Skicka adressen till Claude i Claude Code så läggs den in och pushas, **eller**
- ändra själv raden `const BACKEND_URL = '';` i `index.html` på GitHub till `const BACKEND_URL = 'https://script.google.com/macros/s/.../exec';`

Så länge `BACKEND_URL` är tom fortsätter allt via Formspree precis som tidigare (utan utresanmälan), så bytet kan göras när det passar.

## 6. Testa

1. Gör ett testuppdrag i checklistan: lås en utresa, bekräfta hemresan, slutför på kontoret.
2. Kontrollera att raderna dyker upp i **Logg** (en Utresa-rad och en Rapport-rad), att mejlet kommer till filmteamet@xft.se och att uppdraget syns i adminvyn.

## Om något inte fungerar

**Börja alltid med knappen "Testa anslutningen" i adminvyn.** Den kontrollerar de tre saker som brukar fattas efter en utplacering — kopplingen till kalkylarket, skrivbehörigheten och mejlbehörigheten — och visar grönt eller rött för var och en. Den visar också vilken skriptversion som faktiskt är utplacerad, så att du ser om koden i Apps Script behöver uppdateras.

Checklistan visar dessutom Google-skriptets eget felmeddelande på skärmen när sändningen misslyckas, och du kommer alltid vidare: **Skicka som mejl i stället** mejlar rapporten via reservvägen (Formspree), och **Kopiera rapporten** lägger hela texten i urklipp så att du kan mejla den för hand. Inget arbete går förlorat.

Vanliga meddelanden och vad de betyder:

| Meddelande på skärmen | Orsak | Åtgärd |
|---|---|---|
| `You do not have permission to call MailApp.sendEmail` | Behörigheten att skicka mejl godkändes aldrig | Öppna Apps Script, klicka **Kör** på funktionen `doGet` och godkänn behörigheterna. Distribuera sedan en ny version. |
| `Skriptet är inte kopplat till något kalkylark` | Skriptet skapades fristående på script.google.com | Skapa skriptet inifrån arket via **Tillägg → Apps Script**, klistra in koden och distribuera på nytt |
| `Google-skriptet svarade med något oväntat` | Webbappen är inte publik | Kontrollera i **Distribuera → Hantera distributioner** att **Vem har åtkomst** står på **Alla** |
| `Fel nyckel` i adminvyn | Nyckeln i adminvyn stämmer inte med `ADMIN_KEY` i `Code.gs` | Tryck **Byt anslutning** i adminvyn och skriv in rätt nyckel |

Uppdaterar du `Code.gs` måste du alltid distribuera om: **Distribuera → Hantera distributioner → pennikonen → Version: Ny version → Distribuera**. Adressen ändras inte.

## Bra att veta

- **Mejlvolym:** endast slutrapporten mejlas (en per uppdrag). Utresan blir en rad i arket och syns direkt i adminvyn. Google Workspace tillåter 1 500 mejl per dag, så 30 uppdrag i månaden är inga problem — och Formspree-taket på 50 utskick per månad försvinner helt.
- **Avvikelseflödet:** varje saknad, skadad eller sliten sak blir en egen rad i fliken **Avvikelser**. När något är löst bockar ni i kolumnen **Åtgärdad** på raden, så försvinner den ur adminvyns lista över öppna avvikelser.
- **Uppdatera skriptet senare:** klistra in ny kod i Apps Script och välj **Distribuera → Hantera distributioner → Redigera → Ny version**. Adressen ändras inte.
- **Säkerhetsnivå:** webbappens adress är i praktiken publik (den ligger i `index.html`), så vem som helst som hittar den kan skriva rader till loggen — samma exponering som dagens Formspree-ID. Läsning kräver alltid admin-nyckeln.
