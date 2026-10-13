/* AI Kompas – společné: přepínání světlého/tmavého režimu a kopírování ukázek */
(function () {
  var root = document.documentElement;
  var KEY = 'ai-kompas-theme';
  function getStored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setStored(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function effective() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var stored = getStored();
  if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.addEventListener('click', function () {
      var next = effective() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      setStored(next);
    });

    // tlačítka „Kopírovat“ – data-copy="id prvku s textem"
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var el = document.getElementById(btn.getAttribute('data-copy'));
        if (!el) return;
        var label = btn.textContent;
        function done(ok) { btn.textContent = ok ? 'Zkopírováno' : 'Označte a Ctrl+C'; setTimeout(function () { btn.textContent = label; }, 1800); }
        function selectText() { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(el.innerText).then(function () { done(true); }, function () { selectText(); done(false); });
        } else { selectText(); done(false); }
      });
    });
  });
})();

/* drobné pomocníky pro vykreslování */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
var IKONA_VEN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z"/></svg>';
