/* ----- INICI SECCIÓ HEADER ANIMATIONS ----- */

gsap.registerPlugin(SplitText);

function initHeaderAnimations() {
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

/* ----- INICI SECCIÓ MENÚ HAMBURGUESA ----- */

function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  let isMenuOpen = false;

  // Estat inicial: amunt fora de pantalla
  gsap.set(mobileNav, { yPercent: -100 });

  // Forcem visibilitat per sobre del FOUC prevention abans que GSAP capture res
  mobileLinks.forEach((link) => link.style.setProperty("visibility", "visible", "important"));

  const mobileSplits = Array.from(document.querySelectorAll(".mobile-link")).map((link) => {
    const text = link.textContent.trim();
    link.innerHTML = `
      <div class="split-mask">
        <span class="txt-original">${text}</span>
      </div>
    `;
    const split = new SplitText(link.querySelector(".txt-original"), { type: "chars, lines", mask: "lines" });
    // Estat inicial dels chars: invisible, preparats per l'fromTo
    gsap.set(split.chars, { opacity: 0, y: 80, rotateX: -90 });
    return split;
  });

  menuToggle.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle("is-active");
    mobileNav.classList.toggle("is-open");

    const tl = gsap.timeline();

    if (isMenuOpen) {
      gsap.set(mobileNav, { visibility: "visible" });

      tl.to(mobileNav, {
        yPercent: 0,
        duration: 0.35,
        ease: "power4.out",
      });

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
    } else {
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

      tl.to(mobileNav, {
        yPercent: -100,
        duration: 0.25,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(mobileNav, { visibility: "hidden" });
          mobileSplits.forEach((split) => gsap.set(split.chars, { opacity: 0, y: 80, rotateX: -90 }));
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

/* ----- HERO TITLE 3D EFFECTS ----- */

function initHeroTitle3D() {
  const titleLines = document.querySelectorAll(".hero__title-line");
  const subtitle = document.querySelector(".hero__subtitle");
  if (!titleLines.length || !subtitle) return;

  const tl = gsap.timeline({ delay: 0.5 });

  // [04] Abanico 3D: Rotación Dual (Ejes X/Y) — modo Inferior
  // rotationX: 90 + rotationY alternado (-15/15) con stagger
  titleLines.forEach((line) => {
    const split = new SplitText(line, { type: "chars" });

    tl.from(
      split.chars,
      {
        duration: 1.2,
        opacity: 0,
        rotationX: 90,
        rotationY: (i) => (i % 2 === 0 ? -15 : 15),
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        ease: "power2.out",
        stagger: { each: 0.09, from: "start" },
      },
      "<",
    );
  });

  // [03] Despliegue Cinemático 3D (Ejes X/Y) — modo Inferior
  // rotationX: 90 con transformOrigin "bottom center"
  const subSplit = new SplitText(subtitle, { type: "lines" });

  gsap.set(subSplit.lines, {
    opacity: 0,
    rotationX: 90,
    transformOrigin: "bottom center",
  });

  tl.to(
    subSplit.lines,
    {
      duration: 2.5,
      opacity: 1,
      rotationX: 0,
      ease: "power3.out",
      stagger: { each: 0.15, from: "start" },
    },
    "<0.8",
  );
}

/* ----- HERO GRID CURTAIN REVEAL ----- */

function initHeroGridReveal() {
  const gridItems = document.querySelectorAll(".hero__grid-item");
  if (!gridItems.length) return;

  gsap.to(gridItems, {
    clipPath: "inset(0% 0 0 0)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.inOut",
    delay: 0.8,
  });
}

/* ----- EXPANDING VIDEO ----- */

function initVideoExpand() {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Mobile: expand the first image
  mm.add("(max-width: 47.999rem)", () => {
    const leftItem = document.querySelector(".hero__grid-item--left");
    const header = document.querySelector(".header");
    if (!leftItem || !header) return;

    leftItem.style.overflow = "visible";

    const headerH = header.offsetHeight;
    const rect = leftItem.getBoundingClientRect();
    if (rect.width === 0) return;

    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.max(scaleX, scaleY);
    const y = -rect.top;

    gsap.set(leftItem, { transformOrigin: "50% 0%" });

    // Pin: cubre hero + buffer para animación
    const pinScrollEnd = window.innerHeight * 2;

    const pinST = ScrollTrigger.create({
      trigger: ".hero",
      start: 0,
      end: pinScrollEnd,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    // Expansión: arranca desde scroll 0, se completa en los primeros 100vh
    const expandTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: 0,
        end: window.innerHeight,
        scrub: 1.5,
        onComplete: () => {
          initIntroScrubSetup();
        },
      },
    });

    expandTl.to(".hero__header, .hero__middle, .hero__badge-wrapper", { opacity: 0, y: -30, duration: 0.3 }, 0);
    expandTl.to(leftItem, { scale, y, borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0);
  });

  // Desktop: expand center video
  mm.add("(min-width: 48rem)", () => {
    const container = document.getElementById("expanding-video-container");
    const header = document.querySelector(".header");
    if (!container || !header) return;

    container.style.overflow = "visible";

    const headerH = header.offsetHeight;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) return;

    const scaleX = window.innerWidth / rect.width;
    const scaleY = (window.innerHeight - headerH) / rect.height;
    const scale = Math.max(scaleX, scaleY);

    // With transformOrigin at bottom-center, the video expands upward
    const x = -rect.left + (rect.width * (scale - 1)) / 2;
    const y = headerH - (rect.top + rect.height) + rect.height * scale;

    gsap.set(container, { transformOrigin: "50% 100%" });

    // --- Expansion tween (scrub, sin pin) ---
    const expandTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=100vh",
        scrub: 3,
      },
    });

    expandTl.to(".hero__grid-item--left, .hero__grid-item--right", { opacity: 0, scale: 0.9, duration: 0.3 }, 0);

    expandTl.to(".hero__header, .hero__middle, .hero__badge-wrapper", { opacity: 0, y: -30, duration: 0.3 }, 0);

    expandTl.to(container, { scale, x, y, borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0);

    // --- Pin: cubre expansión + reveal ---
    const pinScrollEnd = window.innerHeight + 1200;

    heroDesktopPin = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `+=${pinScrollEnd}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  });
}

/* ----- HERO MIDDLE ENTRADA + SALIDA ----- */
function initHeroMiddleEffects() {
  const badge = document.querySelector(".hero__badge");
  const badgeText = document.querySelector(".hero__badge-text");
  const buttons = document.querySelectorAll(".hero__actions .btn");
  if (!badge || !buttons.length) return;

  // Activar will-change només per l'entrada
  badge.style.willChange = "transform";
  buttons.forEach((btn) => (btn.style.willChange = "transform"));

  // Estat inicial: tot invisible, preparat per l'entrada
  gsap.set(badge, { opacity: 0, scale: 0.85, y: 20 });

  // SplitText del badge ANTES de animar
  let badgeSplit = null;
  if (badgeText) {
    badgeSplit = new SplitText(badgeText, { type: "chars" });
    gsap.set(badgeSplit.chars, { opacity: 0, y: 15, rotationZ: -3 });
  }

  const tl = gsap.timeline({
    onComplete: () => {
      // Netejar will-change de l'entrada
      badge.style.willChange = "auto";
      buttons.forEach((btn) => (btn.style.willChange = "auto"));
      // Forçar ScrollTrigger a re-llegir valors post-entrada
      ScrollTrigger.refresh();
    },
  });

  // Badge: escala + desplaçament + opacitat
  tl.to(badge, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  // Text del badge: caràcters escalonats
  if (badgeSplit) {
    tl.to(
      badgeSplit.chars,
      {
        opacity: 1,
        y: 0,
        rotationZ: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.4",
    );
  }

  // Botons: escalonats des de baix
  tl.to(
    buttons,
    {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.6,
      ease: "lineal",
    },
    "-=0.2",
  );
}

/* ----- INTRO SERVICES REVEAL (timeline + toggleActions restart) ----- */

let introSplits = null;
let heroDesktopPin = null;

function initIntroScrubSetup() {
  const titleEl = document.querySelector(".hero__intro-title");
  const linkTexts = document.querySelectorAll(".hero__intro-link-text");
  if (!titleEl || !linkTexts.length) return;

  const titleSplit = new SplitText(titleEl, { type: "lines", mask: "lines" });
  gsap.set(titleSplit.lines, {
    opacity: 0,
    rotationX: -90,
    rotationY: 0,
    transformOrigin: "top center",
    transformStyle: "preserve-3d",
  });

  const linkSplits = Array.from(linkTexts).map((el) => {
    const split = new SplitText(el, { type: "words", mask: "lines" });
    gsap.set(split.words, {
      opacity: 0,
      rotationX: -90,
      rotationY: 0,
      transformOrigin: "top center",
      transformStyle: "preserve-3d",
    });
    return split;
  });

  // Show container (opacity: 0 en CSS para evitar flash)
  gsap.set(".hero__intro-bottom", { opacity: 1 });

  introSplits = { titleSplit, linkSplits, allLinkWords: linkSplits.flatMap((s) => s.words) };

  // Create the ScrollTrigger + timeline after layout settles
  requestAnimationFrame(() => createIntroReveal());
}

function createIntroReveal() {
  if (!introSplits) return;

  const heroEl = document.querySelector(".hero");
  if (!heroEl) return;

  const heroTop = heroEl.offsetTop;
  const expansionEnd = heroTop + window.innerHeight;

  const { titleSplit, allLinkWords } = introSplits;

  // Timeline pausada — ScrollTrigger la controla
  const introTl = gsap.timeline({
    paused: true,
  });
  const linesLink = document.querySelectorAll(".hero__intro-line");
  gsap.set(linesLink, { opacity: 0 });

  introTl
    .to(
      titleSplit.lines,
      {
        duration: 3,
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        ease: "power3.out",
        stagger: { each: 0.2, from: "center" },
      },
      "-=1.5",
    )
    .to(
      allLinkWords,
      {
        duration: 1.4,
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        ease: "power3.out",
        stagger: { each: 0.1, from: "start" },
      },
      "<.5",
    )
    .to(linesLink, { duration: 1, opacity: 1, stagger: { each: 0.2, from: "center" } }, "<")
    .to(linesLink, { duration: 5 }, ">");

  ScrollTrigger.create({
    trigger: heroEl,
    start: expansionEnd,
    end: expansionEnd + 1,
    toggleActions: "restart none none reset",
    animation: introTl,
  });
}

/* ----- INICI ----- */

document.addEventListener("DOMContentLoaded", () => {
  // Esperamos a que las fuentes de Google carguen para evitar "SplitText called before fonts loaded"
  document.fonts.ready.then(() => {
    initHeroGridReveal();
    initHeroTitle3D();
    initVideoExpand();
    initIntroScrubSetup();
    initHeroMiddleEffects();
    initMobileMenu();
    initHeaderAnimations();
  });
});
