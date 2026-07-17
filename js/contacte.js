/* ----- INICIALITZACIÓ GLOBAL ----- */
document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    // Setejem fons de color per defecte com a les altres pàgines
    gsap.set(document.body, { backgroundColor: "#aed4ff" });

    // Esperem a que el layout s'assenti abans d'iniciar les animacions
    setTimeout(() => {
      initHeaderAnimations();
      initMobileMenu();
      initHeroAnimations();
      initContactAnimations();
      initSecurity();
      setupFormHandler();
      initCTA();
      initCtaRipple();
    }, 100);
  });
});

/* ----- INICIALITZACIÓ SEGURETAT ASÍNCRONA ----- */
function initSecurity() {
  fetch("php/token.php")
    .then(response => response.json())
    .then(data => {
      // Inyectem token CSRF
      if (data.csrf_token) {
        const csrfInput = document.getElementById("csrfToken");
        if (csrfInput) csrfInput.value = data.csrf_token;
      }
      
      // Carreguem dinàmicament Google reCAPTCHA v3 si hi ha clau pública
      if (data.recaptcha_site_key) {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${data.recaptcha_site_key}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    })
    .catch(err => {
      console.warn("Avís: No s'ha pogut establir la connexió de seguretat amb el servidor per web estàtica.", err);
    });
}

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

/* ----- HERO ENTRANCE ANIMATIONS ----- */
function initHeroAnimations() {
  const titleLine = document.querySelector(".contacte-hero__title-line");
  const subtext = document.querySelector(".contacte-hero__subtext");

  if (!titleLine) return;

  const tl = gsap.timeline();

  const splitTitle = new SplitText(titleLine, { type: "words,chars" });
  tl.from(splitTitle.chars, {
    duration: 0.8,
    opacity: 0,
    rotationX: 90,
    rotationY: (i) => (i % 2 === 0 ? -12 : 12),
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
    ease: "power3.out",
    stagger: { each: 0.035 }
  });

  if (subtext) {
    const splitSubtext = new SplitText(subtext, { type: "lines" });
    gsap.set(splitSubtext.lines, { opacity: 0, y: 15 });
    tl.to(splitSubtext.lines, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3");
  }
}

/* ----- CONTACT SECTION ANIMATIONS ----- */
function initContactAnimations() {
  const infoSection = document.querySelector(".contacte-info");
  const formSection = document.querySelector(".contacte-formulari-wrapper");

  if (!infoSection || !formSection) return;

  // Animació info de contacte
  gsap.fromTo(infoSection,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: infoSection,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animació items de la llista d'info
  const infoItems = document.querySelectorAll(".contacte-info__item");
  gsap.fromTo(infoItems,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: infoSection,
        start: "top 80%"
      }
    }
  );

  // Animació formulari
  gsap.fromTo(formSection,
    { opacity: 0, x: 30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: formSection,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
}

/* ----- MANEJADOR DEL FORMULARI ----- */
function setupFormHandler() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const feedback = form.querySelector(".contacte-form__feedback");
  const submitBtn = form.querySelector(".btn--form-submit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Deshabilitem botó i mostrem estat d'enviament
    submitBtn.setAttribute("disabled", "true");
    const originalText = submitBtn.querySelector(".btn--cta__text").textContent;
    submitBtn.querySelector(".btn--cta__text").textContent = "ENVIANT...";

    const sendFormData = () => {
      const formData = new FormData(form);

      fetch("php/contacte.php", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.removeAttribute("disabled");
        submitBtn.querySelector(".btn--cta__text").textContent = originalText;

        feedback.style.display = "block";
        if (data.ok) {
          form.reset();
          feedback.className = "contacte-form__feedback contacte-form__feedback--success";
          feedback.textContent = data.message || "Gràcies pel teu missatge! Ens posarem en contacte aviat.";
        } else {
          feedback.className = "contacte-form__feedback contacte-form__feedback--error";
          feedback.textContent = data.error || "S'ha produït un error al processar el formulari.";
        }

        gsap.fromTo(feedback,
          { opacity: 0, y: -10, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
        );

        // Amagar missatge després de 8 segons
        setTimeout(() => {
          gsap.to(feedback, {
            opacity: 0,
            y: -10,
            scale: 0.98,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              feedback.style.display = "none";
            }
          });
        }, 8000);
      })
      .catch(error => {
        console.error("Error enviant el formulari:", error);
        submitBtn.removeAttribute("disabled");
        submitBtn.querySelector(".btn--cta__text").textContent = originalText;

        feedback.style.display = "block";
        feedback.className = "contacte-form__feedback contacte-form__feedback--error";
        feedback.textContent = "Error de connexió amb el servidor. Torna-ho a provar.";
        
        gsap.fromTo(feedback, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
      });
    };

    // Google reCAPTCHA v3
    if (typeof grecaptcha !== "undefined") {
      // Intentem obtenir la clau del script carregat
      const siteKeyElement = document.querySelector('script[src*="recaptcha/api.js?render="]');
      let siteKey = "";
      if (siteKeyElement) {
        try {
          const urlParams = new URL(siteKeyElement.src).searchParams;
          siteKey = urlParams.get("render");
        } catch (e) {
          // Fallback manual si hi ha algun problema de parseig de URL
          const srcAttr = siteKeyElement.getAttribute("src");
          const match = srcAttr.match(/render=([^&]+)/);
          if (match) siteKey = match[1];
        }
      }

      if (siteKey) {
        grecaptcha.ready(() => {
          grecaptcha.execute(siteKey, { action: "submit_contact" })
          .then(token => {
            const recaptchaInput = document.getElementById("recaptchaResponse");
            if (recaptchaInput) recaptchaInput.value = token;
            sendFormData();
          })
          .catch(err => {
            console.error("Error executing reCAPTCHA:", err);
            sendFormData(); // Enviem igualment per si hi ha algun bloqueig, el PHP farà la comprovació oportuna
          });
        });
      } else {
        sendFormData();
      }
    } else {
      sendFormData();
    }
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
