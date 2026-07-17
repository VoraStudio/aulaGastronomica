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
    document.body.classList.toggle("no-scroll", isMenuOpen);

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

/* ----- SPACE FEATURES ----- */

function initSpaceFeatures() {
  const section = document.querySelector(".space-features");
  const track = document.querySelector(".space-features__gallery-track");
  if (!section || !track) return;

  const mm = gsap.matchMedia();

  // Header reveal: logo clipPath curtain reveal + badge fade-in
  const logo = document.querySelector(".space-features__logo-img");
  const badge = document.querySelector(".space-features__badge");
  const indicator = document.querySelector(".space-features__scroll-indicator");
  const galleryItems = document.querySelectorAll(".space-features__gallery-item");
  const arrows = document.querySelectorAll(".gallery-arrow");
  gsap.set(arrows, { opacity: 0, scale: 0.8 });
  gsap.set(galleryItems, { opacity: 0, scale: 0.92 });
  gsap.set(indicator, { opacity: 0, y: 20 });
  if (logo) {
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: logo,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
    gsap.set(badge, { opacity: 0, y: 40 });
    headerTl
      .fromTo(
        logo,
        { clipPath: "inset(0% 50% 0% 50%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 2.5, ease: "power4.out" },
      )
      .to(
        badge,
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
        },
        "<0.5",
      )
      // Scroll-indicator text reveal
      .to(
        indicator,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "<0.9",
      )
      // Gallery items stagger reveal
      .to(
        galleryItems,
        {
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 5,
          ease: "power3.out",
        },
        "<",
      )
      // Flechas de navegación
      .to(arrows, {
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
  }

  // Desktop horizontal scroll trigger
  mm.add("(min-width: 48rem)", () => {
    const scrollLength = track.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollLength + 500}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(track, {
      x: -scrollLength,
      ease: "none",
    });

    return () => {
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

    // Swipe Touch Gestures
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let originalTrackX = 0;

    wrapper.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        originalTrackX = gsap.getProperty(track, "x");
        isDragging = true;
      },
      { passive: true },
    );

    wrapper.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        gsap.set(track, { x: originalTrackX + diffX });
      },
      { passive: true },
    );

    wrapper.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = currentX - startX;
      const threshold = 50;

      if (Math.abs(diffX) > threshold) {
        if (diffX < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
      } else {
        goTo(currentIndex);
      }
    });

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

/* ----- CTA SECTION ----- */

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
      start: "top bottom",
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

  buttons.forEach((btn) => {
    const fill = btn.querySelector(".btn--cta__fill");
    if (!fill) return;

    btn.addEventListener("mouseenter", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.fromTo(fill, { x: relX, y: relY, scale: 0 }, { scale: 50, duration: 4, ease: "power5.in", overwrite: "auto" });
    });

    btn.addEventListener("mouseleave", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.to(fill, { x: relX, y: relY, scale: 0, duration: 0.8, ease: "power5.out", overwrite: "auto" });
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

  links.forEach((link) => {
    const textEl = link.querySelector(".intro-details__link-text");
    if (textEl) textEl.style.setProperty("visibility", "visible", "important");
  });

  gsap.set(linkLines, { scaleX: 0, transformOrigin: "left center" });

  const titleSplit = new SplitText(title, { type: "words,chars" });

  const paragraphSplits = Array.from(paragraphs).map((p) => {
    const split = new SplitText(p, { type: "lines" });
    gsap.set(split.lines, { opacity: 0, y: 30 });
    return split;
  });

  const allLines = paragraphSplits.flatMap((s) => s.lines);

  const linkSplits = Array.from(links).map((link) => {
    const textEl = link.querySelector(".intro-details__link-text");
    const split = new SplitText(textEl, { type: "words" });
    gsap.set(split.words, {
      opacity: 0,
      rotationX: -90,
      transformOrigin: "center top",
      transformStyle: "preserve-3d",
    });
    return split;
  });

  const tl = gsap
    .timeline({
      scrollTrigger: {
        trigger: ".intro-details",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    })

    .from(titleSplit.chars, {
      duration: 1.2,
      opacity: 0,
      rotationX: 90,
      rotationY: (i) => (i % 2 === 0 ? -10 : 10),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: "power3.out",
      stagger: { each: 0.03 },
    })
    // Split paragraphs by lines
    .to(
      allLines,
      {
        opacity: 1,
        y: 0,
        stagger: 0.13,
        duration: 0.9,
        ease: "power3.out",
      },
      "<0.9",
    );

  linkSplits.forEach((split, index) => {
    tl.to(
      split.words,
      {
        opacity: 1,
        rotationX: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power3.out",
      },
      index === 0 ? "-=0.4" : "<0.15",
    );
  }, "<");

  tl.to(
    linkLines,
    {
      scaleX: 1,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
    },
    "<",
  );

  // MorphSVG background logo watermark animation
  if (typeof MorphSVGPlugin !== "undefined") {
    gsap.registerPlugin(MorphSVGPlugin);

    const paths = ["#logo-path-1", "#logo-path-2", "#logo-path-3", "#logo-path-4", "#logo-path-5", "#logo-path-6", "#logo-path-7", "#logo-path-8"];

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
            scrub: 1.5,
          },
        });
      }
    });
  }
}

