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
      const isSolid = btn.classList.contains("btn--cta--solid");

      gsap.to(fill, { scale: 0, x: relX, y: relY, duration: 0.8, ease: "power5.out", overwrite: "auto" });
      gsap.to(text, { color: isSolid ? white : darkBlue, duration: 0.8, overwrite: "auto" });
    });
  });
}

/* ----- LAB CORBÍ ANIMATIONS ----- */
function initLabCorbiAnimations() {
  const main = document.querySelector(".lab-corbi");
  const brandIcons = document.querySelectorAll(".lab-corbi__brand-icon");
  const titleLine = document.querySelector(".lab-corbi__title-line");
  const subtitle = document.querySelector(".lab-corbi__subtitle");

  const imgChef = document.querySelector(".lab-corbi__img-wrapper--chef");
  const imgKitTop = document.querySelector(".lab-corbi__img-wrapper--kitchen-top");
  const imgKitBot = document.querySelector(".lab-corbi__img-wrapper--kitchen-bottom");
  const textParagraph = document.querySelector(".lab-corbi__paragraph");

  if (!main) return;

  let splitText;
  if (textParagraph) {
    splitText = new SplitText(textParagraph, { type: "lines" });
  }

  gsap.set(brandIcons, { opacity: 0, scale: 0.8, rotation: -10 });
  gsap.set(subtitle, { opacity: 0, y: 20 });
  gsap.set(imgChef, { opacity: 0, x: -50, scale: 0.95 });
  gsap.set(imgKitTop, { opacity: 0, y: -40, scale: 0.95 });
  gsap.set(imgKitBot, { opacity: 0, y: 50, scale: 0.95 });
  if (splitText) {
    gsap.set(splitText.lines, { opacity: 0, y: 30 });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: main,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  if (titleLine) {
    const split = new SplitText(titleLine, { type: "words,chars" });
    tl.from(split.chars, {
      duration: 0.8,
      opacity: 0,
      rotationX: 90,
      rotationY: (i) => (i % 2 === 0 ? -12 : 12),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: "power3.out",
      stagger: { each: 0.025 },
    });
  }

  tl.to(brandIcons, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.5)" }, "-=0.3");

  tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .to(imgChef, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power4.out" }, "-=0.4")
    .to(imgKitTop, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }, "-=0.6");

  if (splitText) {
    tl.to(splitText.lines, { opacity: 1, y: 0, stagger: 0.3, duration: 0.8, ease: "power3.out" }, "-=0.3");
  }
  tl.to(imgKitBot, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }, "-=0.5");
}

function initLabCorbiHighlight() {
  const section = document.querySelector(".lab-corbi-highlight");
  const text = document.querySelector(".lab-corbi-highlight__text");
  if (!section || !text) return;

  const splitBody = new SplitText(text, { type: "words", wordsClass: "word" });
  gsap.set(splitBody.words, { opacity: 0.1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: window.innerWidth < 800 ? "top 85%" : "top 45%",
      end: "center 50%",
      scrub: 0.8,
    },
  });

  tl.to(splitBody.words, {
    opacity: 1,
    stagger: 1,
    ease: "none",
  });
}

function initLabCorbiPoly() {
  const section = document.querySelector(".lab-corbi-poly");
  const titleLine = document.querySelector(".lab-corbi-poly__title-line");
  const text = document.querySelector(".lab-corbi-poly__text");
  const listItems = document.querySelectorAll(".lab-corbi-poly__list li");
  const btn = document.querySelector(".lab-corbi-poly__btn-wrapper");
  const images = document.querySelectorAll(".lab-corbi-poly__img-wrapper");

  if (!section) return;

  gsap.fromTo(document.body,
    { backgroundColor: "#aed4ff" },
    {
      backgroundColor: "#faf6eaff",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    }
  );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  if (btn) {
    gsap.set(btn, { opacity: 0, y: 20 });
  }

  let splitText;
  if (text) {
    splitText = new SplitText(".lab-corbi-poly__text", { type: "lines" });
    gsap.set(splitText.lines, { opacity: 0, y: 20 });
  }
  if (listItems.length > 0) {
    gsap.set(listItems, { opacity: 0, y: 15, "--border-scale": 0 });
  }

  if (titleLine) {
    const splitTitle = new SplitText(titleLine, { type: "words,chars" });
    tl.from(splitTitle.chars, {
      duration: 0.8,
      opacity: 0,
      rotationX: 90,
      rotationY: (i) => (i % 2 === 0 ? -12 : 12),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: "power3.out",
      stagger: { each: 0.025 },
    });
  }

  const isMobile = window.innerWidth < 800;

  tl.addLabel("imagesStart");

  if (images.length > 0) {
    tl.to(
      images,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
        ease: "power3.inOut",
      },
      "imagesStart-=0.4",
    );
  }

  if (splitText) {
    tl.to(
      splitText.lines,
      {
        opacity: 1,
        y: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=1.6",
    );
  }

  if (listItems.length > 0) {
    tl.to(
      listItems,
      {
        opacity: 1,
        y: 0,
        "--border-scale": 1,
        stagger: 0.25,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4",
    );
  }

  // Animate button: early for mobile (alongside images), late for desktop (at the end)
  if (btn) {
    const btnPosition = isMobile ? "imagesStart+=0.9" : "-=0.4";
    tl.to(
      btn,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      },
      btnPosition,
    );
  }
}

