// .nav-back links: go to the actual previous page when there is one,
// otherwise fall through to the link's href (the homepage)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a.nav-back').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // let modified clicks (new tab etc.) use the href as normal
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!document.referrer) return; // opened directly — no previous page
      e.preventDefault();
      history.back();
    });
  });
});
