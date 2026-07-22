document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = "ca";
  
  // Llegim l'idioma desat, sinó el per defecte
  let currentLang = localStorage.getItem("selected-lang") || defaultLang;
  
  // Assegurem que s'aplica al carregar
  setLanguage(currentLang, false);

  // Selector d'esdeveniments per desktop i mòbil
  document.addEventListener("click", (e) => {
    // Desktop click item
    const dropdownItem = e.target.closest(".lang-dropdown__item");
    if (dropdownItem) {
      e.preventDefault();
      const lang = dropdownItem.getAttribute("data-lang");
      setLanguage(lang);
    }

    // Mobil click btn
    const mobileBtn = e.target.closest(".mobile-lang-btn");
    if (mobileBtn) {
      e.preventDefault();
      const lang = mobileBtn.getAttribute("data-lang");
      setLanguage(lang);
    }
  });

  function setLanguage(lang, triggerEvent = true) {
    localStorage.setItem("selected-lang", lang);
    currentLang = lang;

    // 1. Actualitzar el botó de l'actual a desktop
    const desktopTriggerText = document.querySelector(".lang-dropdown__btn-text");
    const desktopTriggerFlag = document.querySelector(".lang-dropdown__btn .lang-flag");
    
    if (desktopTriggerText && desktopTriggerFlag) {
      desktopTriggerText.textContent = lang.toUpperCase();
      desktopTriggerFlag.className = `lang-flag lang-flag--${lang}`;
    }

    // 2. Actualitzar classe activa a desktop items
    document.querySelectorAll(".lang-dropdown__item").forEach(item => {
      if (item.getAttribute("data-lang") === lang) {
        item.classList.add("lang-dropdown__item--active");
      } else {
        item.classList.remove("lang-dropdown__item--active");
      }
    });

    // 3. Actualitzar classe activa a mòbil
    document.querySelectorAll(".mobile-lang-btn").forEach(btn => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("mobile-lang-btn--active");
      } else {
        btn.classList.remove("mobile-lang-btn--active");
      }
    });

    // 4. Disparar esdeveniment personalitzat perquè altres scripts puguin escoltar el canvi
    if (triggerEvent) {
      const event = new CustomEvent("languagechanged", { detail: { lang: lang } });
      document.dispatchEvent(event);
    }
  }
});