/* ----- PARALLAX SECTION ----- */

function initParallax() {
  const bg = document.querySelector(".parallax-section__bg");
  if (!bg) return;

  gsap.fromTo(bg,
    { yPercent: -30 },
    {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }
  );
}

/* ----- PARALLAX ANIMATIONS ----- */

function initParallaxText() {
  const text = document.querySelector(".parallax-section__text");
  if (!text) return;

  const split = new SplitText(text, { type: "lines" });
  gsap.set(split.lines, { opacity: 0, y: 30 });

  gsap.to(split.lines, {
    opacity: 1,
    y: 0,
    stagger: 0.3,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".parallax-section",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });
}

/* ----- VISTA 360 ANIMATIONS ----- */

function initVista360Animations() {
  const section = document.querySelector(".vista-360");
  const titleLine = document.querySelector(".vista-360__title-line");
  const button = document.querySelector(".vista-360__btn");
  const card = document.querySelector(".vista-360__card-wrapper");
  if (!section || !titleLine) return;

  // Estados iniciales
  gsap.set(button, { opacity: 0, scale: 0.9, y: 15 });
  gsap.set(card, { opacity: 0, scale: 0.9, y: 30 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // 1. Text 3D fan-in (mismo efecto de entrada)
  const split = new SplitText(titleLine, { type: "words,chars" });
  tl.from(split.chars, {
    duration: 0.8,
    opacity: 0,
    rotationX: 90,
    rotationY: (i) => (i % 2 === 0 ? -10 : 10),
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
    ease: "power3.out",
    stagger: { each: 0.015 },
  })
  // 2. Revelado del botón y de la tarjeta 360
  .to(button, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
  .to(card, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");
}

/* ----- TARIFES ANIMATIONS ----- */

function initTarifesAnimations() {
  const section = document.querySelector(".tarifes");
  const titleLine = document.querySelector(".tarifes__title-line");
  const subtitle = document.querySelector(".tarifes__subtitle");
  const button = document.querySelector(".tarifes__btn");
  const tableCard = document.querySelector(".tarifes__table-card");
  const packsCard = document.querySelector(".tarifes__packs-card");
  const bottom = document.querySelector(".tarifes__bottom");
  const footerTitleLine = document.querySelector(".tarifes__footer-title-line");
  const footerText = document.querySelector(".tarifes__footer-text");
  const footerBrand = document.querySelector(".tarifes__footer-brand");
  const footerBtns = document.querySelectorAll(".tarifes__footer-pill-btn");

  if (!section || !titleLine) return;

  // Estados iniciales
  gsap.set(subtitle, { opacity: 0, y: 20 });
  gsap.set(button, { opacity: 0, scale: 0.9, y: 15 });
  gsap.set(tableCard, { opacity: 0, x: -30 });
  gsap.set(packsCard, { opacity: 0, x: 30 });
  gsap.set(bottom, { opacity: 0, y: 20 });
  gsap.set(footerText, { opacity: 0, y: 20 });
  gsap.set(footerBrand, { opacity: 0, y: 15 });
  gsap.set(footerBtns, { opacity: 0, scale: 0.9, y: 10 });

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
    stagger: { each: 0.015 },
  })
  // 2. Subtitle & Button
  .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
  .to(button, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
  // 3. Grid Cards (slide in from sides)
  .to([tableCard, packsCard], { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, "-=0.3")
  // 4. Bottom Info
  .to(bottom, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

  // 5. Inner Footer Animations
  if (footerTitleLine) {
    const footerTitleSplit = new SplitText(footerTitleLine, { type: "words,chars" });
    tl.from(footerTitleSplit.chars, {
      duration: 0.8,
      opacity: 0,
      rotationX: 90,
      rotationY: (i) => (i % 2 === 0 ? -10 : 10),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: "power3.out",
      stagger: { each: 0.012 },
    }, "-=0.2");
  }

  tl.to(footerText, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .to(footerBrand, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
    .to(footerBtns, { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
}

/* ----- INICI ----- */

document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    initHeaderAnimations();
    initMobileMenu();
    initSpaceFeatures();
    initCTA();
    initCtaRipple();

    // intro-details, vista-360 y tarifes al final, después del pin de space-features
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        initParallax();
        initParallaxText();
        initIntroDetails();
        initVista360Animations();
        initTarifesAnimations();
      });
    });
  });
});
