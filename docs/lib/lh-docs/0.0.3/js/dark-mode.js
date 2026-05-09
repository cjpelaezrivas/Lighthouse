(function () {
  var DARK_MODE_KEY = 'dark-mode';
  var PREFERS_DARK = '(prefers-color-scheme: dark)';
  var darkMode = false;

  function applyClass(value) {
    darkMode = value;
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }

  function applyCodeTheme(value) {
    var rootStyle = getComputedStyle(document.documentElement);
    var lightTheme = rootStyle.getPropertyValue('--lh-code-theme-light').trim();
    var darkTheme = rootStyle.getPropertyValue('--lh-code-theme-dark').trim();

    var themeLink = document.getElementById('style-code-theme');
    if (themeLink && lightTheme && darkTheme) {
      themeLink.href = value ? darkTheme : lightTheme;
    }
  }

  function setDarkMode(value, persist) {
    applyClass(value);
    applyCodeTheme(value);
    if (persist) localStorage.setItem(DARK_MODE_KEY, value);
  }

  var stored = localStorage.getItem(DARK_MODE_KEY);
  applyClass(stored !== null ? stored === 'true' : window.matchMedia(PREFERS_DARK).matches);

  document.addEventListener('DOMContentLoaded', function () {
    applyCodeTheme(darkMode);

    var switchEl = document.getElementById('dark-mode-switch');
    if (switchEl) {
      switchEl.addEventListener('click', function () {
        setDarkMode(!darkMode, true);
      });
    }

    window.matchMedia(PREFERS_DARK).addEventListener('change', function (e) {
      if (localStorage.getItem(DARK_MODE_KEY) === null) {
        setDarkMode(e.matches);
      }
    });
  });
})();
