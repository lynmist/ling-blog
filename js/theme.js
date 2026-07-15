(function () {
  const MODE_KEY = 'ling-theme-mode';
  const VALID_MODES = ['light', 'dark', 'system'];
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() {
    return media.matches ? 'dark' : 'light';
  }

  function getMode() {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (VALID_MODES.includes(saved)) return saved;
    } catch {}
    return 'system';
  }

  function getEffectiveTheme(mode) {
    return mode === 'system' ? getSystemTheme() : mode;
  }

  function applyMode(mode) {
    const effective = getEffectiveTheme(mode);
    document.documentElement.setAttribute('data-theme', effective);
    document.documentElement.setAttribute('data-theme-mode', mode);
    try { localStorage.setItem(MODE_KEY, mode); } catch {}
  }

  // apply before first paint to avoid flash
  applyMode(getMode());

  // react to OS-level theme changes when in system mode
  media.addEventListener('change', () => {
    if (getMode() === 'system') {
      document.documentElement.setAttribute('data-theme', getSystemTheme());
    }
  });

  // cycle: light -> system -> dark -> light
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme-mode') || 'system';
    const next = current === 'light' ? 'system' : current === 'system' ? 'dark' : 'light';
    applyMode(next);
  };
})();
