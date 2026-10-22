/* Use the same saved light/dark preference and Material Icons as the homepage. */
(() => {
  const themeButton = document.querySelector('#theme-toggle-btn');
  const themeIcon = document.querySelector('#themeToggleIcon');
  function syncTheme() {
    const dark = document.body.classList.contains('dark');
    themeButton?.setAttribute('aria-pressed', String(dark));
    themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeIcon) themeIcon.textContent = dark ? 'dark_mode' : 'light_mode';
  }
  syncTheme();
  themeButton?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    try { localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch (_) {}
    syncTheme();
  });

})();
