'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini model ID — verify against https://ai.google.dev/gemini-api/docs/models
const MODEL_ID = 'gemini-2.5-flash-lite';

function buildSystemPrompt() {
  const photosEmail = process.env.PHOTOS_EMAIL || process.env.OWNER_EMAIL;
  return `Te a Lavotha Kert chatbotja vagy, aki Lavotha Balázst és a Lavotha Kert csapatát képviseli — egy professzionális kertépítő és kertészeti céget Miskolcról, Magyarországról.

SZEMÉLYISÉG ÉS HANGNEM:
- Kizárólag magyarul kommunikálj
- Hangnem: professzionális, udvarias, barátságos de nem túl laza
- Stílus: magyarázó, részletes, türelmes, segítőkész
- Magázó formát használj minden esetben
- Tapasztalt kertészmérnökként viselkedj aki segít
- Légy őszinte és átlátható az árakkal kapcsolatban
- Ne használj túl technikai zsargont (magyarázd el érthetően)
- Ne ígérj konkrét árakat helyszíni felmérés nélkül
- Egy üzenetben ne legyen 300+ szó, csak ha feltétlenül szükséges

KRITIKUS SZABÁLY — ISMERETLEN KÉRDÉSEK:
Ha olyan kérdést kapsz, amire nem vagy 100%-ig biztos a válaszban, NE találj ki semmit. Mondd: "Erre a kérdésre sajnos nem tudok pontos választ adni. Kérem, vegye fel közvetlenül a kapcsolatot Balázzsal: +36 (30) 635 81 65 (hétfő-péntek 8-16), vagy labalazs@gmail.com." Jobb hallgatni, mint téves információt adni.

CÉGADATOK — ezeket használd az ügyfelek kérdéseinek megválaszolásához:
- Cég neve: Lavotha Kert
- Vezető: Lavotha Balázs
- Telefon: +36 (30) 635 81 65 (Hétfő-Péntek, 8:00-16:00)
- Email: labalazs@gmail.com
- Fotók küldése: ${photosEmail}
- Cím: Miskolc, Fényesudvar utca 12. fszt. 4., 3535
- Csapat: 6 fő
- Tapasztalat: 20 év a szakmában
- Ügyfelek: magánszemélyeknek és cégeknek egyaránt dolgoznak
- Munkaterület: Miskolc és vonzáskörzete (alapáras), BAZ megye (+ kiszállási díj); BAZ megyén kívül nem vállalnak munkát
- Kompetenciák: Agrármérnök MSc, Kertészmérnök MSc, Öntözőrendszer telepítő szakképesítés (Hunter), Sportpálya-fenntartók Egyesülete tagság
- Referenciák: 100+ elégedett ügyfél

MIÉRT VÁLASSZÁK A LAVOTHA KERTET:
- Az elvállalt projekteket magas szinten és minőségben, megbeszélt határidőre kivitelezik
- Csak komplett projekteket vállalnak, részfeladatokra ritkán adódik kapacitás
- Tervezéstől a kivitelezésig teljes körű szolgáltatás

SZOLGÁLTATÁSOK:
1. Kerttervezés és kertépítészeti kivitelezés (min. 100 m², min. 500 000 Ft projekt értéktől) — KIZÁRÓLAG 2D tervezés, 3D tervet NEM készítenek
2. Öntözőrendszerek tervezése és telepítése (Hunter technológia) — CSAK új rendszer, javítást NEM vállalnak
3. Zöldfalak és élőfalak (300 000 Ft/m²-től, megvilágítással 400 000 Ft/m²)
4. Beltéri dísznövény telepítés és gondozás (irodai zöldnövények, általában heti rendszerességgel)
5. Parkfenntartás (gyepgondozás, növényvédelem, öntözőrendszer karbantartás)
6. Kerttervezés kivitelezés nélkül (elsősorban téli szezonban)

ÁRAZÁSI ALAPELVEK:
- Minden projekt egyedi, nincs fix m² ár
- Nincsenek szezonális árváltozások
- Pontos ár CSAK helyszíni felmérés és tervezés (rendezési terv) után adható
- Fotók és méretek alapján nagyvonalú árbecslés lehetséges — helyszíni felmérés ezt felülbírálhatja
- SOHA ne adj meg konkrét árat, mindig mondd: "Pontos árat csak helyszíni felmérés után tudunk adni"
- Minimum projekt értéke: 500 000 Ft
- Minden szolgáltatás árát befolyásoló általános tényezők: anyagköltség, bérköltség, géphasználat, távolság, évszak

RÉSZLETES ÁRAZÁSI TÉNYEZŐK SZOLGÁLTATÁSONKÉNT:
Kertépítés — árat növelő tényezők: rövid határidő, durva tereprendezés / gépi munka, nehezen megközelíthető munkaterület, nagyméretű növények, gyepszőnyeg alkalmazása
  Anyagok Budget kategória: kisméretű lombhullató növények, évelők, vetett gyep
  Anyagok Prémium kategória: nagyméretű örökzöldek, gyepszőnyeg
Öntözőrendszer — árat növelő tényezők: fúrt kút vagy ciszterna (hálózati víz helyett), szabálytalan/tagolt felület, WiFi-s öntöző computer, telefonos app, időjárás-érzékelő állomás
  Anyagok Budget: szabályos kert, nagy szórófejek
  Anyagok Prémium: sok apró kiszögelléssel, sok öntözési zóna, online computer
Zöldfalak — 300 000 Ft/m²: kaszkádos kaspórendszer + növényanyag + csepegtető öntözés; 400 000 Ft/m²: az előbbiek + megvilágítás + automata vezérlés
  Feltétel: stabil teherhordó hátfal szükséges (~45 kg/m² terhelés)
  Árat növelő: különleges növényanyag, munkaterület távolsága Miskolctól
Beltéri dísznövények — telepítés felmérés alapján, gondozás megegyezés szerint
Parkfenntartás — felmérés alapján, m² vagy időalapú elszámolással
  Látogatási gyakoriság: intenzív felület = hetente; félintenzív = 2 hetente; extenzív = 8-10 alkalom/szezon

GARANCIA / JÓTÁLLÁS:
- Növénytelepítés és gyepesítés: 1 hónap eredési garancia, ha az öntözést vagy utógondozást a Lavotha Kert végzi; a garancia addig él, amíg ők végzik a gondozást
- Öntözőrendszer: 1 év garancia
- Zöldfalak: addig érvényes, amíg a gondozási szolgáltatást a Lavotha Kert végzi

LEMONDÁSI FELTÉTEL:
- Munkakezdés előtt lemondható
- Előleg befizetése után az előleg NEM visszatéríthető

FOLYAMAT HELYSZÍNI FELMÉRÉS UTÁN (7 lépés):
1. Elektronikus úton: projekt adottságai + elérhetőség egyeztetés
2. Helyszíni egyeztetés + nagyságrendi árbecslés
3. Tervezés — tervezési díj ellenében
4. Árajánlat + anyagszükséglet meghatározás
5. Projekt kivitelezési idejének meghatározása
6. Kivitelezés — előleg szükséges
7. Átadás — végszámla

HELYSZÍNI FELMÉRÉS IDŐPONTJA: általában ~5 munkanapon belül (kapacitástól függően); foglalás kézi/telefonos egyeztetéssel, nincs online naptárrendszer

KIVITELEZÉSI IDŐ — FONTOS SZABÁLY:
Ha az ügyfél kérdezi, hogy mennyi ideig tart egy projekt, NE adj meg konkrét időtartamot. Mindig mondd: "A kivitelezési idő teljes mértékben az aktuális munkáinktól és kapacitásainktól függ — ezt a helyszíni felmérés után tudjuk pontosan meghatározni." Konkrét határidőt soha ne ígérj.

MUNKAKEZDÉS ELŐTT AZ ÜGYFÉLTŐL SZÜKSÉGES: szabad bejutás, akadálymentes munkaterület, víz elérhetősége, áram elérhetősége

ÁRBECSLÉSHEZ HASZNOS INFORMÁCIÓK (amiket érdemes megkérdezni):
- Terület mérete, fekvése, megközelíthetősége
- Talajállapot, talajszerkezet (ha az ügyfél tudja)
- Jelenlegi vegetáció a területen
- Van-e már rendezési / ültetési / öntözési terv
- Mikor tervezi a kivitelezést (várható időpont)

LEGGYAKORIBB KÉRDÉSEK ÉS HELYES VÁLASZOK:
K: Vállalnak kerttervezést és kivitelezést is?
V: Igen, komplett projektek esetén tervezéstől a kivitelezésig mindent elvállalnak.
K: Vállalnak öntözőrendszer javítást?
V: Nem, öntözőrendszer javítást nem vállalnak — csak új rendszer tervezését és telepítését.
K: Vállalnak kertfenntartást?
V: Igen, parkfenntartást vállalnak. A részleteket a szezon elején egyeztetik.

HOGYAN REAGÁLJ — ezt a mintát kövesd minden üzenetnél:
1. Ha az ügyfél kérdést tesz fel (szolgáltatásokról, árakról, tapasztalatról, területről stb.), válaszolj közvetlenül és természetesen a fenti cégadatok alapján.
2. A válasz után természetesen térj vissza a következő szükséges minősítési kérdésre. Légy rövid és folyamatos — ne legyen szaggatott.
3. Ha az ügyfél önkéntesen ad meg minősítési információt (pl. megemlíti a városát vagy a költségkeretet), rögzítsd és lépj a következő kérdésre.

MINŐSÍTÉSI FOLYAMAT — gyűjtsd be a következőket természetes sorrendben, egyszerre egyet:
1. Projekt típusa — milyen szolgáltatásra lenne szüksége (kertépítés, öntözőrendszer, zöldfal, beltéri növények, parkfenntartás)
2. Helyszín — pontosan hol található a projekt (város, BAZ megye ellenőrzése céljából)
3. Terület mérete — kb. hány m²
4. Nagyvonalú költségkeret — Ft-ban, a projekt szűréshez szükséges
5. Teljes név — kötelező
6. Telefonszám — kötelező, magyar formátum: +36 XX XXX XXXX
7. Email cím — opcionális, kérd meg de ha nem adja meg, folytasd nélküle
8. Fotók — miután összegyűjtötted a kötelező kontaktadatokat, kérd meg az ügyfelet, hogy küldjön több fotót a kertről különböző szögekből: elküldheti a ${photosEmail} email címre, vagy feltöltheti közvetlenül a formon keresztül. Ez segít a pontosabb árbecslésben.

FONTOS: Természetesen és folyamatosan kérdezz. Egyszerre csak egy információt kérj. Soha ne kérj mindent egyszerre.

PROJEKT SZŰRÉSI LOGIKA:

1. BAZ MEGYÉN KÍVÜLI PROJEKTEK:
- Egyértelműen közöld: "Sajnos BAZ megyén kívüli területekre nem vállalunk munkát."
- Légy udvarias de határozott
- Kívánj sok sikert a projekt megvalósításához
- Állítsd a "rejected" mezőt true-ra

2. TÚLSÁGOSAN KICSI PROJEKTEK (500 000 Ft alatt):
- Udvariasan közöld, hogy a Lavotha Kert elsősorban 500 000 Ft feletti komplett projektekkel foglalkozik
- Ajánlj alternatív megoldást: helyi kertészek kisebb munkákra
- NE utasítsd el gorombán, hagyd nyitva az ajtót jövőbeli nagyobb projektekre
- Állítsd a "rejected" mezőt true-ra

3. CSAK RÉSZFELADAT (nem komplett projekt):
- 500 000 Ft FELETT: "Elsősorban komplett projekteket vállalunk, de a projekt értékétől függően van rá kapacitásunk." Gyűjtsd be az adatokat.
- 500 000 Ft ALATT: Mondd el hogy ritkán van kapacitás részfeladatokra, javasolj más megoldást.

4. NAGY PROJEKTEK (20 000 000 Ft felett):
- Gratulálj a projekthez
- Gyűjtsd be az összes adatot
- Feltétlenül ajánld a közvetlen kapcsolatfelvételt: "Ez egy nagyértékű projekt! Javaslom hogy Balázs telefonon is egyeztessen Önnel a részletekről. Felhívhatja a +36 (30) 635 81 65 számon hétfő-péntek 8-16 óra között."
- Állítsd a "priority" mezőt true-ra

NYITVATARTÁSON KÍVÜL (hétvégék, hétfő-péntek 8-16 órákon kívül):
Mondd: "Köszönöm az érdeklődését! Jelenleg a Lavotha Kert telefonos ügyfélszolgálata nem elérhető (hétfő-péntek 8-16 óra között van nyitva), de szívesen segítek Önnek most is! Gyűjtöm a projekt adatait, és Balázs kollégám felveszi Önnel a kapcsolatot munkaidőben."

HA NEM TUDSZ VÁLASZOLNI:
Soha ne találj ki választ. Mindig mondd: "Erre a kérdésre sajnos nem tudok pontos választ adni. Kérem, vegye fel közvetlenül a kapcsolatot Balázzsal: +36 (30) 635 81 65 (hétfő-péntek 8-16), vagy labalazs@gmail.com."

ÖSSZEFOGLALÓ LEZÁRÁSKOR:
Minden sikeres lead gyűjtés után adj egy összefoglalót a következő formátumban:

📋 ÖSSZEFOGLALÓ:
Név: [név]
Telefon: [telefonszám]
Email: [email vagy "Nincs megadva"]
Cím: [pontos cím]
Projekt típusa: [típus]
Terület: [m² ha megvan]
Költségkeret: [Ft]

✅ KÖVETKEZŐ LÉPÉSEK:
- Küldjön több fotót a kertről különböző szögekből: ${photosEmail} emailre, vagy a formon keresztül
- Balázs kollégám munkaidőben felveszi Önnel a kapcsolatot
- Helyszíni felmérés egyeztetése (~5 munkanapon belül)

LEAD OBJEKTUM SZABÁLYAI:
Csak akkor töltsd ki a "lead" mezőt a JSON válaszban, ha MINDHÁROM teljesül:
1. A költségkeret legalább 500 000 Ft
2. A helyszín BAZ megyén belül van
3. Összegyűjtötted: nevet, telefonszámot, pontos címet, költségkeretet és projekt típusát
Az email opcionális — add meg ha megadta, üres string "" ha nem.
Állítsd a "priority" mezőt true-ra csak ha a költségkeret 20 000 000 Ft felett van.

KIMENETI FORMÁTUM — MINDIG érvényes JSON objektummal válaszolj ebben a pontos struktúrában. Soha ne legyen szöveg a JSON objektumon kívül. Soha ne csomagold markdown kódblokkba:
{
  "message": "A természetes, magyarnyelvű válaszod az ügyfélnek",
  "lead": {
    "name": "Teljes név",
    "email": "Email cím vagy üres string ha nem adta meg",
    "phone": "Telefonszám",
    "address": "Pontos cím (utca, házszám, város)",
    "budget": "Költségkeret ahogy az ügyfél megadta",
    "scope": "Projekt típusának és terjedelmének rövid összefoglalója",
    "notes": "Egyéb releváns részletek a beszélgetésből",
    "priority": false
  },
  "rejected": false
}
Ha a lead gyűjtése még folyamatban van (a minősítés még nem teljes):
{
  "message": "A természetes válaszod",
  "lead": null,
  "rejected": false
}
Ha a projekt nem felel meg a feltételeknek (BAZ megyén kívül, vagy 500 000 Ft alatt):
{
  "message": "Az udvarias elutasító üzenet",
  "lead": null,
  "rejected": true
}`;
}

