/* AI Kompas – vizuální efekty redesignu:
   1) živá „neuronová síť“ v pozadí hero panelu (canvas),
   2) jemné objevování panelů při rolování.
   Obojí respektuje prefers-reduced-motion a bez JS se stránka zobrazí normálně. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initNet() {
    var host = document.querySelector('.hero');
    if (!host) return;
    var c = document.createElement('canvas');
    c.className = 'hero-net';
    c.setAttribute('aria-hidden', 'true');
    host.insertBefore(c, host.firstChild);
    var ctx = c.getContext('2d');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [], pulses = [], col = { a: '#7c5cff', b: '#22d3ee' }, frame = 0, visible = true;

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      var dark = cs.colorScheme === 'dark' || cs.getPropertyValue('color-scheme').trim() === 'dark';
      col.a = dark ? '165,180,252' : '99,102,241';
      col.b = dark ? '103,232,249' : '8,145,178';
    }
    function resize() {
      var r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, Math.max(26, (W * H) / 9000)));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 1.2 + Math.random() * 1.8 });
      }
      pulses = [];
    }
    var LINK = 130;
    function draw() {
      if (frame++ % 90 === 0) readColors();
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        for (var j = i + 1; j < nodes.length; j++) {
          var q = nodes[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + col.a + ',' + (0.28 * (1 - d / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            if (!reduce && Math.random() < 0.0009 && pulses.length < 14) pulses.push({ a: p, b: q, t: 0 });
          }
        }
      }
      // signály běžící po spojích
      for (var k = pulses.length - 1; k >= 0; k--) {
        var s = pulses[k]; s.t += 0.018;
        if (s.t >= 1) { pulses.splice(k, 1); continue; }
        var x = s.a.x + (s.b.x - s.a.x) * s.t, y = s.a.y + (s.b.y - s.a.y) * s.t;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, 'rgba(' + col.b + ',0.95)'); g.addColorStop(1, 'rgba(' + col.b + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      }
      for (var m = 0; m < nodes.length; m++) {
        var n = nodes[m];
        ctx.fillStyle = 'rgba(' + col.a + ',0.75)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce && visible) requestAnimationFrame(draw);
    }
    readColors(); resize(); draw();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { resize(); if (reduce) draw(); }, 150); });
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (e) {
        var was = visible; visible = e[0].isIntersecting;
        if (visible && !was) requestAnimationFrame(draw);
      }).observe(host);
    }
    var tg = document.getElementById('theme-toggle');
    if (tg) tg.addEventListener('click', function () { setTimeout(function () { readColors(); if (reduce) draw(); }, 0); });
  }

  function initReveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.page .glass-panel:not(.hero), .page .alert-box, .page .code-window, .page .diagram-figure');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // co je vidět hned, nepřeblikávat
      el.classList.add('reveal'); io.observe(el);
    });
  }

  function start() { initNet(); setTimeout(initReveal, 60); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
