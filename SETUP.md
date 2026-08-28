# Koppla checklistan till Google Sheet och adminvyn

Målbild: **checklista → Google Sheet (databas) → adminvy**. Checklistan loggar varje utresa och slutrapport i ett kalkylark, och adminvyn (`admin.html`) visar allt snyggt: vad som är ute i fält just nu, öppna avvikelser och status per pryl. Inga mejl skickas — loggen är systemets minne.

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
4. Klicka **Distribuera** och godkänn behörigheterna (skriptet behöver läsa och skriva i ditt ark).
5. Kopiera **webbappens adress** — den slutar på `/exec`.

## 4. Anslut adminvyn

1. Öppna `admin.html` på er GitHub Pages-adress (samma adress som checklistan, men med `/admin.html` på slutet).
2. Klistra in webbappens adress och admin-nyckeln. Uppgifterna sparas bara i den webbläsaren, så du och produktionschefen gör detta en gång var.

## 5. Koppla in checklistan

Adressen ligger i raden `const BACKEND_URL = '...'` i `index.html`. Byter du distribution eller flyttar arket måste den uppdateras, annars kommer inga rapporter fram. Byt antingen direkt på GitHub, eller skicka den nya adressen till Claude i Claude Code.

## 6. Testa

1. Gör ett testuppdrag i checklistan: lås en utresa, bekräfta hemresan, slutför på kontoret.
2. Kontrollera att raderna dyker upp i **Logg** (en Utresa-rad och en Rapport-rad) och att uppdraget syns i adminvyn.

## Om något inte fungerar

**Börja alltid med knappen "Testa anslutningen" i adminvyn.** Den kontrollerar de två saker som brukar fattas efter en utplacering — kopplingen till kalkylarket och skrivbehörigheten — och visar grönt eller rött för var och en. Den visar också vilken skriptversion som faktiskt är utplacerad, så att du ser om koden i Apps Script behöver uppdateras.

Checklistan visar dessutom Google-skriptets eget felmeddelande på skärmen när inlämningen misslyckas. Uppdraget ligger kvar på enheten tills det gått igenom, så filmaren kan försöka igen när uppkopplingen är tillbaka, eller trycka **Kopiera rapporten** och skicka texten manuellt. Inget arbete går förlorat.

Vanliga meddelanden och vad de betyder:

| Meddelande på skärmen | Orsak | Åtgärd |
|---|---|---|
| `Skriptet är inte kopplat till något kalkylark` | Skriptet skapades fristående på script.google.com | Skapa skriptet inifrån arket via **Tillägg → Apps Script**, klistra in koden och distribuera på nytt |
| `Google-skriptet svarade med något oväntat` | Webbappen är inte publik | Kontrollera i **Distribuera → Hantera distributioner** att **Vem har åtkomst** står på **Alla** |
| `Fel nyckel` i adminvyn | Nyckeln i adminvyn stämmer inte med `ADMIN_KEY` i `Code.gs` | Tryck **Byt anslutning** i adminvyn och skriv in rätt nyckel |

Uppdaterar du `Code.gs` måste du alltid distribuera om: **Distribuera → Hantera distributioner → pennikonen → Version: Ny version → Distribuera**. Adressen ändras inte.

## Bra att veta

- **Inga mejl:** systemet skickar inga mejl alls. Både utresan och slutrapporten blir rader i arket och syns direkt i adminvyn.
- **Avvikelseflödet:** varje saknad, skadad eller sliten sak blir en egen rad i fliken **Avvikelser**. När något är löst bockar ni i kolumnen **Åtgärdad** på raden, så försvinner den ur adminvyns lista över öppna avvikelser.
- **Uppdatera skriptet senare:** klistra in ny kod i Apps Script och välj **Distribuera → Hantera distributioner → Redigera → Ny version**. Adressen ändras inte.
- **Säkerhetsnivå:** webbappens adress är i praktiken publik (den ligger i `index.html`), så den som hittar adressen kan i teorin skriva rader till loggen. Anrop utan kund och datum avvisas. Läsning kräver alltid admin-nyckeln.
