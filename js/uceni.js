/* AI Kompas – interaktivní ukázka učení neuronové sítě (sekce „Jak AI funguje“).
   Zjednodušený model: 4 vstupní slova → 2 skryté vrstvy → 4 kandidáti na další slovo.
   Trénink = postupné posouvání vah od náhodných hodnot k vyladěným. */
document.addEventListener('DOMContentLoaded', function () {
  var net = document.getElementById('learn-net');
  if (!net) return;

  var VSTUP = ['Praha', 'je', 'hlavní', 'město'];
  var VYSTUP = ['Česka', 'Evropy', 'kultury', 'banán'];
  var P0 = [0.24, 0.27, 0.29, 0.20];   // netrénovaný model: skoro náhoda
  var PF = [0.88, 0.07, 0.04, 0.01];   // natrénovaný model

  // deterministický „náhodný“ generátor, aby ukázka vypadala pokaždé stejně
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

  var X = [105, 260, 410, 550], H = 330;
  var vrstvy = [4, 5, 5, 4];
  var uzly = vrstvy.map(function (n, l) {
    var out = [];
    for (var i = 0; i < n; i++) out.push({ x: X[l], y: (H / (n + 1)) * (i + 1) });
    return out;
  });

  // hrany s počáteční (náhodnou) a konečnou (vyladěnou) váhou
  var hrany = [];
  var cesta = { '1': [1, 3], '2': [2] };     // uzly, přes které „teče“ správná odpověď
  for (var l = 0; l < 3; l++) {
    uzly[l].forEach(function (a, i) {
      uzly[l + 1].forEach(function (b, j) {
        var w0 = rnd() * 2 - 1, wf = (rnd() * 2 - 1) * 0.25;
        if (l === 0 && cesta['1'].indexOf(j) >= 0) wf = 0.85;
        if (l === 1 && cesta['1'].indexOf(i) >= 0 && cesta['2'].indexOf(j) >= 0) wf = 0.95;
        if (l === 2 && i === 2) wf = (j === 0 ? 1 : -0.8);
        hrany.push({ l: l, i: i, j: j, w0: w0, wf: wf, hot: wf > 0.8 });
      });
    });
  }

  var svg = '<svg viewBox="0 0 660 ' + H + '" role="img" aria-label="Schéma neuronové sítě: vstupní slova, dvě skryté vrstvy a kandidáti na další slovo. Tloušťka spoje ukazuje váhu.">';
  hrany.forEach(function (e, k) {
    var a = uzly[e.l][e.i], b = uzly[e.l + 1][e.j];
    svg += '<line class="net-edge' + (e.hot ? ' hot' : '') + '" id="e' + k + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
  });
  uzly.forEach(function (vr, l) {
    vr.forEach(function (u, i) {
      svg += '<circle cx="' + u.x + '" cy="' + u.y + '" r="' + (l === 0 || l === 3 ? 12 : 10) + '" fill="var(--panel-bg-solid)" stroke="var(--accent)" stroke-width="2"/>';
      if (l === 0) svg += '<text x="' + (u.x - 20) + '" y="' + (u.y + 5) + '" text-anchor="end" style="font-size:15px;font-weight:600">' + VSTUP[i] + '</text>';
      if (l === 3) svg += '<text id="o' + i + '" x="' + (u.x + 20) + '" y="' + (u.y + 5) + '" style="font-size:15px">' + VYSTUP[i] + '</text>';
    });
  });
  svg += '<text x="' + X[0] + '" y="20" text-anchor="middle" style="font-size:12px;fill:var(--muted)">vstup</text>';
  svg += '<text x="' + ((X[1] + X[2]) / 2) + '" y="20" text-anchor="middle" style="font-size:12px;fill:var(--muted)">skryté vrstvy (váhy)</text>';
  svg += '<text x="' + X[3] + '" y="20" text-anchor="middle" style="font-size:12px;fill:var(--muted)">výstup</text>';
  net.innerHTML = svg + '</svg>';

  var bars = document.getElementById('learn-bars');
  bars.innerHTML = VYSTUP.map(function (w, i) {
    return '<div class="lbar' + (i === 0 ? ' ok' : '') + '"><span class="w">' + w + '</span><span class="track"><span class="fill" id="b' + i + '"></span></span><span class="p" id="p' + i + '"></span></div>';
  }).join('');

  var range = document.getElementById('learn-t'), out = document.getElementById('learn-t-out');
  var note = document.getElementById('learn-note'), err = document.getElementById('learn-err');
  var cyc = document.querySelectorAll('.learn-cycle span[data-k]');
  var t = 0, playing = false, timer = null;

  function ease(x) { return 1 - Math.pow(1 - x, 2); }
  function pct(x) { return Math.round(x * 100) + ' %'; }

  function kresli() {
    var e = ease(t / 100);
    hrany.forEach(function (h, k) {
      var w = h.w0 + (h.wf - h.w0) * e, el = document.getElementById('e' + k);
      el.setAttribute('stroke', w >= 0 ? 'var(--info)' : 'var(--warning)');
      el.setAttribute('stroke-width', (0.6 + Math.abs(w) * 4).toFixed(2));
      el.setAttribute('opacity', (0.18 + Math.abs(w) * 0.6).toFixed(2));
    });
    var p = P0.map(function (a, i) { return a + (PF[i] - a) * e; });
    var s = p.reduce(function (a, b) { return a + b; }, 0);
    p = p.map(function (x) { return x / s; });
    var best = p.indexOf(Math.max.apply(null, p));
    p.forEach(function (x, i) {
      document.getElementById('b' + i).style.width = (x * 100).toFixed(1) + '%';
      document.getElementById('p' + i).textContent = pct(x);
      document.getElementById('o' + i).style.fontWeight = i === best ? '800' : '400';
    });
    err.textContent = pct(1 - p[0]);
    range.value = t; out.textContent = t + ' %';
    note.textContent =
      t < 5 ? 'Na začátku jsou váhy náhodné. Model tipuje naslepo – všechna slova jsou skoro stejně pravděpodobná.' :
      t < 40 ? 'Po každém příkladu se váhy kousek posunou. Spoje, které vedly ke správnému slovu, sílí, ostatní slábnou.' :
      t < 85 ? 'Model už má jasného favorita. Všimněte si: změnila se jen čísla na spojích (tloušťka čar), nikde nepřibyla uložená věta.' :
      'Natrénováno. V síti není uložená věta „Praha je hlavní město Česka“ – jen nastavená síla spojů, ze které tato odpověď vychází. Model ji pokaždé spočítá, nevyhledává ji.';
  }
  function faze(k) { cyc.forEach(function (c, i) { c.classList.toggle('on', i === k); }); net.classList.toggle('net-pulse', k === 0); }

  function krok(done) {
    if (t >= 100) { if (done) done(); return; }
    faze(0);
    setTimeout(function () {
      faze(1);
      setTimeout(function () {
        faze(2);
        t = Math.min(100, t + 8); kresli();
        setTimeout(function () { faze(-1); if (done) done(); }, 450);
      }, 450);
    }, 450);
  }
  function stop() { playing = false; clearTimeout(timer); document.getElementById('learn-play').textContent = '▶ Trénovat'; }
  function hraj() { if (!playing) return; if (t >= 100) { stop(); return; } krok(function () { timer = setTimeout(hraj, 120); }); }

  document.getElementById('learn-step').addEventListener('click', function () { stop(); krok(); });
  document.getElementById('learn-play').addEventListener('click', function () {
    if (playing) { stop(); return; }
    if (t >= 100) { t = 0; kresli(); }
    playing = true; this.textContent = '❚❚ Zastavit'; hraj();
  });
  document.getElementById('learn-reset').addEventListener('click', function () { stop(); faze(-1); t = 0; kresli(); });
  range.addEventListener('input', function () { stop(); faze(-1); t = +range.value; kresli(); });

  kresli();
});
