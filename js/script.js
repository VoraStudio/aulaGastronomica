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

function getExpandVars() {
  const container = document.getElementById("expanding-video-container");
  const header = document.querySelector(".header");
  if (!container || !header) return null;

  const headerH = header.offsetHeight;

  // Medidas del layout real (offsetWidth/Height ignoran transform CSS)
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  if (width === 0 || height === 0) return null;

  // Posición real en viewport sin transformaciones CSS
  const savedTransform = container.style.transform;
  container.style.transform = "";
  const rect = container.getBoundingClientRect();
  container.style.transform = savedTransform;

  const scaleX = window.innerWidth / width;
  const scaleY = (window.innerHeight - headerH) / height;
  const scale = Math.max(scaleX, scaleY);

  const x = -rect.left + (width * (scale - 1)) / 2;
  const y = headerH - (rect.top + height) + height * scale;

  return { scale, x, y };
}

function initVideoExpand() {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Mobile: expand the first image
  mm.add("(max-width: 47.999rem)", () => {
    const leftItem = document.querySelector(".hero__grid-item--left");
    const header = document.querySelector(".header");
    if (!leftItem || !header) return;

    leftItem.style.overflow = "visible";

    function getMobileVars() {
      const width = leftItem.offsetWidth;
      const height = leftItem.offsetHeight;
      if (width === 0 || height === 0) return null;

      const savedTransform = leftItem.style.transform;
      leftItem.style.transform = "";
      const rect = leftItem.getBoundingClientRect();
      leftItem.style.transform = savedTransform;

      const scaleX = window.innerWidth / width;
      const scaleY = window.innerHeight / height;
      const scale = Math.max(scaleX, scaleY);
      const y = -rect.top;

      return { scale, y };
    }

    let mobileVars = getMobileVars();
    if (!mobileVars) return;

    gsap.set(leftItem, { transformOrigin: "50% 0%" });

    // Pin: cubre hero + buffer para animación
    const pinScrollEnd = window.innerHeight * 2;

    const pinST = ScrollTrigger.create({
      trigger: ".hero",
      start: 0,
      end: pinScrollEnd,
      pin: true,
      pinSpacing: true,
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
        invalidateOnRefresh: true,
        onRefresh: () => {
          mobileVars = getMobileVars();
        },
        onComplete: () => {
          initIntroScrubSetup();
        },
      },
    });

    expandTl.to(".hero__header, .hero__middle, .hero__badge-wrapper", { opacity: 0, y: -30, duration: 0.3 }, 0);
    expandTl.to(leftItem, { scale: () => mobileVars.scale, y: () => mobileVars.y, borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0);

    // Refrescar en resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  });

  // Desktop: expand center video
  mm.add("(min-width: 48rem)", () => {
    const container = document.getElementById("expanding-video-container");
    const header = document.querySelector(".header");
    if (!container || !header) return;

    container.style.overflow = "visible";

    let expandVars = getExpandVars();
    if (!expandVars) return;

    gsap.set(container, { transformOrigin: "50% 100%" });

    // --- Expansion tween (scrub, sin pin) ---
    const expandTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=100vh",
        scrub: 3,
        invalidateOnRefresh: true,
        onRefresh: () => {
          expandVars = getExpandVars();
        },
      },
    });

    expandTl.to(".hero__grid-item--left, .hero__grid-item--right", { opacity: 0, scale: 0.9, duration: 0.3 }, 0);

    expandTl.to(".hero__header, .hero__middle, .hero__badge-wrapper", { opacity: 0, y: -30, duration: 0.3 }, 0);

    expandTl.to(
      container,
      { scale: () => expandVars.scale, x: () => expandVars.x, y: () => expandVars.y, borderRadius: 0, ease: "power2.inOut", duration: 1 },
      0,
    );

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

    // Refrescar ScrollTrigger tras resize para recalcular expand vars
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
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

function iniciChefName() {
  const nom = document.querySelector(".chef-profile__name");
  const quote = document.querySelector(".chef-profile__quote");
  if (!nom) return;

  const split = new SplitText(nom, { type: "chars, lines" });
  const quoteSplit = new SplitText(quote, { type: "chars" });
  gsap.set(quoteSplit.chars, { opacity: 0 });

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".chef-profile",
      start: "center 60%",
      toggleActions: "play none none reverse",
    },
  });
  tl.from(split.chars, {
    duration: 0.7,
    opacity: 0,
    yPercent: 100,
    clipPath: "inset(0 0 100% 0)",
    ease: "power2.out",
    stagger: { each: 0.1, from: "start" },
  });
  tl.to(
    quoteSplit.chars,
    {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: "power3.out",
      stagger: { each: 0.07, from: "start" },
    },
    "<0.5",
  );
}

