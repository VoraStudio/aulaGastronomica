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

/* ----- HERO GRID CURTAIN REVEAL ----- */

function initHeroGridReveal() {
  const gridItems = document.querySelectorAll(".hero__grid-item");
  if (!gridItems.length) return;

  gsap.to(gridItems, {
    clipPath: "inset(0% 0 0 0)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.inOut",
    delay: 0.6,
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
    const intro = document.querySelector(".intro-services");
    if (!leftItem || !header || !intro) return;

    leftItem.style.overflow = "visible";

    const headerH = header.offsetHeight;
    const rect = leftItem.getBoundingClientRect();
    if (rect.width === 0) return;

    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.max(scaleX, scaleY);
    const y = -rect.top;

    gsap.set(leftItem, { transformOrigin: "50% 0%" });

    // Pin sin spacer para que intro-services quede superpuesto desde el inicio
    const introH = intro.offsetHeight;
    const pinScrollEnd = introH + window.innerHeight;

    const pinST = ScrollTrigger.create({
      trigger: ".hero",
      start: 0,
      end: pinScrollEnd,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        initIntroReveal();
      },
    });

    // Expansión: arranca desde scroll 0, se completa en los primeros 100vh
    const expandTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: 0,
        end: window.innerHeight,
        scrub: 1.5,
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

    // --- Pin sin spacer: intro-services superpuesto desde el inicio ---
    const introEl = document.querySelector(".intro-services");
    const introH = introEl ? introEl.offsetHeight : 0;
    const pinScrollEnd = introH + window.innerHeight;

    const pinST = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `+=${pinScrollEnd}`,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        initIntroReveal();
      },
    });
  });
}

/* ----- INTRO SERVICES SPLIT TEXT REVEAL ----- */

let introRevealed = false;

function initIntroReveal(onComplete) {
  const titleEl = document.querySelector(".intro-services__title");
  const linkTexts = document.querySelectorAll(".intro-services__link-text");
  if (!titleEl || !linkTexts.length) return;
  if (introRevealed) return;
  introRevealed = true;

  // Split title into chars with line masks
  const titleSplit = new SplitText(titleEl, { type: "chars", mask: "lines" });
  gsap.set(titleSplit.chars, {
    opacity: 0,
    y: 60,
    scale: 1.3,
    filter: "blur(10px)",
  });

  // Split each link text into chars with line masks
  const linkSplits = Array.from(linkTexts).map((el) => {
    const split = new SplitText(el, { type: "chars", mask: "lines" });
    gsap.set(split.chars, {
      opacity: 0,
      y: 30,
      scale: 1.2,
      filter: "blur(6px)",
    });
    return split;
  });

  const introTl = gsap.timeline({
    delay: 0.3,
    onComplete: () => {
      if (typeof onComplete === "function") onComplete();
    },
  });

  // Title: scale down + blur clear (efecto gsapAcademy)
  introTl.to(titleSplit.chars, {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    stagger: 0.025,
    duration: 0.8,
    ease: "power3.out",
  });

  // Link 1
  introTl.to(
    linkSplits[0].chars,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.03,
      duration: 0.6,
      ease: "power4.out",
    },
    "-=0.3",
  );

  // Link 2
  introTl.to(
    linkSplits[1].chars,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.03,
      duration: 0.6,
      ease: "power4.out",
    },
    "+=0.1",
  );

  // Link 3
  introTl.to(
    linkSplits[2].chars,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.03,
      duration: 0.6,
      ease: "power4.out",
    },
    "+=0.1",
  );

  // Buffer final
  introTl.to({}, { duration: 1.2 });
}

/* ----- INICI ----- */

document.addEventListener("DOMContentLoaded", () => {
  // Esperamos a que las fuentes de Google carguen para evitar "SplitText called before fonts loaded"
  document.fonts.ready.then(() => {
    initHeroGridReveal();
    initMobileMenu();
    initHeaderAnimations();
    initVideoExpand();
  });
});
