/* ----- INICIALITZACIÓ GLOBAL ----- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".header__link, .mobile-link").forEach(el => {
    el.style.setProperty("visibility", "visible", "important");
  });

  initMobileMenu();

  document.fonts.ready.then(() => {
    gsap.set(document.body, { backgroundColor: "#ffffff" });
    initHeaderAnimations();
    initTarifesAnimations();
    initLabCorbiTarifes();
    initCTA();
    initCtaRipple();
  });
});

/* ----- HEADER ANIMATIONS ----- */
function initHeaderAnimations() {
  gsap.registerPlugin(SplitText);
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

  gsap.set(mobileNav, { yPercent: -100 });
  mobileLinks.forEach((link) => link.style.setProperty("visibility", "visible", "important"));

  const mobileSplits = Array.from(document.querySelectorAll(".mobile-link")).map((link) => {
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

/* ----- TARIFES ANIMATIONS (L'Espai) ----- */
function initTarifesAnimations() {
  const section = document.querySelector(".tarifes");
  const titleLine = document.querySelector(".tarifes__title-line");
  const subtitle = document.querySelector(".tarifes__subtitle");
  const button = document.querySelector(".tarifes__btn");
  const tableCard = document.querySelector(".tarifes__table-card");
  const packsCard = document.querySelector(".tarifes__packs-card");
  const bottom = document.querySelector(".tarifes__bottom");

  if (!section || !titleLine) return;

  gsap.set(subtitle, { opacity: 0, y: 20 });
  gsap.set(button, { opacity: 0, scale: 0.9, y: 15 });
  gsap.set(tableCard, { opacity: 0, x: -30 });
  gsap.set(packsCard, { opacity: 0, x: 30 });
  gsap.set(bottom, { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

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
  .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
  .to(button, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
  .to([tableCard, packsCard], { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, "-=0.3")
  .to(bottom, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
}

/* ----- LAB CORBÍ TARIFES ANIMATIONS ----- */
function initLabCorbiTarifes() {
  const section = document.querySelector(".lab-corbi-tarifes");
  const heading = document.querySelector(".lab-corbi-tarifes__heading");
  const textHighlight = document.querySelector(".lab-corbi-tarifes__text-highlight");
  const btn = document.querySelector(".lab-corbi-tarifes__btn-wrapper");
  const items = document.querySelectorAll(".lab-corbi-tarifes__item");
  const footerText = document.querySelector(".lab-corbi-tarifes__footer p");

  if (!section) return;

  // Body color transition: de crema a azul claro al llegar a la sección
  gsap.fromTo(
    document.body,
    { backgroundColor: "#ffffff" },
    {
      backgroundColor: "#aed4ff",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    },
  );

  // Timeline para animaciones internas
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // Heading animation (3D fan-in like tarifes title)
  if (heading) {
    const splitHeading = new SplitText(heading, { type: "words,chars" });
    tl.from(splitHeading.chars, {
      duration: 0.8,
      opacity: 0,
      rotationX: 90,
      rotationY: (i) => (i % 2 === 0 ? -10 : 10),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: "power3.out",
      stagger: { each: 0.015 },
    });
  }

  let splitHighlight, splitFooter;

  if (textHighlight) {
    splitHighlight = new SplitText(textHighlight, { type: "lines" });
    gsap.set(splitHighlight.lines, { opacity: 0, y: 20 });
  }

  if (btn) {
    gsap.set(btn, { opacity: 0, scale: 0.9, y: 10 });
  }

  if (items.length > 0) {
    items.forEach((item) => {
      const info = item.querySelector(".lab-corbi-tarifes__item-info");
      const action = item.querySelector(".lab-corbi-tarifes__item-action");
      if (info) gsap.set(info, { opacity: 0, x: -20 });
      if (action) gsap.set(action, { opacity: 0, x: 20 });
    });
  }

  if (footerText) {
    splitFooter = new SplitText(footerText, { type: "lines" });
    gsap.set(splitFooter.lines, { opacity: 0, y: 15 });
  }

  if (splitHighlight) {
    tl.to(splitHighlight.lines, {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  if (btn) {
    tl.to(btn, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4");
  }

  if (items.length > 0) {
    items.forEach((item, index) => {
      const info = item.querySelector(".lab-corbi-tarifes__item-info");
      const action = item.querySelector(".lab-corbi-tarifes__item-action");

      tl.addLabel(`itemStart_${index}`, index === 0 ? "-=0.3" : ">-0.1");

      if (info) {
        tl.to(info, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, `itemStart_${index}`);
      }

      if (action) {
        tl.to(action, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, `itemStart_${index}`);
      }
    });
  }

  if (splitFooter) {
    tl.to(splitFooter.lines, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, "-=0.2");
  }
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

  tl.to(text, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
    .to(buttons, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
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
