document.addEventListener("DOMContentLoaded", () => {
  // Inyectem Header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    headerPlaceholder.className = "header";
    headerPlaceholder.id = "header";
    headerPlaceholder.innerHTML = `
      <div class="container header__container">
        <nav class="header__nav header__nav--left">
          <a href="espai.html" class="header__link">L'AULA</a>
          <a href="activitats.html" class="header__link">ACTIVITATS</a>
          <a href="cuina.html" class="header__link">LAB CORBÍ</a>
        </nav>
        <a href="index.html" class="header__logo" aria-label="Aula Gastronòmica Home">
          <img src="img/logo/logoIcon_blauFosc.svg" alt="Aula Gastronòmica" class="header__logo-img" />
        </a>
        <nav class="header__nav header__nav--right">
          <a href="contacte.html" class="header__link">Contacte</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="header__link header__link--icon" aria-label="Instagram">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </nav>

        <!-- Hamburguesa -->
        <button class="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Obrir menú">
          <span class="hamburger-line line-1"></span>
          <span class="hamburger-line line-2"></span>
        </button>
      </div>

      <!-- Navegació Mòbil (Overlay) -->
      <nav id="mobile-nav" class="mobile-nav" aria-label="Navegació mòbil">
        <div class="mobile-nav__logo">
          <a href="index.html" aria-label="Aula Gastronòmica Home">
            <img src="img/logo/logoText-blanc.svg" alt="Aula Gastronòmica" class="mobile-nav__logo-img" />
          </a>
        </div>
        <ul class="mobile-nav__list">
          <li><a href="espai.html" class="mobile-link">L'AULA</a></li>
          <li><a href="activitats.html" class="mobile-link">ACTIVITATS</a></li>
          <li><a href="cuina.html" class="mobile-link">LAB CORBÍ</a></li>
          <li><a href="contacte.html" class="mobile-link">CONTACTE</a></li>
        </ul>
        <div class="mobile-lang">
          <button class="mobile-lang-btn mobile-lang-btn--active" data-lang="es"><span class="lang-flag lang-flag--es"></span>ES</button>
          <button class="mobile-lang-btn" data-lang="ca"><span class="lang-flag lang-flag--ca"></span>CA</button>
          <button class="mobile-lang-btn" data-lang="en"><span class="lang-flag lang-flag--en"></span>EN</button>
        </div>
      </nav>
    `;
  }

  // Inyectem Footer
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.className = "cta";
    footerPlaceholder.id = "cta";
    footerPlaceholder.innerHTML = `
      <div class="container cta__container">
        <div class="cta__content-wrapper">
          <h2 class="cta__title">
            <span class="cta__title-line">Vols formar part de l'experiència?</span>
          </h2>
          <p class="cta__text">
            Descobreix una nova manera d'entendre la gastronomia: més conscient, més propera i profundament connectada amb el territori.
          </p>
          <div class="cta__actions">
            <a href="contacte.html" class="btn--cta">
              <span class="btn--cta__text">Contactar</span>
              <span class="btn--cta__fill"></span>
            </a>
            <a href="activitats.html" class="btn--cta btn--cta--solid">
              <span class="btn--cta__text">Reservar activitat</span>
              <span class="btn--cta__fill"></span>
            </a>
          </div>
        </div>

        <div class="cta__footer">
          <!-- Row 1: Logo & Navigation -->
          <div class="cta__footer-row cta__footer-row--top">
            <div class="cta__footer-logo">
              <img src="img/logo/logoText_main.svg" alt="Aula Gastronòmica de l'Empordà - Quim Casellas" class="cta__footer-logo-img" />
            </div>
            <div class="cta__footer-nav">
              <a
                href="https://maps.google.com/?q=Carrer+del+Turisme,+1,+17253+Vall-llobrega,+Girona"
                target="_blank"
                rel="noopener noreferrer"
                class="cta__footer-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Ubicació
              </a>
              <a href="mailto:info@aulagastronomica.com" class="cta__footer-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Correu
              </a>
              <a href="tel:+34972600000" class="cta__footer-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  ></path>
                </svg>
                Telèfon
              </a>
            </div>
          </div>

          <!-- Row 2: Copyright & Legal links -->
          <div class="cta__footer-row cta__footer-row--bottom">
            <span class="cta__legal-text">© 2026 Aula Gastronòmica Quim Casellas</span>
            <div class="cta__legal-links">
              <a href="legal.html" class="cta__legal-link">Avís legal</a>
              <a href="privacitat.html" class="cta__legal-link">Política de privacitat</a>
              <a href="cookies.html" class="cta__legal-link">Política de cookies</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Inicialitzem les interaccions del Header i Footer inyectats
  setTimeout(() => {
    if (typeof gsap !== "undefined") {
      initHeaderAnimations();
      initMobileMenu();
      initCTA();
      initCtaRipple();
    }
  }, 100);
});

/* ----- HEADER ANIMATIONS ----- */
function initHeaderAnimations() {
  if (typeof SplitText === "undefined") return;
  const headerTl = gsap.timeline({ delay: 0.3 });
  const navLinks = document.querySelectorAll(".header__link");
  if (navLinks.length) {
    navLinks.forEach((link) => link.style.setProperty("visibility", "visible", "important"));
    navLinks.forEach((link) => {
      const text = link.textContent.trim();
      if (!text) return;
      link.innerHTML = `
        <div class="split-mask">
          <span class="txt-original">${text}</span>
        </div>
      `;

      const orig = link.querySelector(".txt-original");
      const split = new SplitText(orig, { type: "chars", mask: "lines" });
      headerTl.from(
        split.chars,
        {
          opacity: 0,
          y: 10,
          stagger: 0.04,
          duration: 0.2,
          ease: "power3.out",
        },
        "-=0.1",
      );
    });
    headerTl.from(".header__logo", {
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
    });
  }

  headerTl.from(
    ".menu-toggle",
    {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "back.out(1.7)",
    },
    "-=2.8",
  );
}

/* ----- MOBILE MENU INTERACTION ----- */
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  let isMenuOpen = false;

  if (!menuToggle || !mobileNav) return;

  gsap.set(mobileNav, { yPercent: -100 });
  mobileLinks.forEach((link) => link.style.setProperty("visibility", "visible", "important"));

  let mobileSplits = [];
  if (typeof SplitText !== "undefined") {
    mobileSplits = Array.from(document.querySelectorAll(".mobile-link")).map((link) => {
      const text = link.textContent.trim();
      link.innerHTML = `
        <div class="split-mask">
          <span class="txt-original">${text}</span>
        </div>
      `;
      const split = new SplitText(link.querySelector(".txt-original"), { type: "chars, lines", mask: "lines" });
      gsap.set(split.chars, { opacity: 0, y: 80, rotateX: -90 });
      return split;
    });
  }

  menuToggle.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle("is-active");
    mobileNav.classList.toggle("is-open");
    document.body.classList.toggle("no-scroll", isMenuOpen);

    const tl = gsap.timeline();

    if (isMenuOpen) {
      gsap.set(mobileNav, { visibility: "visible" });

      tl.to(mobileNav, {
        yPercent: 0,
        duration: 0.35,
        ease: "power4.out",
      });

      if (mobileSplits.length) {
        mobileSplits.forEach((split) => {
          tl.fromTo(
            split.chars,
            {
              opacity: 0,
              y: 80,
              rotateX: -90,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.03,
              duration: 0.3,
              ease: "power4.out",
            },
            ">",
          );
        });
      }
    } else {
      if (mobileSplits.length) {
        mobileSplits.forEach((split) => {
          tl.to(
            split.chars,
            {
              opacity: 0,
              y: -60,
              stagger: 0.01,
              duration: 0.2,
              ease: "power3.in",
            },
            0,
          );
        });
      }

      tl.to(mobileNav, {
        yPercent: -100,
        duration: 0.25,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(mobileNav, { visibility: "hidden" });
          if (mobileSplits.length) {
            mobileSplits.forEach((split) => gsap.set(split.chars, { opacity: 0, y: 80, rotateX: -90 }));
          }
        },
      });
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMenuOpen) menuToggle.click();
    });
  });
}

/* ----- CTA FOOTER ----- */
function initCTA() {
  const section = document.querySelector(".cta");
  const titleLine = document.querySelector(".cta__title-line");
  const text = document.querySelector(".cta__text");
  const footerLogo = document.querySelector(".cta__footer-logo");
  const footerBtns = document.querySelectorAll(".cta__footer-btn");
  if (!section || !titleLine || !text) return;

  const buttons = section.querySelectorAll(".btn--cta");

  gsap.set(text, { opacity: 0, y: 30 });
  gsap.set(buttons, { opacity: 0, scale: 0.9 });
  gsap.set(footerLogo, { opacity: 0, y: 20 });
  gsap.set(footerBtns, { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      toggleActions: "play none none reverse",
    },
  });

  if (typeof SplitText !== "undefined") {
    const split = new SplitText(titleLine, { type: "words,chars" });
    tl.from(split.chars, {
      duration: 0.8,
      opacity: 0,
      rotationX: 90,
      rotationY: (i) => (i % 2 === 0 ? -10 : 10),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: "power3.out",
      stagger: { each: 0.03 },
    });
  } else {
    tl.from(titleLine, { opacity: 0, y: 20, duration: 0.6 });
  }

  tl.to(text, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
    .to(buttons, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
    .to(footerLogo, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
}

/* ----- RIPPLE BTN ----- */
function initCtaRipple() {
  const buttons = document.querySelectorAll(".btn--cta");
  if (!buttons.length) return;

  const style = getComputedStyle(document.documentElement);
  const white = style.getPropertyValue("--blanco").trim() || "#ffffff";
  const darkBlue = style.getPropertyValue("--azul-oscuro").trim() || "#283c5b";

  buttons.forEach((btn) => {
    const fill = btn.querySelector(".btn--cta__fill");
    const text = btn.querySelector(".btn--cta__text");
    if (!fill || !text) return;

    btn.addEventListener("mouseenter", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.fromTo(fill, { x: relX, y: relY, scale: 0 }, { scale: 50, duration: 4, ease: "power5.in", overwrite: "auto" });
      gsap.to(text, { color: darkBlue, duration: 0.5 });
    });

    btn.addEventListener("mouseleave", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.to(fill, { x: relX, y: relY, scale: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
      gsap.to(text, { color: white, duration: 0.5 });
    });
  });
}
