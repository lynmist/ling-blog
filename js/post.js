// Renders the markdown stored in <script id="md-src" type="text/plain"> into #md-output
window.addEventListener('DOMContentLoaded', function () {
  marked.use({ breaks: true, gfm: true });
  var srcEl = document.getElementById('md-src');
  var body = srcEl ? srcEl.textContent.trim() : '';
  document.getElementById('md-output').innerHTML = marked.parse(body);

  // turn a lone italic line right after an image into a caption
  document.querySelectorAll('.md-body img').forEach(function (img) {
    var par = img.closest('p');
    if (!par) return;
    var next = par.nextElementSibling;
    if (next && next.tagName === 'P' && next.querySelector('em') && next.childNodes.length === 1) {
      next.style.cssText = 'font-size:11px;color:var(--ink4);font-style:italic;text-align:center;margin-top:-1.2rem;margin-bottom:2.2rem;';
    }
  });

  // word count in footer
  var text = document.getElementById('md-output').textContent || '';
  var n = (text.match(/[\u4e00-\u9fa5]/g) || []).length + (text.match(/[a-zA-Z]+/g) || []).length;
  var wc = document.getElementById('wc-out');
  if (wc) wc.textContent = '© 2026 ling · ' + n + ' 字';
});