/* ----- SPACE FEATURES ----- */

function initSpaceFeatures() {
  const section = document.querySelector(".space-features");
  const track = document.querySelector(".space-features__gallery-track");
  if (!section || !track) return;

  const mm = gsap.matchMedia();

  // Header reveal: logo clipPath curtain reveal
  const logo = document.querySelector(".space-features__logo-img");
  if (logo) {
    gsap.fromTo(logo,
      { clipPath: "inset(0% 50% 0% 50%)", opacity: 0 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: logo,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }

  // Desktop horizontal scroll trigger
  mm.add("(min-width: 48rem)", () => {
    // Calculamos la distancia de scroll total
    const scrollLength = track.scrollWidth - window.innerWidth;

    // Creamos la línea de tiempo de scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollLength + 500}`, // agregamos buffer
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    tl.to(track, {
      x: -scrollLength,
      ease: "none"
    });

    return () => {
      // Limpiamos al destruir el matchMedia
      gsap.set(track, { x: 0 });
    };
  });

  // Mobile: arrow navigation
  mm.add("(max-width: 47.999rem)", () => {
    const wrapper = document.querySelector(".space-features__gallery-wrapper");
    const items = document.querySelectorAll(".space-features__gallery-item");
    const prevBtn = document.querySelector(".gallery-arrow--prev");
    const nextBtn = document.querySelector(".gallery-arrow--next");
    if (!track || !items.length || !prevBtn || !nextBtn) return;

    gsap.set(track, { x: 0 });
    if (wrapper) wrapper.style.overflowX = "hidden";

    let currentIndex = 0;
    const maxIndex = items.length - 1;

    function getSlideWidth() {
      const first = items[0];
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 0;
      return first.offsetWidth + gap;
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const offset = currentIndex * getSlideWidth();
      gsap.to(track, { x: -offset, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      updateButtons();
    }

    function updateButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;
      prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
      nextBtn.style.opacity = currentIndex === maxIndex ? "0.3" : "1";
    }

    prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

    updateButtons();

    // Recalcular en resize
    const onResize = () => {
      const currentOffset = currentIndex * getSlideWidth();
      gsap.set(track, { x: -currentOffset });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (wrapper) wrapper.style.overflowX = "";
      gsap.set(track, { x: 0 });
    };
  });
}

/* ----- CORPORATE ----- */
function initCorporate() {
  const txtCorp = new SplitText(".corporate__title-line", { type: "chars, lines" });
  const tlCorp = gsap.timeline({
    scrollTrigger: {
      trigger: ".corporate-training",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  });
  tlCorp
    .from(txtCorp.chars, {
      opacity: 0,
      duration: 0.3,
      yPercent: 100,
      clipPath: "inset(0 0 100% 0)",
      stagger: 0.05,
      ease: "power3.out",
    })
    .fromTo(
      ".training-banner__pill",
      { opacity: 0, x: 800, skewX: -50 },
      { opacity: 1, x: 0, skewX: -10, stagger: 0.5, duration: 0.8, ease: "elastic.out", clearProps: "transform" },
    );
}

/* ----- ACTIVITIES ----- */
function initActivities() {
  const section = document.querySelector(".activities");
  const titleLines = document.querySelectorAll(".activities__title-line");
  const imageWrapper = document.querySelector(".activities__image-wrapper");
  const texts = document.querySelectorAll(".activities__text");
  if (!section || !titleLines.length || !imageWrapper) return;

  // Estados iniciales
  gsap.set(imageWrapper, { clipPath: "inset(0 100% 0 0)" });
  gsap.set(texts, { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  // 1. Reveal image
  tl.to(imageWrapper, { clipPath: "inset(0 0% 0 0%)", duration: 1.2, ease: "power3.inOut" });

  // 2. Title: 3D fan-in
  titleLines.forEach((line, index) => {
    const split = new SplitText(line, { type: "words,chars" });
    tl.from(
      split.chars,
      {
        duration: 0.8,
        opacity: 0,
        rotationX: 90,
        rotationY: (i) => (i % 2 === 0 ? -10 : 10),
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        ease: "power3.out",
        stagger: { each: 0.03 },
      },
      index === 0 ? "-=0.8" : "<0.1"
    );
  });

  // 3. Paragraphs reveal
  tl.to(texts, {
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.4");
}

/* ----- CTA ----- */
function initCTA() {
  const section = document.querySelector(".cta");
  const titleLine = document.querySelector(".cta__title-line");
  const text = document.querySelector(".cta__text");
  const buttons = document.querySelectorAll(".btn--cta");
  const footerLogo = document.querySelector(".cta__footer-logo");
  const footerBtns = document.querySelectorAll(".cta__footer-btn");
  if (!section || !titleLine || !text) return;

  // Estados iniciales
  gsap.set(text, { opacity: 0, y: 30 });
  gsap.set(buttons, { opacity: 0, scale: 0.9 });
  gsap.set(footerLogo, { opacity: 0, y: 20 });
  gsap.set(footerBtns, { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // 1. Title: 3D fan-in
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

  // 2. Paragraph reveal
  tl.to(text, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
    // 3. Buttons reveal
    .to(buttons, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
    // 4. Footer reveal
    .to(footerLogo, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
    .to(footerBtns, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }, "<0.1");
}

/* ----- RIPPLE BTN ----- */
function initCtaRipple() {
  const buttons = document.querySelectorAll(".btn--cta");
  if (!buttons.length) return;

  const style = getComputedStyle(document.documentElement);
  const white = style.getPropertyValue("--blanco").trim();
  const darkBlue = style.getPropertyValue("--azul-oscuro").trim();

  buttons.forEach((btn) => {
    const fill = btn.querySelector(".btn--cta__fill");
    const text = btn.querySelector(".btn--cta__text");
    if (!fill || !text) return;

    btn.addEventListener("mouseenter", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.fromTo(fill, { x: relX, y: relY, scale: 0 }, { scale: 50, duration: 4, ease: "power5.in", overwrite: "auto" });
      gsap.to(text, { color: white, duration: 0.8, overwrite: "auto" });
    });

    btn.addEventListener("mouseleave", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.to(fill, { scale: 0, x: relX, y: relY, duration: 0.8, ease: "power5.out", overwrite: "auto" });
      gsap.to(text, { color: darkBlue, duration: 0.8, overwrite: "auto" });
    });
  });
}

/* ----- INTRO DETAILS ----- */
function initIntroDetails() {
  const section = document.querySelector(".intro-details");
  const title = document.querySelector(".intro-details__title");
  const paragraphs = document.querySelectorAll(".intro-details__text");
  const links = document.querySelectorAll(".intro-details__link");
  const linkLines = document.querySelectorAll(".intro-details__line");
  if (!section || !title || !paragraphs.length) return;

  links.forEach(link => {
    const textEl = link.querySelector(".intro-details__link-text");
    if (textEl) textEl.style.setProperty("visibility", "visible", "important");
  });

  gsap.set(paragraphs, { opacity: 0, y: 30 });
  gsap.set(linkLines, { scaleX: 0, transformOrigin: "left center" });

  const titleSplit = new SplitText(title, { type: "words,chars" });
  gsap.set(titleSplit.chars, { opacity: 0, y: 20 });

  const linkSplits = Array.from(links).map((link) => {
    const textEl = link.querySelector(".intro-details__link-text");
    const split = new SplitText(textEl, { type: "words" });
    gsap.set(split.words, {
      opacity: 0,
      rotationX: -90,
      transformOrigin: "top center",
      transformStyle: "preserve-3d"
    });
    return split;
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });

  tl.to(titleSplit.chars, {
    opacity: 1,
    y: 0,
    stagger: 0.02,
    duration: 0.6,
    ease: "power3.out"
  });

  tl.to(paragraphs, {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.4");

  linkSplits.forEach((split, index) => {
    tl.to(split.words, {
      opacity: 1,
      rotationX: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out"
    }, index === 0 ? "-=0.4" : "<0.15");
  });

  tl.to(linkLines, {
    scaleX: 1,
    stagger: 0.1,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.3");

  // MorphSVG background logo watermark animation
  if (typeof MorphSVGPlugin !== "undefined") {
    gsap.registerPlugin(MorphSVGPlugin);

    const paths = [
      "#logo-path-1",
      "#logo-path-2",
      "#logo-path-3",
      "#logo-path-4",
      "#logo-path-5",
      "#logo-path-6",
      "#logo-path-7",
      "#logo-path-8"
    ];

    paths.forEach((pathId, idx) => {
      const targetId = `#wave-target-${idx + 1}`;
      const pathEl = document.querySelector(pathId);
      const targetEl = document.querySelector(targetId);

      if (pathEl && targetEl) {
        gsap.to(pathEl, {
          morphSVG: targetId,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
          }
        });
      }
    });
  }
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
    iniciChefName();
    initIntroDetails();
    initSpaceFeatures();
    initCorporate();
    initActivities();
    initCTA();
    initCtaRipple();
  });
});
