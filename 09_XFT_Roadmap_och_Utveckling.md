# XFT Group AB — Roadmap och Utvecklingsområden

## Dokument 9 av 10

Detta dokument samlar identifierade förbättringsområden, pågående initiativ och den operativa roadmappen för XFT. Det är ett levande dokument — uppdateras löpande när saker löses eller prioriteringar skiftar.

---

## Senast uppdaterad

2026-05-29

## Ägare

Martin (COO) och Jakob (Operations Controller).  
Ledningsgruppen godkänner prioriteringsordning.

---

## 1. Systemutveckling

### 1.1 Internt CRM (Hög prioritet)

**Status:** Under aktiv utveckling  
**Mål:** Ersätta Pipedrive med ett skräddarsytt system för XFT:s säljprocess  
**Drivs av:** Jakob (projektansvarig), Martin (kravställare)

**Problem med nuläge (Pipedrive):**
- AM:s loggar inkonsekvent — svårt att hålla KPI-data tillförlitlig
- Systemet är inte anpassat för XFT:s specifika pipeline
- Rapporteringen kräver manuellt extrakt av Jakob

**Krav på nytt system:**
- Daglig loggning för AM (samtal, möten, affärer) — enkelt och snabbt
- Automatisk KPI-sammanställning → synlig för Leo och Jakob utan manuell extraktion
- Handoff-flöde: signerat avtal → brief skickad → produktionsstart bekräftad
- Notifieringar vid missade KPI-mål (t.ex. om AM inte har loggat på 24h)
- Mobilanpassat (AM:s är ute på möten)
- Integration med Google Kalender (filmdagar, onboardings)

**Teknikval:** Supabase (databas) + Lovable (frontend)  
**Nästa steg:** Jakob definierar fullständig kravspec — Martin godkänner  
**Tidslinje:** Mål Q3 2026 för MVP

---

### 1.2 Intranät / Kunskapsbase (Medium prioritet)

**Status:** Påbörjad — detta dokumentpaket (Dok 1–10) är grunden  
**Mål:** Alla processer, riktlinjer och rollbeskrivningar ska vara lättillgängliga för hela teamet

**Nuläge:** MD-filer i GitHub (ismaskin1/xft-checklista)  
**Problem:** Inte alla har tillgång till eller vana av GitHub  
**Nästa steg:** Besluta om presentationsform — options:
- Enkel intern webbsida (Notion, Confluence, eller custom Lovable-app)
- Google Sites (enkelt, redan i Workspace)
- Behåll MD i GitHub + ge alla access

**Ansvarig för beslut:** Martin + Jakob  
**Tidslinje:** Beslut Q2 2026, implementation Q3 2026

---

### 1.3 Lösenordshantering (Hög prioritet — säkerhetskritisk)

**Status:** Ej påbörjad  
**Problem:** Klartextlösenord för bolagets system finns lagrade i en Google Drive-fil — detta är en säkerhetsrisk.

**Åtgärdsplan:**
1. Jakob anskaffar lösenordshanterare (rekommendation: **1Password Teams** eller **Bitwarden Business**)
2. Alla lösenord migreras till lösenordshanteraren
3. Drive-filen med lösenord raderas
4. Alla exponerade lösenord uppdateras
5. Varje person ges tillgång via lösenordshanteraren — rollbaserade rättigheter

**Ansvarig:** Jakob (initierar), Antonio (godkänner kostnad)  
**Tidslinje:** Omedelbart — ska vara klart inom 2 veckor

---

## 2. Organisatorisk utveckling

### 2.1 Formalisera Petrus teamleadar-roll (Medium prioritet)

**Status:** Ej kommunicerat  
**Bakgrund:** Petrus agerar informellt som teamleader för Production-teamet (Kunta + eventuella konsulter), men rollen är inte formellt kommunicerad till Natalie.

