(function () {
  const STORAGE_KEY = 'ling-theme';

  function getTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }

  // apply before first paint to avoid flash
  applyTheme(getTheme());

  // toggle helper used by buttons
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };
})();
