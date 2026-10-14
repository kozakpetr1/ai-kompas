/* AI Kompas – stránka jednoho nástroje. Který nástroj, určuje <body data-nastroj="id">. */
document.addEventListener('DOMContentLoaded', function () {
  var id = document.body.getAttribute('data-nastroj');
  var n = najdiNastroj(id);
  var app = document.getElementById('app');
  if (!n) { app.innerHTML = '<p>Nástroj nenalezen. <a href="../index.html">Zpět na přehled</a></p>'; return; }
  document.title = n.nazev + ' · AI Kompas';

  var idx = NASTROJE.indexOf(n), prev = NASTROJE[(idx - 1 + NASTROJE.length) % NASTROJE.length], next = NASTROJE[(idx + 1) % NASTROJE.length];
  var pocet = 0; UCELY.forEach(function (u) { pocet += (n.mapa[u.id] || []).length; });

  var h = '';
  h += '<nav class="crumbs" aria-label="Drobečková navigace"><a href="../index.html">AI Kompas</a><span>›</span><a href="../index.html#nastroje">Nástroje</a><span>›</span><span>' + esc(n.nazev) + '</span></nav>';

  /* hero */
  h += '<section class="glass-panel" style="margin-bottom:28px;padding-top:28px"><div class="t-hero">' +
    '<div class="tool-mark" style="background:' + n.barva + '">' + n.mark + '</div><div>' +
    '<h1>' + esc(n.nazev) + '</h1><div class="sub">' + esc(n.catNazev) + '</div>' +
    '<p class="lead">' + esc(n.popis) + '</p>' +
    '<div class="t-actions"><a class="btn btn-primary" href="' + n.url + '" target="_blank" rel="noopener">Otevřít ' + esc(n.nazev) + ' ' + IKONA_VEN + '</a>' +
    '<span class="badge badge-' + n.badge[1] + '">' + esc(n.badge[0]) + '</span></div></div></div>' +
    '<dl class="facts">' + n.fakta.map(function (f) { return '<div class="fact"><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl></section>';

  /* ekosystém */
  h += '<section id="ekosystem"><div class="section-header"><h6>Ekosystém v kostce</h6><h2>Z čeho se ' + esc(n.nazev) + ' skládá</h2><p>' + esc(n.shrnuti) + '</p></div>' +
    '<div class="eco" role="list">' + n.eko.map(function (c, i) {
      return (i ? '<div class="eco-arrow" aria-hidden="true">→</div>' : '') +
        '<div class="eco-col" role="listitem"><h4>' + esc(c.t) + '</h4><ul>' + c.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div></section>';

  /* myšlenková mapa */
  h += '<section id="mapa" class="mm-section"><div class="section-header"><h6>Myšlenková mapa</h6><h2>K čemu ' + esc(n.nazev) + ' použít</h2>' +
    '<p class="muted">Šest oblastí práce učitele a ' + pocet + ' konkrétních funkcí. Klikněte na oblast nebo funkci a vpravo se zobrazí, k čemu slouží.</p></div>' +
    '<div class="mm-wrap"><div class="mm-svg" id="mm"></div><aside class="mm-panel" id="mm-panel" aria-live="polite"></aside></div></section>';

  /* zjednodušená mapa pro telefon */
  h += '<section id="mapa-mini" class="mm-mini-section"><div class="section-header"><h6>Myšlenková mapa</h6><h2>K čemu ' + esc(n.nazev) + ' použít</h2>' +
    '<p class="muted">Klepněte na oblast a přejdete na její funkce.</p></div><div class="mm-svg">' + miniMapa(n) + '</div></section>';

  /* k čemu a čím */
  h += '<section id="ucely"><div class="section-header"><h6>Přehled</h6><h2>Pro jaký účel a jakým nástrojem</h2></div><div class="purpose-grid">' +
    UCELY.map(function (u) {
      var leaves = n.mapa[u.id] || [];
      return '<div class="glass-panel purpose" id="ucel-' + u.id + '" style="--pc:' + u.barva + '"><h4>' + esc(u.nazev) + '</h4><dl>' +
        leaves.map(function (l) { return '<div><dt>' + esc(l[0]) + '</dt><dd>' + esc(l[1]) + '</dd></div>'; }).join('') + '</dl></div>';
    }).join('') + '</div></section>';

  /* jak začít + pozor */
  h += '<section id="start"><div class="two-col">' +
    '<div class="glass-panel"><h6>Za 15 minut</h6><h3>Jak začít</h3><ol class="steps">' + n.start.map(function (s) { return '<li><span>' + esc(s) + '</span></li>'; }).join('') + '</ol></div>' +
    '<div><h6>Než nástroj nasadíte</h6><h3>Na co si dát pozor</h3>' + n.pozor.map(function (p) {
      return '<div class="alert-box alert-warning"><svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg><div><p>' + esc(p) + '</p></div></div>';
    }).join('') + '</div></div></section>';

  /* odkazy + navigace */
  h += '<section id="odkazy" style="margin-bottom:28px"><h6>Oficiální zdroje</h6><ul class="src-list">' +
    n.odkazy.map(function (o) { return '<li><a href="' + o[1] + '" target="_blank" rel="noopener">' + esc(o[0]) + '</a></li>'; }).join('') + '</ul>' +
    '<p class="updated">Stav k říjnu 2026. AI nástroje se mění rychle – podmínky a ceny si vždy ověřte u výrobce.</p></section>';
  h += '<nav class="tool-nav" aria-label="Další nástroje"><a href="' + prev.id + '.html"><small>← Předchozí</small>' + esc(prev.nazev) + '</a>' +
    '<a class="next" href="' + next.id + '.html"><small>Další →</small>' + esc(next.nazev) + '</a></nav>';

  app.innerHTML = h;
  kresliMapu(n);
});

/* ---------- radiální myšlenková mapa (SVG) ---------- */
function kresliMapu(n) {
  var box = document.getElementById('mm'), panel = document.getElementById('mm-panel');
  var W = 1000, H = 660, cx = 500, cy = 330;
  var B = { rx: 170, ry: 148 }, L = { rx: 290, ry: 232 }, GAP = 36;
  var NS = 'http://www.w3.org/2000/svg';
  var edges = '', nodes = '', leaves = '';

  UCELY.forEach(function (u, i) {
    var a = (-60 + i * 60) * Math.PI / 180;
    var bx = cx + B.rx * Math.cos(a), by = cy + B.ry * Math.sin(a);
    var list = n.mapa[u.id] || [];
    // hrana střed → větev
    edges += '<path class="mm-edge" data-b="' + u.id + '" d="M' + cx + ',' + cy + ' Q' + (cx + (bx - cx) * 0.5) + ',' + (cy + (by - cy) * 0.15) + ' ' + bx + ',' + by + '" fill="none" stroke="' + u.barva + '" stroke-width="5" stroke-linecap="round" opacity=".75"/>';
    list.forEach(function (l, j) {
      // listy pod sebou vedle větve – nepřekrývají se ani u větví nahoře a dole
      var lx = Math.abs(Math.cos(a)) > 0.9 ? cx + L.rx * Math.cos(a) : bx + (Math.cos(a) > 0 ? 75 : -75);
      var ly = cy + L.ry * Math.sin(a) + (j - (list.length - 1) / 2) * GAP;
      var right = Math.cos(a) >= 0;
      edges += '<path class="mm-edge" data-b="' + u.id + '" data-l="' + u.id + j + '" d="M' + bx + ',' + by + ' Q' + (bx + (lx - bx) * 0.55) + ',' + by + ' ' + lx + ',' + ly + '" fill="none" stroke="' + u.barva + '" stroke-width="2" opacity=".7"/>';
      var label = l[0].length > 24 ? l[0].slice(0, 23) + '…' : l[0];
      leaves += '<g class="mm-leaf" tabindex="0" role="button" data-b="' + u.id + '" data-u="' + i + '" data-j="' + j + '" aria-label="' + esc(l[0] + ': ' + l[1]) + '">' +
        '<circle cx="' + lx + '" cy="' + ly + '" r="6" fill="' + u.barva + '"/>' +
        '<text x="' + (lx + (right ? 12 : -12)) + '" y="' + (ly + 5) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(label) + '</text></g>';
    });
    var w = 26 + u.kratce.length * 9.2;
    nodes += '<g class="mm-branch" tabindex="0" role="button" data-u="' + i + '" aria-label="Oblast ' + esc(u.nazev) + '">' +
      '<rect x="' + (bx - w / 2) + '" y="' + (by - 18) + '" width="' + w + '" height="36" rx="18" fill="var(--panel-bg-solid)" stroke="' + u.barva + '" stroke-width="2"/>' +
      '<text x="' + bx + '" y="' + (by + 5) + '" text-anchor="middle" style="font-weight:700;font-size:15px;fill:' + u.barva + '">' + esc(u.kratce) + '</text></g>';
  });

  var nm = n.nazev.split(' (')[0];
  var lines = nm.length > 12 && nm.indexOf(' ') > 0 ? [nm.slice(0, nm.indexOf(' ')), nm.slice(nm.indexOf(' ') + 1)] : [nm];
  var center = '<circle cx="' + cx + '" cy="' + cy + '" r="68" fill="' + n.barva + '"/>' +
    lines.map(function (t, k) { return '<text x="' + cx + '" y="' + (cy + 6 + (k - (lines.length - 1) / 2) * 20) + '" text-anchor="middle" style="fill:#ffffff;font-weight:800;font-size:18px">' + esc(t) + '</text>'; }).join('');

  box.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Myšlenková mapa: k čemu použít ' + esc(n.nazev) + '"><g id="mm-g">' + edges + center + nodes + leaves + '</g></svg>';
  var g = document.getElementById('mm-g');

  function vychozi() {
    panel.innerHTML = '<div class="k" style="color:var(--accent-soft)">Jak mapu číst</div><h3>' + esc(n.nazev) + '</h3>' +
      '<p>Uprostřed je nástroj, kolem šest oblastí práce učitele. Na konci větví jsou konkrétní funkce.</p><p class="mm-hint">Klikněte na oblast nebo funkci. Na klávesnici Tab a Enter.</p>';
  }
  function zvyrazni(bid, lid) {
    g.parentNode.classList.add('mm-dim');
    g.querySelectorAll('.mm-leaf, .mm-edge').forEach(function (el) {
      var on = el.getAttribute('data-b') === bid && (!lid || !el.getAttribute('data-l') || el.getAttribute('data-l') === lid);
      if (el.classList.contains('mm-leaf')) on = el.getAttribute('data-b') === bid && (!lid || (el.getAttribute('data-b') + el.getAttribute('data-j')) === lid);
      el.classList.toggle('hl', on);
      el.classList.toggle('on', !!lid && on && el.classList.contains('mm-leaf'));
    });
  }
  function ukazVetev(i) {
    var u = UCELY[i], list = n.mapa[u.id] || [];
    zvyrazni(u.id, null);
    panel.innerHTML = '<div class="k" style="color:' + u.barva + '">Oblast</div><h3>' + esc(u.nazev) + '</h3>' +
      '<ul>' + list.map(function (l) { return '<li><b>' + esc(l[0]) + '</b> – ' + esc(l[1]) + '</li>'; }).join('') + '</ul>';
  }
  function ukazList(i, j) {
    var u = UCELY[i], l = (n.mapa[u.id] || [])[j];
    zvyrazni(u.id, u.id + j);
    panel.innerHTML = '<div class="k" style="color:' + u.barva + '">' + esc(u.nazev) + '</div><h3>' + esc(l[0]) + '</h3><p>' + esc(l[1]) + '</p>' +
      '<p class="mm-hint"><a href="#" id="mm-reset">Zobrazit celou mapu</a></p>';
    document.getElementById('mm-reset').addEventListener('click', function (e) { e.preventDefault(); reset(); });
  }
  function reset() { g.parentNode.classList.remove('mm-dim'); g.querySelectorAll('.hl,.on').forEach(function (el) { el.classList.remove('hl', 'on'); }); vychozi(); }

  function bind(sel, fn) {
    g.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener('click', function () { fn(el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(el); } });
    });
  }
  bind('.mm-branch', function (el) { ukazVetev(+el.getAttribute('data-u')); });
  bind('.mm-leaf', function (el) { ukazList(+el.getAttribute('data-u'), +el.getAttribute('data-j')); });
  g.parentNode.addEventListener('click', function (e) { if (e.target.tagName === 'svg') reset(); });
  vychozi();
}

/* ---------- zjednodušená mapa pro úzké displeje: jen oblasti s počtem funkcí ---------- */
function miniMapa(n) {
  var W = 420, H = 330, cx = 210, cy = 165, out = '', UHLY = [-45, 0, 45, 135, 180, 225];
  UCELY.forEach(function (u, i) {
    var a = UHLY[i] * Math.PI / 180, x = cx + 142 * Math.cos(a), y = cy + 128 * Math.sin(a);
    var c = (n.mapa[u.id] || []).length, w = 30 + (u.kratce.length + 4) * 7.6;
    out += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="' + u.barva + '" stroke-width="4" opacity=".7"/>' +
      '<a href="#ucel-' + u.id + '"><rect x="' + (x - w / 2) + '" y="' + (y - 19) + '" width="' + w + '" height="38" rx="19" fill="var(--panel-bg-solid)" stroke="' + u.barva + '" stroke-width="2"/>' +
      '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" style="font-weight:700;font-size:13px;fill:' + u.barva + '">' + esc(u.kratce) + ' · ' + c + '</text></a>';
  });
  var nm = n.nazev.split(' (')[0], sp = nm.indexOf(' ');
  var lines = nm.length > 10 && sp > 0 ? [nm.slice(0, sp), nm.slice(sp + 1)] : [nm];
  out += '<circle cx="' + cx + '" cy="' + cy + '" r="48" fill="' + n.barva + '"/>' + lines.map(function (t, k) {
    return '<text x="' + cx + '" y="' + (cy + 5 + (k - (lines.length - 1) / 2) * 17) + '" text-anchor="middle" style="fill:#ffffff;font-weight:800;font-size:15px">' + esc(t) + '</text>';
  }).join('');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Oblasti využití ' + esc(n.nazev) + '">' + out + '</svg>';
}
