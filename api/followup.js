'use strict';

// ─── Email templates ──────────────────────────────────────────────────────────

function buildEmail({ name, projectType, followupNumber, tier, ownerPhone, ownerName }) {
  const n  = name        || 'Kedves Érdeklődő';
  const pt = projectType || 'kertészeti projekt';
  const op = ownerPhone  || '+36 (30) 635 81 65';
  const on = ownerName   || 'Balázs';

  if (tier === 'vip') {
    if (followupNumber === 1) return {
      subject: 'Prioritásos konzultációs időpontot foglaltunk Önnek',
      text:
`Tisztelt ${n}!

Prioritásos konzultációs időpontot foglaltunk az Ön ${pt} projektjéhez. ${on} személyesen áttekintette az érdeklődését és várja, hogy megbeszéljék az elképzeléseit.

Kérem, vegye fel velünk a kapcsolatot a következő telefonszámon: ${op} (hétfő-péntek 8-16 óra között).

Üdvözlettel,
${on}
Lavotha Kert`,
    };

    if (followupNumber === 2) return {
      subject: 'Személyre szabott projektbecslés az Ön számára',
      text:
`Tisztelt ${n}!

Tudom, hogy egy nagyobb ${pt} projektet tervez. Szívesen megbeszélnénk a részleteket és nagyvonalú árbecslést adnánk, mielőtt személyesen találkozunk.

Kérem, hívjon minket a ${op} számon (hétfő-péntek 8-16 óra között), hogy egyeztessük a helyszíni felmérés időpontját.

Üdvözlettel,
${on}
Lavotha Kert`,
    };

    // VIP 5. nap
    return {
      subject: 'Szeretnék megkérdezni valamit',
      text:
`Tisztelt ${n}!

${on} vagyok a Lavotha Kerttől. Észrevettem, hogy még nem egyeztettünk a helyszíni felmérésről, és kíváncsi vagyok — van valami ami visszatartja? Határidő? Anyagi kérdés? Valami más?

Inkább tudnom kell, hogy közösen megtaláljuk a legjobb megoldást.

Közvetlen telefonszámom: ${op} (hétfő-péntek 8-16 óra között).

Üdvözlettel,
${on}
Lavotha Kert`,
    };
  }

  // ── Minősített lead ────────────────────────────────────────────────────────

  if (followupNumber === 1) return {
    subject: `Gyors kérdés a ${pt} projektjével kapcsolatban`,
    text:
`Tisztelt ${n}!

Épp az Ön ${pt} projektjére gondoltam. Volt már lehetősége átgondolni az időzítést?

Ügyfeleink többsége általában a foglalásuktól számított 2-3 héten belül látja az eredményt. Van esetleg kérdése, amiben segíthetek?

Elérhet minket a ${op} számon (hétfő-péntek 8-16 óra).

Üdvözlettel,
${on}
Lavotha Kert`,
  };

  if (followupNumber === 2) return {
    subject: 'Gondoltam, ezt látni szeretné',
    text:
`Tisztelt ${n}!

Épp befejeztem egy ${pt} projektet, ami nagyon emlékeztetett arra, amit Ön leírt.

Szeretné látni az eredményt? Válaszoljon erre az emailre és küldök néhány fotót. Hasonló elképzelése van?

Üdvözlettel,
${on}
Lavotha Kert`,
  };

  // Minősített 5. nap
  return {
    subject: 'Segíthetünk az időzítés tervezésében',
    text:
`Tisztelt ${n}!

Még nem döntötte el mikor valósítaná meg a ${pt} projektet? Szívesen segítünk a tervezésben.

Kérem, hívjon minket a ${op} számon (hétfő-péntek 8-16 óra között), hogy megbeszéljük a részleteket és egyeztessük a helyszíni felmérés időpontját.

Üdvözlettel,
${on}
Lavotha Kert`,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify shared secret — prevents random POSTs from triggering emails
  const body = req.body || {};
  if (!process.env.FOLLOWUP_SECRET || body.secret !== process.env.FOLLOWUP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, email, projectType, tier, followupNumber } = body;

  if (!email || !followupNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { subject, text } = buildEmail(body);

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Lavotha Kert <onboarding@resend.dev>',
        to:   [email],
        subject,
        text,
      }),
    });

    if (!resendRes.ok) throw new Error(`Resend ${resendRes.status}`);

    console.log(`Követő email #${followupNumber} (${tier}) elküldve → ${email}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Követő email küldési hiba:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
