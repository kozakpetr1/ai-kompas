/* AI Kompas – asistent: JÁDRO
   --------------------------------------------------------------------------
   Jádro neví, kdo odpovídá. Drží konverzaci a předává ji vybranému „mozku“
   (adaptéru). Mozek bez AI i budoucí AI mozky mají stejné rozhraní, takže
   napojení AI = přidat/zvolit jiný mozek, UI ani zbytek webu se nemění.

   ROZHRANÍ MOZKU (adaptéru):
   {
     id:        'pravidla',                  // jedinečný identifikátor
     nazev:     'Bez AI (obsah kompasu)',    // zobrazí se v UI
     popis:     'krátký popis pro nastavení',
     jeAI:      false,                       // true = generativní model
     nastaveni: [ {klic, nazev, typ, napoveda} ],   // volitelné pole pro UI
     dostupny:  async (nastaveni) => true | 'důvod, proč ne',
     odpovez:   async (zpravy, kontext) => Odpoved
   }

   zpravy  = [{ role: 'user' | 'assistant', content: '...' }, ...]
             (stejný formát, jaký přijímají API OpenAI, Azure OpenAI,
              Gemini – OpenAI-compatible, Ollama, …)
   kontext = { instrukce, nastaveni, znalosti, signal }
             instrukce = systémový prompt (editovatelný v UI)
             znalosti  = kompaktní text z data.js pro AI mozky
             signal    = AbortSignal pro zrušení dotazu
   Odpoved = { content: 'text s lehkým markdownem',
               navrhy?: ['navazující dotaz', ...] }
   -------------------------------------------------------------------------- */