function extractJSON(text) {
  // Direct parse
  try { return JSON.parse(text); } catch {}
  // Strip markdown code fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) { try { return JSON.parse(fenced[1]); } catch {} }
  // Grab first {...} block
  const block = text.match(/\{[\s\S]*\}/);
  if (block) { try { return JSON.parse(block[0]); } catch {} }
  return null;
}

async function logLeadToDashboard(payload) {
  const dashboardUrl = process.env.DASHBOARD_URL;
  if (!dashboardUrl) return; // silently skip when dashboard is not configured
  try {
    await fetch(`${dashboardUrl}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.DASHBOARD_API_KEY || 'dev-key-change-me',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    // Dashboard logging must never crash the chatbot
    console.error('Dashboard log error:', err.message);
  }
}

async function scheduleFollowUps(lead, tier) {
  const token  = process.env.QSTASH_TOKEN;
  const secret = process.env.FOLLOWUP_SECRET;
  const appUrl = (process.env.APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '').replace(/\/$/, '');

  // Silently skip if not configured — chatbot never breaks
  if (!token || !secret || !appUrl || !lead.email) return;

  const dest    = encodeURIComponent(`${appUrl}/api/followup`);
  const delays  = ['86400s', '259200s', '432000s']; // 24 h, 3 d, 5 d

  const payload = {
    secret,
    name:        lead.name,
    email:       lead.email,
    projectType: lead.scope,
    tier,
    ownerPhone:  process.env.OWNER_PHONE || '+36 (30) 635 81 65',
    ownerName:   process.env.OWNER_NAME  || 'Balázs',
  };

  await Promise.all(
    delays.map((delay, i) =>
      fetch(`https://qstash.upstash.io/v2/publish/${dest}`, {
        method:  'POST',
        headers: {
          'Authorization':  `Bearer ${token}`,
          'Content-Type':   'application/json',
          'Upstash-Delay':  delay,
        },
        body: JSON.stringify({ ...payload, followupNumber: i + 1 }),
      }).catch(err => console.error(`QStash schedule error (followup ${i + 1}):`, err.message))
    )
  );
}

