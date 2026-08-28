# XFT Utrustningschecklista

Mobilanpassad checklista för filmteamets utrustning. Hela appen ligger i en enda fil — `index.html` — och publiceras via GitHub Pages. Allt sparas lokalt i webbläsaren tills rapporten är inlämnad, och loggas sedan i ett Google Sheet som adminvyn läser.

## Flöde

1. **Utresa** — filmaren fyller i namn, kund och datum, bockar i utrustningen som tas med och låser utresan. Utresan loggas direkt i kalkylarket, så att teamet ser vad som är ute i fält redan innan uppdraget är klart.
2. **Hemresa** — filmaren bockar av det som har kommit tillbaka och besvarar BTS-frågan. Saker som inte bockas av rapporteras som saknade, och en bekräftelsedialog listar dem innan hemresan låses.
3. **Kontor** — den returnerade utrustningen kontrolleras (OK / Slitage / Skadad), BTS-materialet bekräftas uppladdat på Google Drive, och rapporten lämnas in till utrustningsloggen.

Låsta steg kan alltid låsas upp med **Ändra**-knappen om något blev fel, utan att ibockningarna försvinner.

## Som app på mobilen

Öppna sidan i Safari, tryck på delningsikonen och välj **Lägg till på hemskärmen**. Appen får då XFT-ikonen, öppnas i helskärm utan webbläsarens fält och startar även utan uppkoppling (rapporten lämnas förstås in först när nätet är tillbaka). Den som redan har en gammal genväg på hemskärmen tar bort den och lägger till en ny för att få ikonen och helskärmsläget — slutför ett pågående uppdrag först, eftersom den nya genvägen inte ser den gamla genvägens sparade data.

## Teknik

- **Lagring:** `localStorage` med nyckeln `xft_v2`. Ett pågående uppdrag ligger kvar även om sidan stängs eller laddas om, och rensas först när rapporten är inlämnad.
- **Inlämning:** utresa och slutrapport skickas till ett Google Apps Script (`BACKEND_URL` i `index.html`) som skriver dem i ett Google Sheet. Se [SETUP.md](SETUP.md). Inga mejl skickas — loggen och adminvyn är hela systemet.
- **Adminvy:** `admin.html` (samma GitHub Pages-adress) har tre flikar: **Översikt** svarar på vad som är ute i fält och vad som behöver åtgärdas, **Utrustning** är uppslagsverket med sök och status per pryl, och **Historik** listar inlämnade uppdrag. Anslutning och självtest ligger bakom ••• uppe till höger. Kräver webbappens adress + admin-nyckeln, som anges en gång per webbläsare.
- **Design:** mörkt tema med grön accent `#35e375`. Checklistan och adminvyn delar formspråk — sektioner med hårfina linjer i stället för kort, en primär handling per vy, ark underifrån för korta uppgifter, och färg enbart för status.
- **Offline:** `sw.js` cachar appen så att den startar utan uppkoppling. Sidan hämtas alltid från nätet när det går, så uppdateringar på GitHub Pages slår igenom som vanligt.
- **Filer:** `index.html` (checklistan), `admin.html` (adminvyn), `apps-script/Code.gs` (Google-backenden), `SETUP.md` (installationsguide), `sw.js` (offlinestöd), `manifest.webmanifest` + ikonfiler (appikon och helskärmsläge).

## Ändra utrustningslistan

Utrustningen ligger i konstanten `EQUIPMENT` i `index.html`. Lägg till en rad med unikt `id`, `name`, eventuellt `serial` samt `group`. Visningsnamn med svenska tecken hanteras i `ITEM_NAMES` och `DISPLAY_NAMES`.
