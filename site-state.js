(function () {
  const LANGUAGE_KEY = "skein-to-mood:language";
  const LEGACY_LANGUAGE_KEY = "skein-language";
  const THEME_KEY = "skein-to-mood:theme";
  const LANGUAGES = new Set(["ko", "en"]);
  const THEMES = new Set(["light", "dark"]);

  function fallbackLanguage() {
    return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
  }

  function getLanguage() {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (LANGUAGES.has(saved)) return saved;
      const legacy = localStorage.getItem(LEGACY_LANGUAGE_KEY);
      if (LANGUAGES.has(legacy)) {
        localStorage.setItem(LANGUAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_LANGUAGE_KEY);
        return legacy;
      }
    } catch (error) {
      console.warn("Could not read the language preference", error);
    }
    return fallbackLanguage();
  }

  function setLanguage(language) {
    if (!LANGUAGES.has(language)) return getLanguage();
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      localStorage.removeItem(LEGACY_LANGUAGE_KEY);
    } catch (error) {
      console.warn("Could not save the language preference", error);
    }
    return language;
  }

  function getTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (THEMES.has(saved)) return saved;
    } catch (error) {
      console.warn("Could not read the theme preference", error);
    }
    return "dark";
  }

  function renderTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#26221f" : "#f7f6f1");
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const dark = theme === "dark";
      button.textContent = dark ? "☾" : "☀";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
      button.title = button.getAttribute("aria-label");
    });
  }

  function setTheme(theme) {
    if (!THEMES.has(theme)) return getTheme();
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn("Could not save the theme preference", error);
    }
    renderTheme(theme);
    return theme;
  }

  function bindThemeToggle() {
    renderTheme(getTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => setTheme(getTheme() === "dark" ? "light" : "dark"));
    });
  }

  renderTheme(getTheme());
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", bindThemeToggle) : bindThemeToggle();

  window.addEventListener("storage", (event) => {
    if (event.key === LANGUAGE_KEY && LANGUAGES.has(event.newValue)) {
      window.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: event.newValue } }));
    }
    if (event.key === THEME_KEY && THEMES.has(event.newValue)) renderTheme(event.newValue);
  });

  window.SiteState = Object.freeze({ getLanguage, setLanguage, getTheme, setTheme });
}());
