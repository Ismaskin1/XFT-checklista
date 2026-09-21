# XFT Utrustningschecklista (flyttad)

Utrustningschecklistan ligger sedan 21 september 2026 i Filmchecklistan på
[checklista.xft.se](https://checklista.xft.se), kopplad till varje filmdag och
lagrad i Supabase. Koden finns i repot `xft-filmchecklista`.

Det som ligger kvar här är en omdirigering: `index.html` skickar filmteamet
till checklista.xft.se/filmare och `admin.html` skickar kontoret till
checklista.xft.se/utrustning. `sw.js` tar bort den gamla offlinekopian från
telefoner som haft appen på hemskärmen.

Google skriptet i `apps-script/Code.gs` och kalkylarket "XFT Utrustningslogg"
används inte längre. Historiken är importerad till det nya verktyget, och
arket ligger kvar som arkiv.
