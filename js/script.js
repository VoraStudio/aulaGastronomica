/* ----- INICI SECCIÓ HEADER ANIMATIONS ----- */

gsap.registerPlugin(SplitText);

function initHeaderAnimations() {
  const headerTl = gsap.timeline({ delay: 0.3 });

  headerTl.from(".header__logo", {
    opacity: 0,
    y: 20,
    duration: 1.5,
    ease: "power4.out"
  });

  const navLinks = document.querySelectorAll(".header__link");
  if (navLinks.length) {
    navLinks.forEach(link => link.style.setProperty("visibility", "visible", "important"));
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
      headerTl.from(split.chars, {
        opacity: 0,
        y: 10,
        stagger: 0.05,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.7");
    });
  }

  headerTl.from(".menu-toggle", {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=2.8");
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
  mobileLinks.forEach(link => link.style.setProperty("visibility", "visible", "important"));

  const mobileSplits = Array.from(document.querySelectorAll(".mobile-link")).map(link => {
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
        ease: "power4.out"
      });

      mobileSplits.forEach((split) => {
        tl.fromTo(split.chars, {
          opacity: 0,
          y: 80,
          rotateX: -90
        }, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.03,
          duration: 0.3,
          ease: "power4.out"
        }, ">");
      });
    } else {
      mobileSplits.forEach((split) => {
        tl.to(split.chars, {
          opacity: 0,
          y: -60,
          stagger: 0.01,
          duration: 0.2,
          ease: "power3.in"
        }, 0);
      });

      tl.to(mobileNav, {
        yPercent: -100,
        duration: 0.25,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(mobileNav, { visibility: "hidden" });
          mobileSplits.forEach(split => gsap.set(split.chars, { opacity: 0, y: 80, rotateX: -90 }));
        }
      });
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (isMenuOpen) menuToggle.click();
    });
  });
}

/* ----- INICI ----- */

document.addEventListener("DOMContentLoaded", () => {
  // Esperem que les fonts de Google hagin carregat per evitar "SplitText called before fonts loaded"
  document.fonts.ready.then(() => {
    initMobileMenu();
    initHeaderAnimations();
  });
});