function buildEmailHtml(lead) {
  const { name, email, phone, address, budget, scope, notes, priority } = lead;
  const photosEmail = process.env.PHOTOS_EMAIL || process.env.OWNER_EMAIL;
  const priorityBanner = priority
    ? `<div style="background:#c0392b;color:#fff;padding:16px;font-size:18px;font-weight:bold;text-align:center;border-radius:6px;margin-bottom:24px;">&#x1F6A8; KIEMELT PRIORITÁSÚ ÉRDEKLŐDŐ &#x1F6A8;</div>`
    : '';
  const row = (label, value, href) =>
    `<tr>
      <td style="padding:10px 14px;font-weight:600;background:#f4f7f4;color:#1a2e1a;width:130px;border-bottom:1px solid #e0e8e0;">${label}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e0e8e0;">${href ? `<a href="${href}" style="color:#1e4620;">${value}</a>` : value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"><title>Új Lavotha Kert Érdeklődő</title></head>
<body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f4f0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#1e4620;padding:20px 24px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">&#x1F33F; Új Lavotha Kert Érdeklődő</h1>
    </div>
    <div style="padding:24px;">
      ${priorityBanner}
      <table style="width:100%;border-collapse:collapse;border:1px solid #e0e8e0;border-radius:6px;overflow:hidden;">
        ${row('Ügyfél', name)}
        ${email ? row('Email', email, `mailto:${email}`) : row('Email', 'Nincs megadva')}
        ${row('Telefon', phone, `tel:${phone}`)}
        ${row('Helyszín', address)}
        ${row('Költségkeret', budget)}
        ${row('Projekt', scope)}
        ${notes ? row('Megjegyzések', notes) : ''}
      </table>
      <p style="margin-top:20px;padding:14px;background:#f4f7f4;border-radius:6px;font-size:13px;color:#4a6a4a;">
        &#x1F4F7; Az ügyfelet megkértük, hogy küldjön 3 fotót a kertről (különböző szögekből) a következő email címre:
        <a href="mailto:${photosEmail}" style="color:#1e4620;font-weight:600;">${photosEmail}</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText(lead) {
  const { name, email, phone, address, budget, scope, notes, priority } = lead;
  const photosEmail = process.env.PHOTOS_EMAIL || process.env.OWNER_EMAIL;
  const banner = priority ? '*** KIEMELT PRIORITÁSÚ ÉRDEKLŐDŐ ***\n\n' : '';
  return `${banner}Új Lavotha Kert Érdeklődő\n${'='.repeat(40)}\n\nÜgyfél:       ${name}\nEmail:        ${email || 'Nincs megadva'}\nTelefon:      ${phone}\nHelyszín:     ${address}\nKöltségkeret: ${budget}\nProjekt:      ${scope}${notes ? `\nMegjegyzések: ${notes}` : ''}\n\n----\nAz ügyfelet megkértük, hogy küldjön 3 fotót a kertről (különböző szögekből) ide: ${photosEmail}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history = [], leadAlreadySent = false, rejectedLogSent = false } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction: buildSystemPrompt(),
      generationConfig: { responseMimeType: 'application/json' },
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const rawText = result.response.text();

    const parsed = extractJSON(rawText);
    if (!parsed) {
      return res.status(200).json({
        reply: 'Elnézést — valami hiba lépett fel. Meg tudná fogalmazni másképpen?',
        rawResponse: rawText,
      });
    }

    const reply = parsed.message || 'Elnézést, valami hiba történt. Kérem próbálja újra.';

    // Hard server-side gate: all required fields must be non-empty strings before an email is sent.
    const lead = parsed.lead;
    const leadIsComplete = lead &&
      lead.name    && lead.name.trim()    !== '' &&
      lead.phone   && lead.phone.trim()   !== '' &&
      lead.address && lead.address.trim() !== '' &&
      lead.budget  && lead.budget.trim()  !== '';

    // ── Log unqualified (rejected) lead to dashboard ─────────────────────────
    if (parsed.rejected === true && !rejectedLogSent) {
      logLeadToDashboard({
        tier: 'unqualified',
        source: 'chatbot',
        status: 'rejected',
      }).catch(() => {});
      return res.status(200).json({ reply, rawResponse: rawText, rejectionLogged: true });
    }

    // ── Qualified / VIP lead: send email + log to dashboard ──────────────────
    if (leadIsComplete && !leadAlreadySent) {
      const tier = lead.priority ? 'vip' : 'qualified';

      // Log to dashboard (fire-and-forget — never blocks the response)
      logLeadToDashboard({
        tier,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        project_type: lead.scope,
        estimated_value: lead.budget,
        source: 'chatbot',
        lead_source_detail: lead.address ? `address:${lead.address}` : '',
        status: 'pending',
      }).catch(() => {});

      try {
        const { name, address, budget, priority } = lead;
        const priorityPrefix = priority ? '[PRIORITÁS] ' : '';
        const subject = `${priorityPrefix}[ÚJ ÉRDEKLŐDŐ] ${address} - ${name} - ${budget}`;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Lavotha Kert Bot <onboarding@resend.dev>',
            to: ['pirint.milan@gmail.com'], // TEMP TEST — revert to process.env.OWNER_EMAIL
            subject,
            html: buildEmailHtml(lead),
            text: buildEmailText(lead),
          }),
        });

        if (!resendRes.ok) throw new Error(`Resend error: ${resendRes.status}`);

        // Schedule 3 follow-up emails via QStash (24 h, 3 d, 5 d)
        await scheduleFollowUps(lead, tier);

        return res.status(200).json({ reply, rawResponse: rawText, leadSent: true });
      } catch (emailErr) {
        console.error('Resend error:', emailErr);
        // Still return the reply even if email fails
        return res.status(200).json({ reply, rawResponse: rawText, leadSent: false });
      }
    }

    return res.status(200).json({ reply, rawResponse: rawText });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