function initLabCorbiCreacio() {
  const section = document.querySelector(".lab-corbi-creacio");
  const titleLines = document.querySelectorAll(".lab-corbi-creacio__title-line");
  const text = document.querySelector(".lab-corbi-creacio__text");
  const subtext = document.querySelector(".lab-corbi-creacio__subtext");
  const listItems = document.querySelectorAll(".lab-corbi-creacio__list li");
  const image = document.querySelector(".lab-corbi-creacio__img-wrapper");

  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  let splitText, splitSubtext, splitList;

  if (text) {
    splitText = new SplitText(text, { type: "lines" });
    gsap.set(splitText.lines, { opacity: 0, y: 20 });
  }

  if (subtext) {
    splitSubtext = new SplitText(subtext, { type: "lines" });
    gsap.set(splitSubtext.lines, { opacity: 0, y: 20 });
  }

  if (listItems.length > 0) {
    gsap.set(listItems, { opacity: 0, y: 20 });
  }

  if (titleLines.length > 0) {
    titleLines.forEach((line) => {
      const splitTitle = new SplitText(line, { type: "words,chars" });
      tl.from(
        splitTitle.chars,
        {
          duration: 0.8,
          opacity: 0,
          rotationX: 90,
          rotationY: (i) => (i % 2 === 0 ? -12 : 12),
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          ease: "power3.out",
          stagger: { each: 0.025 },
        },
        "-=0.6",
      );
    });
  }

  tl.addLabel("contentStart", "-=0.4");

  if (image) {
    tl.to(
      image,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
        ease: "power3.inOut",
      },
      "contentStart",
    );
  }

  if (splitText) {
    tl.to(
      splitText.lines,
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      },
      "contentStart+=0.2",
    );
  }

  if (splitSubtext) {
    tl.to(
      splitSubtext.lines,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    );
  }

  if (listItems.length > 0) {
    tl.to(
      listItems,
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.3",
    );
  }
}

function initLabCorbiTarifes() {
  const section = document.querySelector(".lab-corbi-tarifes");
  const textHighlight = document.querySelector(".lab-corbi-tarifes__text-highlight");
  const text = document.querySelector(".lab-corbi-tarifes__text");
  const btn = document.querySelector(".lab-corbi-tarifes__btn-wrapper");
  const items = document.querySelectorAll(".lab-corbi-tarifes__item");
  const footerText = document.querySelector(".lab-corbi-tarifes__footer p");

  if (!section) return;

  // 1. Animación de cambio de color del fondo del body
  gsap.fromTo(document.body,
    { backgroundColor: "#faf6eaff" },
    {
      backgroundColor: "#aed4ff",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    }
  );

  // 2. Timeline para las animaciones internas de entrada
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  let splitHighlight, splitText, splitFooter;

  if (textHighlight) {
    splitHighlight = new SplitText(textHighlight, { type: "lines" });
    gsap.set(splitHighlight.lines, { opacity: 0, y: 20 });
  }

  if (text) {
    splitText = new SplitText(text, { type: "lines" });
    gsap.set(splitText.lines, { opacity: 0, y: 20 });
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
      gsap.set(item, { "--border-scale": 0 });
    });
  }

  if (footerText) {
    splitFooter = new SplitText(footerText, { type: "lines" });
    gsap.set(splitFooter.lines, { opacity: 0, y: 15 });
  }

  // Ejecución de la animación en el Timeline
  if (splitHighlight) {
    tl.to(
      splitHighlight.lines,
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }

  if (splitText) {
    tl.to(
      splitText.lines,
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4"
    );
  }

  if (btn) {
    tl.to(
      btn,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    );
  }

  // Animación en cascada de los items de la lista
  if (items.length > 0) {
    items.forEach((item, index) => {
      const info = item.querySelector(".lab-corbi-tarifes__item-info");
      const action = item.querySelector(".lab-corbi-tarifes__item-action");
      
      tl.addLabel(`itemStart_${index}`, index === 0 ? "-=0.3" : ">-0.1");

      tl.to(
        item,
        {
          "--border-scale": 1,
          duration: 0.6,
          ease: "power3.out",
        },
        `itemStart_${index}`
      );

      if (info) {
        tl.to(
          info,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          `itemStart_${index}`
        );
      }

      if (action) {
        tl.to(
          action,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          `itemStart_${index}`
        );
      }
    });
  }

  if (splitFooter) {
    tl.to(
      splitFooter.lines,
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.2"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    gsap.set(document.body, { backgroundColor: "#aed4ff" });
    // Damos un pequeño margen para que la rejilla CSS y el layout responsive se asienten antes de inicializar SplitText y ScrollTrigger.
    setTimeout(() => {
      initHeaderAnimations();
      initMobileMenu();
      initCTA();
      initCtaRipple();
      initLabCorbiAnimations();
      initLabCorbiHighlight();
      initLabCorbiPoly();
      initLabCorbiCreacio();
      initLabCorbiTarifes();
    }, 100);
  });
});
