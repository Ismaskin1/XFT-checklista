// XFT Utrustningslogg — Google Apps Script-backend
//
// Klistras in i ett Apps Script kopplat till ett Google Sheet (Tillägg → Apps Script)
// och distribueras som webbapp. Fullständig instruktion finns i SETUP.md i repot.
//
// Tar emot två händelser från checklistan:
//   type=utresa  → en rad i fliken "Logg" med status UTE (inget mejl)
//   type=rapport → en rad i "Logg", avvikelseraderna i fliken "Avvikelser",
//                  och slutrapporten mejlas till MAIL_TO
// Adminvyn (admin.html) hämtar allt via GET med nyckeln nedan.

const SKRIPT_VERSION = '3.5'; // syns i adminvyns självtest, så att du ser om rätt kod är utplacerad
const ADMIN_KEY = 'BYT-MIG-till-en-egen-lang-nyckel'; // hitta på en egen innan utplacering
const MAIL_TO = 'filmteamet@xft.se';
const TZ = 'Europe/Stockholm';

const LOGG_BLAD = 'Logg';
const AVVIK_BLAD = 'Avvikelser';
const LOGG_RUBRIKER = ['Tidpunkt', 'Typ', 'Uppdrag', 'Datum', 'Kund', 'Filmare', 'Status', 'Sammanfattning', 'Payload'];
const AVVIK_RUBRIKER = ['Tidpunkt', 'Datum', 'Kund', 'Filmare', 'Sak', 'Grupp', 'Serienummer', 'Typ', 'Kommentar', 'Åtgärdad'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (!SpreadsheetApp.getActiveSpreadsheet()) {
      return json({ ok: false, error: 'Skriptet är inte kopplat till något kalkylark. Skapa skriptet inifrån arket via Tillägg → Apps Script och distribuera på nytt.' });
    }
    const p = (e && e.parameter) || {};
    // Skyddar loggen mot tomma anrop: så uppstår en skräprad när doPost körs för hand
    // i Apps Script-editorn, eller om någon råkar anropa webbadressen utan data.
    if (!p.kund || !p.datum) {
      return json({ ok: false, error: 'Anropet saknade kund och datum, så ingen rad skrevs. Kör inte doPost för hand i editorn — checklistan skickar med uppgifterna själv.' });
    }
    const typ = p.type === 'utresa' ? 'Utresa' : 'Rapport';
    const tripId = String(p.tripId || '');
    const logg = hamtaBlad(LOGG_BLAD, LOGG_RUBRIKER);

    // Samma uppdrag och typ loggas bara en gång (skydd mot omförsök efter nätfel)
    if (tripId && finnsRad(logg, tripId, typ)) return json({ ok: true, dubblett: true });

    const payload = tolkaJson(p.payload);
    const nu = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
    let status, sammanfattning;

    if (typ === 'Utresa') {
      const antal = payload && payload.taken ? payload.taken.length : 0;
      status = 'UTE';
      sammanfattning = antal + ' saker medtagna';
    } else {
      const c = (payload && payload.counts) || {};
      const avvik = (Number(c.saknat) || 0) + (Number(c.slitage) || 0) + (Number(c.skadad) || 0) > 0;
      status = avvik ? 'AVVIKELSER' : 'KOMPLETT';
      sammanfattning = (c.returnerat || 0) + ' kontrollerade — ' + (c.ok || 0) + ' OK'
        + (c.slitage ? ', ' + c.slitage + ' slitage' : '')
        + (c.skadad ? ', ' + c.skadad + ' skadade' : '')
        + (c.saknat ? ', ' + c.saknat + ' saknade' : '');
      skrivAvvikelser(payload, p, nu);
    }

    // Loggen skrivs före mejlet: ett mejl som inte går iväg får aldrig kosta oss raden i arket.
    logg.appendRow([nu, typ, tripId, p.datum || '', p.kund || '', p.filmare || '', status, sammanfattning, p.payload || '']);

    let mailFel = '';
    if (typ === 'Rapport') {
      try {
        MailApp.sendEmail(MAIL_TO,
          p.subject || ('Utrustningsrapport - ' + (p.kund || '') + ' - ' + (p.datum || '')),
          p.rapport || '(tom rapport)');
      } catch (mfel) {
        mailFel = String(mfel);
      }
    }
    return json({ ok: true, mailError: mailFel });
  } catch (fel) {
    return json({ ok: false, error: String(fel) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (ADMIN_KEY.indexOf('BYT-MIG') === 0) return json({ ok: false, error: 'ADMIN_KEY är inte utbytt i Code.gs — sätt en egen nyckel först.' });
    if (String(p.key || '') !== ADMIN_KEY) return json({ ok: false, error: 'Fel nyckel.' });
    if (String(p.test || '') === '1') return json(sjalvtest());
    if (!SpreadsheetApp.getActiveSpreadsheet()) {
      return json({ ok: false, error: 'Skriptet är inte kopplat till något kalkylark. Skapa skriptet inifrån arket via Tillägg → Apps Script och distribuera på nytt.' });
    }

    const logg = lasRader(hamtaBlad(LOGG_BLAD, LOGG_RUBRIKER)).map(function(r) {
      return { tid: r[0], typ: r[1], uppdrag: r[2], datum: r[3], kund: r[4], filmare: r[5], status: r[6], sammanfattning: r[7], payload: tolkaJson(r[8]) };
    });
    const avvikelser = lasRader(hamtaBlad(AVVIK_BLAD, AVVIK_RUBRIKER)).map(function(r) {
      return { tid: r[0], datum: r[1], kund: r[2], filmare: r[3], sak: r[4], grupp: r[5], serienummer: r[6], typ: r[7], kommentar: r[8], atgardad: r[9] };
    });
    return json({ ok: true, logg: logg, avvikelser: avvikelser });
  } catch (fel) {
    return json({ ok: false, error: String(fel) });
  }
}

// En rad per saknad, skadad eller sliten sak — per-prylshistoriken teamet vill kunna slå upp.
// Kolumnen "Åtgärdad" bockas i manuellt i arket när saken är hanterad; adminvyn läser den.
function skrivAvvikelser(payload, p, nu) {
  if (!payload) return;
  const blad = hamtaBlad(AVVIK_BLAD, AVVIK_RUBRIKER);
  (payload.missing || []).forEach(function(sak) {
    blad.appendRow([nu, p.datum || '', p.kund || '', p.filmare || '', sak.name || '', sak.group || '', sak.serial || '', 'Saknad', '', '']);
  });
  (payload.damaged || []).forEach(function(sak) {
    const typ = sak.status === 'skadad' ? 'Skadad' : 'Slitage';
    blad.appendRow([nu, p.datum || '', p.kund || '', p.filmare || '', sak.name || '', sak.group || '', sak.serial || '', typ, sak.comment || '', '']);
  });
}

// Självtest som adminvyn anropar: kontrollerar de tre saker som kan fattas efter en
// utplacering — kopplingen till arket, skrivbehörigheten och mejlbehörigheten.
// Testraden skrivs och raderas direkt, så inget skräp blir kvar i loggen.
function sjalvtest() {
  const svar = { ok: true, sjalvtest: true, version: SKRIPT_VERSION, kalkylark: '', skrivning: '', mejl: '' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    svar.kalkylark = ss
      ? 'OK — kopplat till "' + ss.getName() + '"'
      : 'FEL — skriptet är inte kopplat till något kalkylark. Skapa det inifrån arket via Tillägg → Apps Script.';
  } catch (fel) {
    svar.kalkylark = 'FEL — ' + fel;
  }
  try {
    const blad = hamtaBlad(LOGG_BLAD, LOGG_RUBRIKER);
    blad.appendRow(['SJÄLVTEST', '', '', '', '', '', '', 'Testrad som raderas direkt', '']);
    SpreadsheetApp.flush();
    blad.deleteRow(blad.getLastRow());
    svar.skrivning = 'OK — skriptet kan skriva i arket';
  } catch (fel) {
    svar.skrivning = 'FEL — ' + fel;
  }
  try {
    svar.mejl = 'OK — ' + MailApp.getRemainingDailyQuota() + ' mejl kvar att skicka i dag';
  } catch (fel) {
    svar.mejl = 'FEL — behörigheten att skicka mejl saknas. Kör funktionen doGet i Apps Script och godkänn behörigheterna. (' + fel + ')';
  }
  return svar;
}

function hamtaBlad(namn, rubriker) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let blad = ss.getSheetByName(namn);
  if (!blad) {
    blad = ss.insertSheet(namn);
    blad.appendRow(rubriker);
    blad.getRange(1, 1, 1, rubriker.length).setFontWeight('bold');
    blad.setFrozenRows(1);
  }
  return blad;
}

function finnsRad(blad, tripId, typ) {
  const rader = lasRader(blad);
  for (let i = 0; i < rader.length; i++) {
    if (String(rader[i][2]) === tripId && String(rader[i][1]) === typ) return true;
  }
  return false;
}

function lasRader(blad) {
  const sista = blad.getLastRow();
  if (sista < 2) return [];
  return blad.getRange(2, 1, sista - 1, blad.getLastColumn()).getValues();
}

function tolkaJson(text) {
  try { return text ? JSON.parse(text) : null; } catch (e) { return null; }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
