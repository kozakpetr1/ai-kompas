/* AI Kompas – dashboard: projekt kraje, karty nástrojů, filtr a rychlý výběr podle účelu */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- projekt kraje ---------- */
  var nums = document.getElementById('proj-nums');
  if (nums) nums.innerHTML = PROJEKT.cisla.map(function (c) {
    return '<div class="proj-num"><div class="num">' + esc(c[0]) + '</div><div class="label">' + esc(c[1]) + '</div></div>';
  }).join('');

  var osa = document.getElementById('proj-osa');
  var STAV = { hotovo: '', nove: '<span class="badge badge-new">Novinka</span>', plan: '<span class="badge badge-neutral">plán</span>' };
  if (osa) osa.innerHTML = PROJEKT.osa.map(function (o) {
    return '<li class="' + o[3] + '"><span class="dot"></span><div class="when">' + esc(o[0]) + ' ' + STAV[o[3]] + '</div>' +
      '<div class="what">' + esc(o[1]) + '</div><p class="desc">' + esc(o[2]) + '</p></li>';
  }).join('');

  var src = document.getElementById('proj-zdroje');
  if (src) src.innerHTML = PROJEKT.zdroje.map(function (z) {
    return '<li><a href="' + z[1] + '" target="_blank" rel="noopener">' + esc(z[0]) + '</a></li>';
  }).join('');

  /* ---------- karty nástrojů ---------- */
  var grid = document.getElementById('tool-grid');
  if (grid) grid.innerHTML = NASTROJE.map(function (n) {
    var page = 'nastroje/' + n.id + '.html';
    return '<div class="glass-panel tool-card" data-cat="' + n.cat + '">' +
      '<div class="tool-head"><div class="tool-mark" style="background:' + n.barva + ';">' + n.mark + '</div>' +
      '<div class="tool-name-wrap"><div class="tool-name"><a href="' + page + '">' + esc(n.nazev) + '</a></div><div class="tool-cat">' + esc(n.catNazev) + '</div></div></div>' +
      '<p class="tool-desc">' + esc(n.popis) + '</p>' +
      '<ul class="tool-uses">' + n.pouziti.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
      '<div class="tool-foot"><span class="badge badge-' + n.badge[1] + '">' + esc(n.badge[0]) + '</span>' +
      '<span class="links"><a class="tool-link" href="' + page + '">Průvodce →</a>' +
      '<a class="tool-link" href="' + n.url + '" target="_blank" rel="noopener" aria-label="Otevřít ' + esc(n.nazev) + ' v novém okně">Otevřít ' + IKONA_VEN + '</a></span></div></div>';
  }).join('');

  var h = document.getElementById('tool-count');
  if (h) h.textContent = NASTROJE.length;

  /* ---------- filtr ---------- */
  var chips = document.querySelectorAll('.filter-chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      var f = chip.getAttribute('data-filter');
      document.querySelectorAll('#tool-grid .tool-card').forEach(function (card) {
        card.hidden = !(f === 'vse' || card.getAttribute('data-cat') === f);
      });
    });
  });

  /* ---------- rychlý výběr: co potřebuji udělat ---------- */
  var pick = document.getElementById('pick-grid');
  if (pick) pick.innerHTML = UCELY.map(function (u) {
    var items = DOPORUCENI[u.id].map(function (id) {
      var n = najdiNastroj(id);
      var feat = (n.mapa[u.id] && n.mapa[u.id][0]) ? n.mapa[u.id][0][0] : '';
      return '<li><a href="nastroje/' + n.id + '.html"><span class="mini" style="background:' + n.barva + '">' + n.mark + '</span>' +
        '<span>' + esc(n.nazev) + '</span><span class="feat">' + esc(feat) + '</span></a></li>';
    }).join('');
    return '<div class="glass-panel pick"><h4><span class="sw" style="background:' + u.barva + '"></span>' + esc(u.nazev) + '</h4><ol>' + items + '</ol></div>';
  }).join('');
});