(function () {
  const KLIC = 'ai-kompas-asistent-v1';

  const VYCHOZI_INSTRUKCE =
    'Jsi Asistent AI Kompasu – pomocník učitelů střední školy (VOŠ, SPŠ a SOŠ Varnsdorf) ' +
    'při výběru a používání AI nástrojů ve výuce. Odpovídej česky, stručně a prakticky. ' +
    'Vycházej především z poskytnutých znalostí kompasu; když něco nevíš jistě, řekni to ' +
    'a doporuč ověření u zdroje. Nikdy nežádej osobní údaje žáků a upozorni, pokud je ' +
    'uživatel do dotazu vloží.';

  function nacti() {
    try { return JSON.parse(localStorage.getItem(KLIC)) || {}; } catch (e) { return {}; }
  }
  function uloz(stav) {
    try { localStorage.setItem(KLIC, JSON.stringify(stav)); } catch (e) { /* bez úložiště to jde taky */ }
  }

  const mozky = {};
  const ulozene = nacti();
  const stav = {
    mozek: ulozene.mozek || 'pravidla',
    instrukce: ulozene.instrukce || VYCHOZI_INSTRUKCE,
    nastaveni: ulozene.nastaveni || {},      // { idMozku: { klic: hodnota } }
    zpravy: []                               // konverzace se neukládá (soukromí)
  };
  const posluchaci = [];
  let probihajici = null;

  function persist() {
    uloz({ mozek: stav.mozek, instrukce: stav.instrukce, nastaveni: stav.nastaveni });
  }
  function oznam(udalost, data) {
    posluchaci.forEach(function (fn) { try { fn(udalost, data); } catch (e) { console.error(e); } });
  }

  /* Kompaktní znalosti z data.js – pro AI mozky jako součást systémového promptu. */
  function znalosti() {
    if (typeof NASTROJE === 'undefined') return '';
    const r = ['NÁSTROJE V KOMPASU:'];
    NASTROJE.forEach(function (n) {
      r.push('- ' + n.nazev + ' (' + n.catNazev + '): ' + n.popis +
        ' Fakta: ' + n.fakta.map(function (f) { return f[0] + ': ' + f[1]; }).join('; ') + '.' +
        ' Stránka: nastroje/' + n.id + '.html');
    });
    if (typeof UCELY !== 'undefined' && typeof DOPORUCENI !== 'undefined') {
      r.push('DOPORUČENÍ PODLE ÚČELU:');
      UCELY.forEach(function (u) {
        r.push('- ' + u.nazev + ': ' + DOPORUCENI[u.id].map(function (id) { return najdiNastroj(id).nazev; }).join(', '));
      });
    }
    return r.join('\n');
  }

  window.KompasAsistent = {
    VYCHOZI_INSTRUKCE: VYCHOZI_INSTRUKCE,

    registrovat: function (mozek) { mozky[mozek.id] = mozek; oznam('mozky'); },
    seznamMozku: function () { return Object.keys(mozky).map(function (k) { return mozky[k]; }); },
    aktivniMozek: function () { return mozky[stav.mozek] || mozky.pravidla; },
    zvolMozek: function (id) { if (mozky[id]) { stav.mozek = id; persist(); oznam('mozek', id); } },

    instrukce: function () { return stav.instrukce; },
    nastavInstrukce: function (t) { stav.instrukce = (t || '').trim() || VYCHOZI_INSTRUKCE; persist(); },

    nastaveniMozku: function (id) { return Object.assign({}, stav.nastaveni[id] || {}); },
    ulozNastaveniMozku: function (id, hodnoty) { stav.nastaveni[id] = hodnoty; persist(); oznam('mozek', stav.mozek); },

    zpravy: function () { return stav.zpravy.slice(); },
    vymaz: function () { if (probihajici) probihajici.abort(); stav.zpravy = []; oznam('vymazano'); },
    naslouchej: function (fn) { posluchaci.push(fn); },

    /* Hlavní vstup: odeslání dotazu uživatele. Vrací Odpoved. */
    odeslat: async function (text) {
      text = (text || '').trim();
      if (!text) return null;
      if (probihajici) probihajici.abort();
      stav.zpravy.push({ role: 'user', content: text });
      oznam('zprava', stav.zpravy[stav.zpravy.length - 1]);

      let mozek = this.aktivniMozek();
      const ctrl = new AbortController();
      probihajici = ctrl;
      oznam('premysli', mozek);
      let odpoved;
      try {
        const ok = await mozek.dostupny(this.nastaveniMozku(mozek.id));
        if (ok !== true) {
          // záloha: když AI mozek není k dispozici, odpoví mozek bez AI
          const duvod = ok;
          mozek = mozky.pravidla;
          odpoved = await mozek.odpovez(stav.zpravy.slice(), this._kontext(mozek, ctrl));
          odpoved.poznamka = 'AI mozek není dostupný (' + duvod + '), odpověď je z obsahu kompasu.';
        } else {
          odpoved = await mozek.odpovez(stav.zpravy.slice(), this._kontext(mozek, ctrl));
        }
      } catch (e) {
        if (e && e.name === 'AbortError') return null;
        console.error(e);
        const zprava = (e && e.message) ? e.message : String(e);
        if (mozek.jeAI && mozky.pravidla) {
          // AI selhala (síť, klíč, server) → odpoví mozek bez AI, chyba se ukáže jako poznámka
          mozek = mozky.pravidla;
          odpoved = await mozek.odpovez(stav.zpravy.slice(), this._kontext(mozek, ctrl));
          odpoved.poznamka = 'AI neodpověděla (' + zprava + '), odpověď je z obsahu kompasu.';
        } else {
          odpoved = { content: 'Omlouvám se, při zpracování dotazu nastala chyba: ' + zprava, chyba: true };
        }
      } finally {
        if (probihajici === ctrl) probihajici = null;
      }
      odpoved.mozek = mozek.id;
      stav.zpravy.push({ role: 'assistant', content: odpoved.content });
      oznam('odpoved', odpoved);
      return odpoved;
    },

    _kontext: function (mozek, ctrl) {
      return { instrukce: stav.instrukce, nastaveni: this.nastaveniMozku(mozek.id), znalosti: znalosti(), signal: ctrl.signal };
    }
  };
})();
