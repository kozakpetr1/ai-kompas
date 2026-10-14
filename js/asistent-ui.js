/* AI Kompas – asistent: UŽIVATELSKÉ ROZHRANÍ
   Kreslí chat a nastavení do #asistent. S mozky mluví jen přes KompasAsistent. */
(function () {
  const A = window.KompasAsistent;

  /* ---------- lehký a bezpečný markdown (stejný formát vrací i AI modely) ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, href) {
      const h = href.replace(/&amp;/g, '&');
      if (!/^(https?:\/\/|#|nastroje\/[a-z0-9-]+\.html|[a-z0-9-]+\.html)/i.test(h)) return t;   // jen bezpečné odkazy
      const ven = /^https?:/i.test(h);
      return '<a href="' + esc(h) + '"' + (ven ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>';
    });
    return s;
  }
  function md(text) {
    const radky = String(text).replace(/\r/g, '').split('\n');
    let html = '', seznam = null, odst = [];
    function zavriOdst() { if (odst.length) { html += '<p>' + odst.map(inline).join('<br>') + '</p>'; odst = []; } }
    function zavriSeznam() { if (seznam) { html += '</' + seznam + '>'; seznam = null; } }
    radky.forEach(function (r) {
      const ul = r.match(/^\s*[-*•]\s+(.*)$/), ol = r.match(/^\s*\d+[.)]\s+(.*)$/), h = r.match(/^#{1,4}\s+(.*)$/);
      if (ul || ol) {
        zavriOdst();
        const typ = ul ? 'ul' : 'ol';
        if (seznam !== typ) { zavriSeznam(); html += '<' + typ + '>'; seznam = typ; }
        html += '<li>' + inline((ul || ol)[1]) + '</li>';
      } else if (h) { zavriOdst(); zavriSeznam(); html += '<p><strong>' + inline(h[1]) + '</strong></p>'; }
      else if (!r.trim()) { zavriOdst(); zavriSeznam(); }
      else { zavriSeznam(); odst.push(r); }
    });
    zavriOdst(); zavriSeznam();
    return html;
  }

  /* ---------- prvky ---------- */
  const IKONA_ODESLAT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.99.99 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>';
  const IKONA_NAST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94a7.07 7.07 0 000-1.88l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.48.48 0 00.12.61l2.03 1.58a7.4 7.4 0 000 1.88l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z"/></svg>';
  const IKONA_NOVA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.96 7.96 0 0012 4a8 8 0 108 8h-2a6 6 0 11-1.76-4.24L13 11h7V4l-2.35 2.35z"/></svg>';

  function postav(root) {
    root.innerHTML =
      '<div class="as-head">' +
        '<div class="as-title"><span class="as-avatar" aria-hidden="true"><span></span></span>' +
          '<div><h2 id="as-nadpis">Asistent kompasu</h2><p class="muted">Zeptejte se na nástroje, jejich použití ve výuce, bezpečnost nebo projekt kraje.</p></div></div>' +
        '<div class="as-tools">' +
          '<span class="as-brain" id="as-brain" title="Který mozek právě odpovídá"></span>' +
          '<button type="button" class="as-icon" id="as-new" aria-label="Nová konverzace" title="Nová konverzace">' + IKONA_NOVA + '</button>' +
          '<button type="button" class="as-icon" id="as-gear" aria-label="Nastavení asistenta" title="Nastavení asistenta" aria-expanded="false" aria-controls="as-settings">' + IKONA_NAST + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="as-settings" id="as-settings" hidden></div>' +
      '<div class="as-log" id="as-log" role="log" aria-live="polite" aria-label="Konverzace s asistentem"></div>' +
      '<div class="as-suggest" id="as-suggest"></div>' +
      '<form class="as-input" id="as-form" autocomplete="off">' +
        '<label class="visually-hidden" for="as-text">Dotaz pro asistenta</label>' +
        '<textarea id="as-text" rows="1" maxlength="2000" placeholder="Např. Co se hodí na hodnocení a zpětnou vazbu?"></textarea>' +
        '<button type="submit" class="as-send" id="as-send" aria-label="Odeslat">' + IKONA_ODESLAT + '</button>' +
      '</form>' +
      '<p class="as-foot">Konverzace se nikam neukládá. Do dotazů nevkládejte osobní údaje žáků.</p>';
  }

  function init() {
    const root = document.getElementById('asistent-app');
    if (!root || !A) return;
    postav(root);
    const log = root.querySelector('#as-log'), sug = root.querySelector('#as-suggest'), form = root.querySelector('#as-form');
    const ta = root.querySelector('#as-text'), brain = root.querySelector('#as-brain'), gear = root.querySelector('#as-gear');
    const panel = root.querySelector('#as-settings'), send = root.querySelector('#as-send');
    let premysli = null;

    function zobrazMozek() {
      const m = A.aktivniMozek();
      brain.className = 'as-brain ' + (m.jeAI ? 'is-ai' : 'is-rules');
      brain.innerHTML = '<span class="as-led"></span>' + esc(m.jeAI ? 'AI · ' + (A.nastaveniMozku(m.id).model || 'model') : 'Bez AI');
    }
    function scroll() { log.scrollTop = log.scrollHeight; }
    function bublina(role, html, extra) {
      const el = document.createElement('div');
      el.className = 'as-msg as-' + role + (extra ? ' ' + extra : '');
      el.innerHTML = html;
      log.appendChild(el);
      // u odpovědi asistenta skočit na její začátek, ať se dlouhá odpověď čte shora
      if (role === 'assistant' && !extra) log.scrollTop = Math.max(0, el.offsetTop - 12);
      else scroll();
      return el;
    }
    function navrhy(seznam) {
      sug.innerHTML = '';
      (seznam || []).slice(0, 3).forEach(function (t) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'as-chip'; b.textContent = t;
        b.addEventListener('click', function () { odesli(t); });
        sug.appendChild(b);
      });
    }
    function uvitani() {
      log.innerHTML = '';
      const m = A.aktivniMozek();
      bublina('assistant', md(m.jeAI
        ? 'Dobrý den, jsem **asistent AI Kompasu**. Odpovídám pomocí AI s využitím obsahu kompasu – odpovědi si i tak ověřujte.'
        : 'Dobrý den, jsem **asistent AI Kompasu**. Zatím pracuji **bez AI** – odpovídám z obsahu kompasu podle klíčových slov. Na volně formulované dotazy proto nemusím umět odpovědět; nejlépe mi rozumím, když zmíníte nástroj nebo co potřebujete udělat.'));
      navrhy(['Co se hodí na přípravu hodiny?', 'Co umí NotebookLM?', 'Porovnej Gemini a Copilot']);
    }

    async function odesli(text) {
      text = (text || '').trim();
      if (!text) return;
      ta.value = ''; autosize(); navrhy([]);
      await A.odeslat(text);
    }

    A.naslouchej(function (udalost, data) {
      if (udalost === 'zprava') bublina('user', '<p>' + esc(data.content).replace(/\n/g, '<br>') + '</p>');
      if (udalost === 'premysli') { premysli = bublina('assistant', '<span class="as-typing"><i></i><i></i><i></i></span>', 'is-typing'); send.disabled = true; }
      if (udalost === 'odpoved') {
        if (premysli) { premysli.remove(); premysli = null; }
        send.disabled = false;
        const el = bublina('assistant', md(data.content), data.chyba ? 'is-error' : '');
        if (data.chyba) scroll();
        if (data.poznamka) { const p = document.createElement('div'); p.className = 'as-note'; p.textContent = data.poznamka; el.appendChild(p); }
        navrhy(data.navrhy);
        ta.focus({ preventScroll: true });
      }
      if (udalost === 'vymazano') { if (premysli) { premysli.remove(); premysli = null; } send.disabled = false; uvitani(); }
      if (udalost === 'mozek' || udalost === 'mozky') zobrazMozek();
    });

    form.addEventListener('submit', function (e) { e.preventDefault(); odesli(ta.value); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
    function autosize() { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; }
    ta.addEventListener('input', autosize);
    root.querySelector('#as-new').addEventListener('click', function () { A.vymaz(); ta.focus(); });

    /* ---------- nastavení: volba mozku, jeho parametry, instrukce ---------- */
    function kresliNastaveni() {
      const akt = A.aktivniMozek().id;
      let h = '<fieldset class="as-brains"><legend>Mozek asistenta</legend>';
      A.seznamMozku().forEach(function (m) {
        h += '<label class="as-brain-opt"><input type="radio" name="as-mozek" value="' + esc(m.id) + '"' + (m.id === akt ? ' checked' : '') + '>' +
          '<span><b>' + esc(m.nazev) + '</b><small>' + esc(m.popis) + '</small></span></label>';
      });
      h += '</fieldset><div id="as-brain-fields"></div>' +
        '<label class="as-field"><span>Instrukce pro AI (systémový prompt)</span>' +
        '<textarea id="as-instr" rows="5">' + esc(A.instrukce()) + '</textarea>' +
        '<small>Mozek bez AI instrukce nepoužívá – uplatní se po napojení AI. Znalosti z kompasu se k nim přidávají automaticky.</small></label>' +
        '<div class="as-actions"><button type="button" class="btn btn-primary" id="as-save">Uložit</button>' +
        '<button type="button" class="btn btn-secondary" id="as-reset">Výchozí instrukce</button>' +
        '<span class="as-saved" id="as-saved" aria-live="polite"></span></div>';
      panel.innerHTML = h;
      function kresliPole() {
        const id = panel.querySelector('input[name="as-mozek"]:checked').value;
        const m = A.seznamMozku().find(function (x) { return x.id === id; });
        const hodnoty = A.nastaveniMozku(id);
        panel.querySelector('#as-brain-fields').innerHTML = (m.nastaveni || []).map(function (p) {
          return '<label class="as-field"><span>' + esc(p.nazev) + '</span><input type="' + (p.typ === 'password' ? 'password' : p.typ === 'url' ? 'url' : 'text') + '" data-klic="' + esc(p.klic) + '" value="' + esc(hodnoty[p.klic] || '') + '" placeholder="' + esc(p.napoveda || '') + '"><small>' + esc(p.napoveda || '') + '</small></label>';
        }).join('');
      }
      kresliPole();
      panel.querySelectorAll('input[name="as-mozek"]').forEach(function (r) { r.addEventListener('change', kresliPole); });
      panel.querySelector('#as-reset').addEventListener('click', function () { panel.querySelector('#as-instr').value = A.VYCHOZI_INSTRUKCE; });
      panel.querySelector('#as-save').addEventListener('click', function () {
        const id = panel.querySelector('input[name="as-mozek"]:checked').value;
        const hodnoty = {};
        panel.querySelectorAll('#as-brain-fields [data-klic]').forEach(function (i) { hodnoty[i.getAttribute('data-klic')] = i.value.trim(); });
        A.ulozNastaveniMozku(id, hodnoty);
        A.nastavInstrukce(panel.querySelector('#as-instr').value);
        A.zvolMozek(id);
        const s = panel.querySelector('#as-saved'); s.textContent = 'Uloženo';
        setTimeout(function () { s.textContent = ''; }, 1800);
      });
    }
    gear.addEventListener('click', function () {
      const otevrit = panel.hidden;
      if (otevrit) kresliNastaveni();
      panel.hidden = !otevrit;
      gear.setAttribute('aria-expanded', String(otevrit));
    });

    zobrazMozek();
    uvitani();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