**Åtgärd:**
- Jakob kommunicerar till Natalie att Petrus formellt är teamleader för kamerateamet
- Petrus får ett uppdaterat rollkort som reflekterar detta (Dok 4 redan uppdaterat)
- Natalie → Petrus → Kunta-hierarki kommuniceras tydligt

**Ansvarig:** Jakob initierar samtal med Natalie  
**Tidslinje:** Snarast, senast juni 2026

---

### 2.2 Kunta — kontraktssituation (Hög prioritet)

**Status:** Olöst — Jakob ska återkoppla  
**Bakgrund:** Kunta arbetar som konsult på XFT. Frågor är öppna kring:
- Konsultavtalets fortsättning
- Semesterersättning (huruvida den ingår eller inte)
- Hur länge relationen fortsätter

**Åtgärd:**
- Jakob bokar möte med Kunta och/eller Natalie
- Klargör kontraktsterm, ersättning och eventuell formalisering
- Antonio involveras vid behov (avtalsfrågor)

**Ansvarig:** Jakob  
**Tidslinje:** Senast juni 2026

---

### 2.3 Johannes — ny rollstruktur som Booker (Medium prioritet)

**Status:** Pågående  
**Bakgrund:** Johannes demoterades till Booker-roll efter 2 månader utan budget som AM. Den nya rollen är inte fullt definierad eller kommunicerad.

**Åtgärd:**
- Leo och Jakob definierar Booker-rollen tydligt: ansvar, KPI:er, syftet med rollen
- Kommunicera förväntningarna till Johannes
- Sätt en tydlig tidsram: när utvärderas nästa steg (tillbaka till AM eller annat)?

**Ansvarig:** Leo (rolldefinition), Jakob (kommunikation och uppföljning)  
**Tidslinje:** Senast juni 2026

---

### 2.4 Felix — prestationsuppföljning (Hög prioritet)

**Status:** Kritisk  
**Bakgrund:** Felix har tre månader i rad utan att uppnå säljbudget. Fortsatt utebliven prestanda är inte acceptabelt.

**Åtgärd:**
- Leo och Jakob genomför ett tydligt samtal med Felix: förväntningar, stöd, konsekvenser
- Konkret 30-dagars förbättringsplan med mätbara mål
- Tät uppföljning (Leo + Jakob) varje vecka
- Om mål inte uppnås inom 30 dagar → eskalering till Antonio

**Ansvarig:** Leo (primär), Jakob (stöd och dokumentation)  
**Tidslinje:** Omedelbart

---

### 2.5 William — rollklarifiering (Medium prioritet)

**Status:** Oklar roll  
**Bakgrund:** William ingår i teamet men hans roll är inte tydligt definierad i bolagskartan.

**Åtgärd:**
- Jakob och Martin klargör Williams roll, ansvar och KPI:er
- Uppdatera Dok 1 och Dok 4 med korrekt rollbeskrivning
- Kommunicera tydliga förväntningar till William

**Ansvarig:** Martin + Jakob  
**Tidslinje:** Juni 2026

---

### 2.6 Sales-CRM compliance (Hög prioritet)

**Status:** Pågående problem  
**Bakgrund:** AM:s loggar inkonsekvent i Pipedrive, vilket gör KPI-uppföljningen opålitlig.

**Åtgärd (kort sikt):**
- Leo sätter daglig loggning som icke-förhandlingsbar — kommuniceras tydligt på nästa sales-möte
- Jakob gör veckovis kontroll av Pipedrive-aktivitet per AM
- Brist på loggning tas upp i Leo + Jakob 1v1 och åtgärdas omedelbart

**Åtgärd (lång sikt):**
- Det nya CRM-systemet (se 1.1) designas för att göra loggning enklare och snabbare
- Minska friktionen → ökar compliance

**Ansvarig:** Leo (compliance), Jakob (uppföljning och kontroll)  
**Tidslinje:** Omedelbart (kortsiktig åtgärd), Q3 2026 (systemlösning)

---

### 2.7 Abel — integration och TL-track (Låg prioritet, men viktig)

