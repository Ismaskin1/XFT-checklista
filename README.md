# XFT Utrustningschecklista

Mobilanpassad checklista för filmteamets utrustning. Hela appen ligger i en enda fil — `index.html` — och publiceras via GitHub Pages. Ingen server och inget konto behövs: allt sparas lokalt i webbläsaren tills rapporten har skickats.

## Flöde

1. **Utresa** — filmaren fyller i namn, kund och datum, bockar i utrustningen som tas med och låser utresan. Med Google-backenden inkopplad loggas utresan direkt i kalkylarket, så att teamet ser vad som är ute i fält redan innan uppdraget är klart.
2. **Hemresa** — filmaren bockar av det som har kommit tillbaka och besvarar BTS-frågan. Saker som inte bockas av rapporteras som saknade, och en bekräftelsedialog listar dem innan hemresan låses.
3. **Kontor** — den returnerade utrustningen kontrolleras (OK / Slitage / Skadad), BTS-materialet bekräftas uppladdat på Google Drive, och slutrapporten skickas till filmteamet@xft.se.

Låsta steg kan alltid låsas upp med **Ändra**-knappen om något blev fel, utan att ibockningarna försvinner.

## Som app på mobilen

Öppna sidan i Safari, tryck på delningsikonen och välj **Lägg till på hemskärmen**. Appen får då XFT-ikonen, öppnas i helskärm utan webbläsarens fält och startar även utan uppkoppling (rapporten skickas förstås först när nätet är tillbaka). Den som redan har en gammal genväg på hemskärmen tar bort den och lägger till en ny för att få ikonen och helskärmsläget — slutför ett pågående uppdrag först, eftersom den nya genvägen inte ser den gamla genvägens sparade data.

## Teknik

- **Lagring:** `localStorage` med nyckeln `xft_v2`. Ett pågående uppdrag ligger kvar även om sidan stängs eller laddas om, och rensas först när slutrapporten har skickats.
- **Utskick, två lägen:** styrs av `BACKEND_URL` i `index.html`.
  - *Google-läget* (rekommenderat, se [SETUP.md](SETUP.md)): utresa och slutrapport loggas i ett Google Sheet via Apps Script, slutrapporten mejlas till filmteamet@xft.se och adminvyn läser arket. Inga volymtak i praktiken.
  - *Formspree-läget* (`BACKEND_URL` tom): slutrapporten mejlas via Formspree (form-ID `xeedpwrz`) som tidigare. Ingen utresanmälan skickas — gratisplanens 50 utskick per månad behöver rymma slutrapporterna.
  - Ämnesraden får tillägget `AVVIKELSER` när något saknas eller är skadat, i båda lägena.
- **Adminvy:** `admin.html` (samma GitHub Pages-adress) visar vad som är ute i fält just nu, öppna avvikelser, status per pryl och senaste uppdrag. Kräver webbappens adress + admin-nyckeln, som anges en gång per webbläsare.
- **Design:** mörkt tema med grön accent `#35e375`.
- **Offline:** `sw.js` cachar appen så att den startar utan uppkoppling. Sidan hämtas alltid från nätet när det går, så uppdateringar på GitHub Pages slår igenom som vanligt.
- **Filer:** `index.html` (checklistan), `admin.html` (adminvyn), `apps-script/Code.gs` (Google-backenden), `SETUP.md` (installationsguide), `sw.js` (offlinestöd), `manifest.webmanifest` + ikonfiler (appikon och helskärmsläge).

## Ändra utrustningslistan

Utrustningen ligger i konstanten `EQUIPMENT` i `index.html`. Lägg till en rad med unikt `id`, `name`, eventuellt `serial` samt `group`. Visningsnamn med svenska tecken hanteras i `ITEM_NAMES` och `DISPLAY_NAMES`.
