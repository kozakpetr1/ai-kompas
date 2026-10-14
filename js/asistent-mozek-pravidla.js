/* AI Kompas – asistent: MOZEK BEZ AI („pravidla“)
   Odpovídá jen z obsahu kompasu (js/data.js + pevné odpovědi na časté otázky).
   Rozpozná nástroj, účel (6 oblastí práce učitele) a téma dotazu, pamatuje si
   naposledy zmíněný nástroj, takže zvládne i „A jak s ním začít?“.
   Až bude AI, zůstane jako záloha – jádro na něj samo přepne, když AI není dostupná. */
(function () {
  /* ---------- pomocníci ---------- */
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  /* klíč musí stát na začátku slova („cena“ nenajde „převrácená“); mezera na konci klíče = celé slovo */
  function ma(t, klice) { const p = ' ' + t + ' '; for (let i = 0; i < klice.length; i++) if (p.indexOf(' ' + klice[i]) !== -1) return true; return false; }
  function pocet(t, klice) { const p = ' ' + t + ' '; return klice.filter(function (k) { return p.indexOf(' ' + k) !== -1; }).length; }
  function odkaz(n) { return '[' + n.nazev + '](nastroje/' + n.id + '.html)'; }
  function fakt(n, klic) { const f = n.fakta.find(function (x) { return x[0] === klic; }); return f ? f[1] : null; }
  function ucel(id) { return UCELY.find(function (u) { return u.id === id; }); }

  /* ---------- slovníky (bez diakritiky, stačí začátek slova) ---------- */
  const ALIASY = {
    gemini: ['gemini', 'gemin', 'gemy', 'gem '],
    copilot: ['copilot', 'kopilot', 'microsoft', 'teach', 'm365', 'office'],
    chatgpt: ['chatgpt', 'chat gpt', 'gpt', 'openai', 'cetgpt', 'chatgp'],
    claude: ['claude', 'klaud', 'anthropic'],
    sciobot: ['sciobot', 'scio bot', 'scio'],
    magicschool: ['magicschool', 'magic school', 'magicstudent', 'magic'],
    notebooklm: ['notebooklm', 'notebook lm', 'notebook'],
    perplexity: ['perplexity', 'perplex', 'perplexit'],
    canva: ['canva', 'kanva', 'magic studio'],
    edpuzzle: ['edpuzzle', 'ed puzzle', 'edpuzz']
  };
  const UCEL_KLICE = {
    priprava: ['priprav', 'hodin', 'plan ', 'planovan', 'cile', 'cil hodiny', 'tematick', 'svp', 'rvp', 'osnov'],
    hodnoceni: ['hodnot', 'hodnoc', 'zpetn', 'rubrik', 'oprav', 'znamk', 'test', 'kviz', 'zkous', 'pisemk', 'esej', 'slohov'],
    uceni: ['zak ', 'zaci ', 'zaky', 'zaku', 'zakum', 'studen', 'procvic', 'doucov', 'samostud', 'domaci', 'ucit se', 'opakov', 'diferenc'],
    tvorba: ['prezentac', 'obrazk', 'obraz', 'video', 'pracovni list', 'material', 'plakat', 'grafik', 'ilustrac', 'podcast', 'simulac', 'animac'],
    zdroje: ['zdroj', 'reser', 'citac', 'citov', 'vyhled', 'vyzkum', 'clan', 'fakta', 'aktualn', 'studi', 'odborn'],
    admin: ['mail', 'email', 'rodic', 'vysvedc', 'zapis', 'porad', 'adminis', 'dopis', 'tabulk', 'excel', 'komunikac', 'byrokrac']
  };
  const ASPEKT = {
    start: ['zacit', 'zacat', 'zacnu', 'zacinam', 'navod', 'jak na to', 'prvni krok', 'jak ho', 'jak ji', 'jak to', 'pouzivat', 'nastavit', 'prihlas'],
    pozor: ['pozor', 'rizik', 'nevyhod', 'omezen', 'problem', 'nebezpec', 'slabin'],
    cena: ['cena', 'cenu', 'zdarma', 'plac', 'stoji', 'kolik', 'licenc', 'predplat', 'free'],
    zaci: ['zak ', 'zaci ', 'zaky', 'zaku', 'zakum', 'student', 'vek ', 'veku', 'deti', 'nezletil', 'od kolika'],
    cestina: ['cestin', 'cesky', 'jazyk'],
    co: ['co je', 'co umi', 'k cemu', 'popis', 'predstav', 'o nem', 'o ni']
  };

  function najdiNastroje(t) {
    const nalez = [];
    Object.keys(ALIASY).forEach(function (id) {
      let pos = -1;
      ALIASY[id].forEach(function (a) { const p = (' ' + t + ' ').indexOf(a); if (p !== -1 && (pos === -1 || p < pos)) pos = p; });
      if (pos !== -1) nalez.push({ id: id, pos: pos });
    });
    // „microsoft“ i „notebook“ apod. nesmí přebít konkrétnější shodu
    if (nalez.some(function (x) { return x.id === 'notebooklm'; }) && t.indexOf('gemini') === -1) {
      for (let i = nalez.length - 1; i >= 0; i--) if (nalez[i].id === 'gemini') nalez.splice(i, 1);
    }
    if (nalez.some(function (x) { return x.id === 'canva'; }) && t.indexOf('magicschool') === -1 && t.indexOf('magic school') === -1) {
      for (let j = nalez.length - 1; j >= 0; j--) if (nalez[j].id === 'magicschool') nalez.splice(j, 1);
    }
    return nalez.sort(function (a, b) { return a.pos - b.pos; }).map(function (x) { return najdiNastroj(x.id); });
  }
  function najdiUcel(t) {
    let nej = null, skore = 0;
    Object.keys(UCEL_KLICE).forEach(function (id) {
      const s = pocet(t, UCEL_KLICE[id]);
      if (s > skore) { skore = s; nej = id; }
    });
    return nej;
  }
  function najdiAspekt(t) {
    const poradi = ['pozor', 'cena', 'zaci', 'cestina', 'start', 'co'];
    for (let i = 0; i < poradi.length; i++) if (ma(t, ASPEKT[poradi[i]])) return poradi[i];
    return null;
  }
  /* poslední nástroj zmíněný v konverzaci (pro navazující otázky) */
  function posledniNastroj(zpravy) {
    for (let i = zpravy.length - 2; i >= 0; i--) {
      const n = najdiNastroje(norm(zpravy[i].content));
      if (n.length) return n[0];
    }
    return null;
  }

  /* ---------- odpovědi ---------- */
  function prehled(n) {
    return {
      content: '**' + n.nazev + '** – ' + n.catNazev + '\n\n' + n.popis + '\n\n' +
        '- **Cena:** ' + (fakt(n, 'Cena') || '–') + '\n- **Žáci:** ' + (fakt(n, 'Žáci') || '–') + '\n\n' +
        'Nejčastější použití:\n' + n.pouziti.map(function (p) { return '- ' + p; }).join('\n') +
        '\n\nPodrobný průvodce: ' + odkaz(n),
      navrhy: ['Jak začít s ' + n.nazev + '?', 'Na co si dát pozor u ' + n.nazev + '?', n.nazev + ' na hodnocení']
    };
  }
  function aspekt(n, a) {
    if (a === 'start') return { content: '**Jak začít – ' + n.nazev + '**\n\n' + n.start.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\n\nVíc v průvodci: ' + odkaz(n), navrhy: ['Na co si dát pozor u ' + n.nazev + '?', 'Kolik stojí ' + n.nazev + '?'] };
    if (a === 'pozor') return { content: '**Na co si dát pozor – ' + n.nazev + '**\n\n' + n.pozor.map(function (s) { return '- ' + s; }).join('\n'), navrhy: ['Jak začít s ' + n.nazev + '?', 'Pravidla pro osobní údaje žáků'] };
    if (a === 'cena') return { content: '**' + n.nazev + ' – cena a přístup**\n\n- **Cena:** ' + (fakt(n, 'Cena') || 'neuvedeno') + '\n- **Přístup:** ' + (fakt(n, 'Přístup') || 'neuvedeno') + '\n\nCeníky se mění, aktuální stav ověřte na webu nástroje.', navrhy: ['Jak začít s ' + n.nazev + '?', 'Které nástroje jsou zdarma?'] };
    if (a === 'zaci') return { content: '**' + n.nazev + ' a žáci**\n\n' + (fakt(n, 'Žáci') || 'Kompas k tomu nemá údaj.') + '\n\nPravidla se týkají věku i souhlasu rodičů – u školního nasazení se vždy domluvte s vedením a správcem IT.', navrhy: ['Které nástroje můžou používat žáci?', 'Pravidla pro osobní údaje žáků'] };
    if (a === 'cestina') return { content: '**' + n.nazev + ' a čeština:** ' + (fakt(n, 'Čeština') || 'kompas k tomu nemá údaj.'), navrhy: [n.nazev + ' na přípravu hodiny'] };
    return prehled(n);
  }
  function nastrojNaUcel(n, uid) {
    const u = ucel(uid), polozky = n.mapa[uid] || [];
    if (!polozky.length) return { content: n.nazev + ' na oblast „' + u.nazev + '“ kompas nedoporučuje. Zkuste: ' + DOPORUCENI[uid].map(function (id) { return odkaz(najdiNastroj(id)); }).join(', ') + '.' };
    return {
      content: '**' + n.nazev + ' – ' + u.nazev.toLowerCase() + '**\n\n' + polozky.map(function (p) { return '- **' + p[0] + '** – ' + p[1]; }).join('\n') +
        '\n\nCelá myšlenková mapa: ' + odkaz(n),
      navrhy: ['Co dalšího se hodí na ' + u.nazev.toLowerCase() + '?', 'Jak začít s ' + n.nazev + '?']
    };
  }
  function doporuceni(uid) {
    const u = ucel(uid);
    return {
      content: '**' + u.nazev + '** – tyhle nástroje se podle kompasu hodí nejvíc:\n\n' +
        DOPORUCENI[uid].map(function (id) {
          const n = najdiNastroj(id), f = (n.mapa[uid] && n.mapa[uid][0]) || null;
          return '- ' + odkaz(n) + (f ? ' – **' + f[0] + ':** ' + f[1] : '');
        }).join('\n') + '\n\nNapište, který vás zajímá, a řeknu víc.',
      navrhy: DOPORUCENI[uid].slice(0, 2).map(function (id) { return 'Jak začít s ' + najdiNastroj(id).nazev + '?'; })
    };
  }
  function srovnani(a, b) {
    const radky = ['Cena', 'Žáci', 'Čeština', 'Přístup'].map(function (k) {
      return '- **' + k + ':** ' + a.nazev + ' – ' + (fakt(a, k) || '–') + ' · ' + b.nazev + ' – ' + (fakt(b, k) || '–');
    });
    return {
      content: '**' + a.nazev + ' vs. ' + b.nazev + '**\n\n- ' + a.nazev + ': ' + a.popis + '\n- ' + b.nazev + ': ' + b.popis + '\n\n' + radky.join('\n') +
        '\n\nPrůvodci: ' + odkaz(a) + ', ' + odkaz(b),
      navrhy: [a.nazev + ' na přípravu hodiny', b.nazev + ' na přípravu hodiny']
    };
  }

  const TEMATA = [
    { klice: ['gdpr', 'osobn', 'udaj', 'soukrom', 'bezpecn', 'ochran', 'jmen', 'data zak', 'citliv'],
      odp: { content: '**Osobní údaje a bezpečnost**\n\n- Jména, třídu, zdravotní ani rodinnou situaci konkrétního žáka do běžného chatbotu **nevkládejte**. Pište obecně – „žák 8. třídy s SPU“.\n- Používejte **školní účty** (Microsoft 365, Google Workspace) – mají ochranu dat, osobní účty ne.\n- Výstup vždy zkontrolujte, zvlášť čísla, data a citace.\n- Buďte transparentní: řekněte žákům, kde vám AI pomohla.\n\nVíc v sekci [Bezpečnost, GDPR a etika](#bezpecnost).', navrhy: ['Které nástroje mají školní účet?', 'Co jsou halucinace?'] } },
    { klice: ['halucin', 'vymysl', 'overit', 'overov', 'pravd', 'chyby', 'spolehliv'],
      odp: { content: '**Halucinace** jsou sebejistě znějící, ale vymyšlené informace – fakta, citace nebo zdroje, které neexistují. Model totiž nehledá v databázi, ale skládá pravděpodobný text slovo po slovu.\n\n- Fakta, jména a čísla vždy ověřte.\n- Na aktuální informace použijte nástroj s vyhledáváním – třeba [Perplexity](nastroje/perplexity.html).\n- Na práci s vlastními materiály se hodí [NotebookLM](nastroje/notebooklm.html) – cituje jen z nahraných zdrojů.\n\nVysvětlení v sekci [Jak AI funguje](#princip).', navrhy: ['Jak AI funguje?', 'Nástroje na práci se zdroji'] } },
    { klice: ['prompt', 'zadan', 'jak se ptat', 'jak psat', 'formulov', 'dotaz na ai'],
      odp: { content: '**Dobrý prompt je konkrétní.** Uveďte:\n\n1. **Roli a kontext** – „Jsi učitel fyziky na SPŠ…“\n2. **Úkol** – co přesně chcete (pracovní list, rubriku, 5 otázek…)\n3. **Cílovou skupinu** – ročník, úroveň, případné SVP\n4. **Formát a rozsah** – tabulka, odrážky, jedna strana A4\n5. **Omezení** – jazyk, co vynechat, styl\n\nPříklad: *„Připrav pracovní list na téma koloběh vody pro 1. ročník SOŠ: 4 otevřené otázky a jednu doplňovačku, jedna strana A4.“*\n\nUkázku najdete v sekci [V praxi](#praxe).', navrhy: ['Nástroje na přípravu hodiny', 'Co jsou halucinace?'] } },
    { klice: ['projekt', 'kraj', 'ambasador', 'praktik', 'kabinet', 'navrat do budoucnosti', 'spravedliv', 'memorand'],
      odp: function () {
        return { content: '**Projekt Ústeckého kraje – AI ve školách**\n\n' + PROJEKT.cisla.map(function (c) { return '- **' + c[0] + '** – ' + c[1]; }).join('\n') +
          '\n\nPodání žádosti je plánované na listopad 2026, realizace leden 2027 – červenec 2029. Konkrétní produkt licencí kraj zatím nezveřejnil.\n\nVíc v sekci [Projekt kraje](#projekt).', navrhy: ['Co dělá AI ambasador?', 'Které nástroje jsou zdarma?'] };
      } },
    { klice: ['jak funguje', 'jak ai funguje', 'token', 'neuron', 'jazykovy model', 'llm', 'trenov', 'uci model', 'vahy'],
      odp: { content: '**Jak AI funguje – ve zkratce**\n\nJazykový model je neuronová síť, která se na obrovském množství textů naučila odhadovat **další kousek textu (token)**. Odpověď skládá token po tokenu. Znalosti nemá uložené jako databázi – jsou rozprostřené ve **vahách** spojů sítě. Proto umí skvěle pracovat s jazykem, ale fakta si můžete splést – vzniká halucinace.\n\nInteraktivní ukázka tréninku je v sekci [Jak AI funguje](#princip).', navrhy: ['Co jsou halucinace?', 'Jak napsat dobrý prompt?'] } }
  ];

  function napoveda() {
    return {
      content: 'Jsem **asistent AI Kompasu**. Zatím pracuji **bez AI** – odpovídám z obsahu kompasu. Zkuste třeba:\n\n- „Co se hodí na **hodnocení** a zpětnou vazbu?“\n- „Co umí **NotebookLM**?“ a pak „A jak s ním začít?“\n- „Porovnej **Gemini a Copilot**“\n- „Můžou **žáci** používat Claude?“\n- „Jak napsat dobrý **prompt**?“, „Co s **osobními údaji** žáků?“',
      navrhy: ['Co se hodí na přípravu hodiny?', 'Porovnej Gemini a Copilot', 'Jak napsat dobrý prompt?']
    };
  }

  function zdarma() {
    const z = NASTROJE.filter(function (n) { return /zdarma|free/i.test(fakt(n, 'Cena') || ''); });
    return { content: '**Cena podle kompasu**\n\n' + z.map(function (n) { return '- ' + odkaz(n) + ' – ' + fakt(n, 'Cena'); }).join('\n') + '\n\nCeníky se mění – ověřte na webu nástroje.', navrhy: ['Které nástroje můžou používat žáci?'] };
  }
  function proZaky() {
    return { content: '**Nástroje a žáci** (podle údajů v kompasu)\n\n' + NASTROJE.map(function (n) { return '- ' + odkaz(n) + ' – ' + (fakt(n, 'Žáci') || '–'); }).join('\n') + '\n\nU nasazení se žáky se vždy domluvte s vedením a správcem IT.', navrhy: ['Pravidla pro osobní údaje žáků'] };
  }

  /* fulltext jako poslední záchrana: najde funkce nástrojů podle slov dotazu */
  function hledej(t) {
    const slova = t.split(' ').filter(function (w) { return w.length > 3; }).map(function (w) { return w.slice(0, 5); });
    if (!slova.length) return null;
    const vysledky = [];
    NASTROJE.forEach(function (n) {
      Object.keys(n.mapa).forEach(function (uid) {
        n.mapa[uid].forEach(function (p) {
          const txt = norm(p[0] + ' ' + p[1]);
          const s = slova.filter(function (w) { return txt.indexOf(w) !== -1; }).length;
          if (s) vysledky.push({ s: s, n: n, p: p });
        });
      });
    });
    if (!vysledky.length) return null;
    vysledky.sort(function (a, b) { return b.s - a.s; });
    return {
      content: 'Přímou odpověď nemám, ale v kompasu jsem našel tyto funkce, které by mohly souviset:\n\n' +
        vysledky.slice(0, 5).map(function (v) { return '- ' + odkaz(v.n) + ' – **' + v.p[0] + ':** ' + v.p[1]; }).join('\n'),
      navrhy: ['Co umíš?']
    };
  }

  function odpovez(zpravy) {
    const text = zpravy[zpravy.length - 1].content;
    const t = norm(text);
    const nastroje = najdiNastroje(t);
    const uid = najdiUcel(t);
    const a = najdiAspekt(t);

    if (/^(ahoj|dobry den|zdravim|cau|nazdar|hello|hi)\b/.test(t) && t.length < 25) return napoveda();
    if (ma(t, ['co umis', 'napoved', 'pomoc', 'help', 'co dokazes', 'jak funguje asistent'])) return napoveda();
    if (/^(dik|diky|dekuji|dekuju|super|ok|jasne)\b/.test(t) && t.length < 25) return { content: 'Rádo se stalo. Kdybyste potřebovali něco dalšího, ptejte se.', navrhy: ['Co se hodí na přípravu hodiny?'] };

    if (nastroje.length >= 2 && ma(t, ['porovn', 'rozdil', ' vs', 'versus', ' nebo ', 'lepsi', 'srovn'])) return srovnani(nastroje[0], nastroje[1]);

    // 1) nástroj zmíněný přímo v dotazu
    if (nastroje.length) {
      const n = nastroje[0];
      if (a && a !== 'co') return aspekt(n, a);
      if (uid) return nastrojNaUcel(n, uid);
      return prehled(n);
    }

    // 2) obecné otázky přes všechny nástroje a témata
    if (ma(t, ['zdarma', 'bezplat', 'free ']) && ma(t, ['ktere', 'ktery', 'co je', 'nastroj', 'jsou', 'neco'])) return zdarma();
    if (ma(t, ['zaci ', 'zaky', 'studenti']) && ma(t, ['ktere', 'ktery', 'nastroj', 'co mohou', 'co muzou'])) return proZaky();
    for (let i = 0; i < TEMATA.length; i++) {
      if (ma(t, TEMATA[i].klice)) { const o = TEMATA[i].odp; return typeof o === 'function' ? o() : o; }
    }

    // 3) navazující otázka k naposledy zmíněnému nástroji („A jak s ním začít?“, „Kolik to stojí?“)
    const kratka = t.split(' ').length <= 7;
    const zajmeno = ma(t, ['s nim', 's ni ', 'u nej', 'u ni ', 'ho ', 'ji ', 'to ', 'nim ', 'nej ', 'a co', 'a na']);
    if ((a && a !== 'co' && (kratka || zajmeno)) || (uid && zajmeno)) {
      const n = posledniNastroj(zpravy);
      if (n) {
        if (a && a !== 'co') return aspekt(n, a);
        if (uid) return nastrojNaUcel(n, uid);
      }
    }

    // 4) co potřebuji udělat → doporučené nástroje
    if (uid) return doporuceni(uid);

    return hledej(t) || {
      content: 'Tomu zatím nerozumím – pracuji bez AI a umím odpovídat jen na otázky k obsahu kompasu: nástroje, jejich použití, cena, žáci, bezpečnost, prompty a projekt kraje.',
      navrhy: ['Co umíš?', 'Co se hodí na přípravu hodiny?', 'Jak napsat dobrý prompt?']
    };
  }

  KompasAsistent.registrovat({
    id: 'pravidla',
    nazev: 'Bez AI – obsah kompasu',
    popis: 'Odpovídá jen z dat kompasu podle klíčových slov. Nic neposílá mimo prohlížeč, nic nestojí. Zůstává jako záloha, když AI není dostupná.',
    jeAI: false,
    nastaveni: [],
    dostupny: async function () { return true; },
    odpovez: async function (zpravy) {
      await new Promise(function (r) { setTimeout(r, 280); }); // krátká pauza, ať odpověď „nepřeblikne“
      return odpovez(zpravy);
    }
  });
})();