**Status:** Ny i teamet  
**Bakgrund:** Abel (Abbe) är ny Senior AM med explicit mål att bli Team Leader innan provtidens slut. Han är 38 år och vana säljare.

**Åtgärd:**
- Tydliggör TL-trackens kriterier: vad krävs för att bli TL?
- Leo coachar Abel mot ledarrollen parallellt med säljarbetet
- Jakob håller extra tätt 1v1 under onboarding-perioden

**Ansvarig:** Leo (coaching), Jakob (onboarding och uppföljning)  
**Tidslinje:** Löpande under Q2–Q3 2026

---

## 3. Processförbättringar

### 3.1 Sales-rapportering (standardisering)

**Problem:** Daglig loggning sker i Google Sheets (temporärt) utan tydlig struktur.  
**Åtgärd:** Jakob standardiserar Sheet-mallen och kommunicerar exakt format → ersätts av nytt CRM.  
**Tidslinje:** Omedelbart (interim), Q3 2026 (permanent)

### 3.2 Handoff-kvalitet (brief-completeness)

**Problem:** Natalie och Martin rapporterar att briefs från AM:s ibland saknar information, vilket kräver kompletterande kommunikation.  
**Åtgärd:**
- Jakob gör briefmallar (Dok 2 innehåller dessa) obligatoriska — inget avtal avslutas utan komplett brief
- Natalie flaggar ofullständiga briefs till Leo direkt (inte bara till Jakob)
- Loggning: antal "kompletteringsförfrågningar per brief" mäts och rapporteras månadsvis

**Ansvarig:** Leo (AM-compliance), Jakob (mätning), Natalie/Martin (feedback)

### 3.3 Utrustningsinventering (Production)

**Problem:** Ingen formell veckoinventering av produktionsutrustning (sker informellt).  
**Åtgärd:** Petrus inför en fysisk checklistalista (Google Sheets eller papper) — fylls i varje måndag.  
**Ansvarig:** Petrus, Jakob skapar mallen  
**Tidslinje:** Omedelbart

### 3.4 Kvartalsvis råmaterialsrutin (standardisering)

**Problem:** Processen för kvartalsvisa råmaterialgenomgångar finns i Dok 3 men har inte körts systematiskt.  
**Åtgärd:** Jakob sätter ett återkommande Google Calendar-event (kvartalsvis) som påminnelse för Natalie.  
**Ansvarig:** Natalie (kör processen), Jakob (påminnelse och logg)  
**Tidslinje:** Nästa körning: september 2026

---

## 4. Verktygsförändringar

| Verktyg | Status | Beslut |
|---------|--------|--------|
| Pipedrive → Internt CRM | Pågående migration | Jakob driver, mål Q3 2026 |
| SEMrush | Ej beslutat | Edgar begärt, Jakob och Martin utvärderar |
| Lösenordshanterare | Omedelbar åtgärd | Jakob anskaffar, Antonio godkänner |
| Intranät/presentationsform | Under utvärdering | Beslut Q2 2026 |

---

## 5. Rekryterings-roadmap

| Roll | Status | Prioritet |
|------|--------|-----------|
| Ekonomiansvarig | Ska tillsättas (Antonio driver) | Hög — Antonio är flaskhals |
| Marketing Team Lead | Under utvärdering | Medium |
| Ytterligare AM | Beror på Felix/Johannes-situation | Medium |
| Filmare / redigerare (konsult) | Vid ökad produktionsvolym | Låg |

---

## 6. Uppföljning och revisionshistorik

| Datum | Uppdatering |
|-------|------------|
| 2026-05-29 | Dokumentet skapat — första versionen baserad på 1v1-data och bolagsgenomgång |

---

*Dokument 9 av 10. Ägs av Martin (COO) och Jakob (Operations Controller). Revideras månadsvis — eller omedelbart vid ny kritisk information. Ledningsgruppen godkänner prioriteringsförändringar.*
