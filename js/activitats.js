/* ----- MOCK DATA (En cas que el CMS no estigui disponible) ----- */
const MOCK_ACTIVITIES = [
  {
    id: 1,
    titol: "Taller d'Arròs de l'Empordà",
    categoria: "Taller de cuina",
    data: "2026-07-28T19:00:00Z",
    preu: 65,
    places: 12,
    imatge: [{ url: "https://images.pexels.com/photos/3015488/pexels-photo-3015488.jpeg" }],
    descripcio: "<p>Un viatge gastronòmic a la nostra terra. En aquest taller de 3 hores aprendràs a cuinar diferents tipus d'arrossos de la mà del xef Quim Casellas. Descobrirem el punt ideal de cocció, el secret d'un bon sofregit empordanès i com utilitzar productes de KM 0 per treure el màxim rendiment a cada gra de la varietat local.</p><p>El taller inclou un sopar final amb tots els plats cuinats acompanyats de maridatge de vins de la DO Empordà.</p>"
  },
  {
    id: 2,
    titol: "Showcooking: Cuina de Temporada",
    categoria: "Showcooking",
    data: "2026-08-04T18:30:00Z",
    preu: 45,
    places: 14,
    imatge: [{ url: "https://images.pexels.com/photos/8629107/pexels-photo-8629107.jpeg" }],
    descripcio: "<p>Observa, aprèn i gaudeix. El xef Quim Casellas ens mostrarà les seves tècniques en un showcooking interactiu centrat en els vegetals de temporada de la nostra horta i el peix fresc del port de Palamós. Un recorregut per la cuina de mercat contemporània on es fusionaran receptes clàssiques amb tocs moderns de l'alta gastronomia.</p><p>Es degustaran 4 tapes elaborades al moment i una postra d'autor especialment seleccionada per a l'ocasió.</p>"
  },
  {
    id: 3,
    titol: "Tast de Vins i Formatges de l'Empordà",
    categoria: "Tast i maridatge",
    data: "2026-08-11T20:00:00Z",
    preu: 35,
    places: 15,
    imatge: [{ url: "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg" }],
    descripcio: "<p>Una combinació perfecta de sabors i aromes del nostre territori. En aquesta sessió farem un recorregut a través de 5 formatges artesans locals, des de curats fins a cremosos de cabra, harmonitzats amb una selecció de 5 vins de petits productors de la DO Empordà que destaquen pel seu caràcter singular.</p><p>Guiat per la sommelier del Lab Corbí, aprendràs a analitzar les fases de tast i a trobar l'equilibri perfecte en el maridatge.</p>"
  },
  {
    id: 4,
    titol: "Taller de Pastisseria d'Autor",
    categoria: "Taller de cuina",
    data: "2026-08-20T17:00:00Z",
    preu: 55,
    places: 10,
    imatge: [{ url: "https://images.pexels.com/photos/4110007/pexels-photo-4110007.jpeg" }],
    descripcio: "<p>Endinsa't en la cuina dolça i creativa. Aquest taller està dedicat a aquells apassionats de les postres que volen fer un pas més enllà. Treballarem tècniques de pastisseria moderna, des de mousses amb textures airejades, cruixents d'autor, fins a decoracions espectaculars per donar un acabat professional a les teves creacions dolces.</p><p>Cada participant s'endurà a casa una petita caixa amb les postres elaborades durant la sessió.</p>"
  }
];

/* ----- INICIALITZACIÓ GLOBAL ----- */
document.addEventListener("DOMContentLoaded", () => {
  gsap.set("main", { opacity: 1 });

  document.querySelectorAll(".header__link, .mobile-link").forEach(el => {
    el.style.setProperty("visibility", "visible", "important");
  });

  initMobileMenu();

  document.fonts.ready.then(() => {
    // Setejem fons de color per defecte com a les altres pàgines
    gsap.set(document.body, { backgroundColor: "#aed4ff" });
    initHeaderAnimations();
    initHeroAnimations();
    loadActivities();
    setupModalEvents();
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

/* ----- HERO ENTRANCE ANIMATIONS ----- */
function initHeroAnimations() {
  const titleLine = document.querySelector(".activitats-hero__title-line");
  const subtext = document.querySelector(".activitats-hero__subtext");

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

/* ----- CÀRREGA I RENDER DE DADES DES DE VORACMS ----- */
async function loadActivities() {
  const grid = document.getElementById("activities-grid");
  if (!grid) return;

  // Intentar fer petició a la API de VoraCMS pública
  const res = await getCMSData(`/api/public/${CMS_PROJECT_SLUG}/activitats_aula_gastronomica`);
  let activities = res?.data || [];

  // Ordenem les activitats cronològicament (la més propera primer)
  activities.sort((a, b) => {
    if (!a.data) return 1;
    if (!b.data) return -1;
    return new Date(a.data) - new Date(b.data);
  });

  // Si no hi ha connexió o no s'obtenen dades, usem les de mock
  if (activities.length === 0) {
    console.warn("No s'han obtingut dades del CMS. Usant dades simulades (Mock Data).");
    activities = MOCK_ACTIVITIES;
  }

  // Netegem el spinner de càrrega
  grid.innerHTML = "";

  // Renderitzem les targetes
  activities.forEach((item, index) => {
    const card = createActivityCard(item);
    grid.appendChild(card);

    // Animació d'entrada secuencial (staggered) per a cada targeta
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2 + index * 0.15,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

/* ----- CREACIÓ DE CARD D'ACTIVITAT ----- */
function createActivityCard(item) {
  const card = document.createElement("article");
  card.className = "activity-card";

  // Resoldre la URL de la imatge
  const imgData = item.imatge?.[0];
  const imgUrl = imgData ? getVoraMediaUrl(imgData.formats?.small?.url || imgData.url) : "https://images.pexels.com/photos/8629107/pexels-photo-8629107.jpeg";

  // Formatar data en català (DOEmpordà, 24 de juliol...)
  const dateVal = item.data || item.date || "";
  const formattedDate = dateVal
    ? new Date(dateVal).toLocaleDateString("ca-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
    : "";

  // Netejar tag
  const category = item.categoria || "Activitat";

  // Preu
  const preuStr = item.preu ? `${item.preu} €` : "Gratuït";

  card.innerHTML = `
    <div class="activity-card__img-wrapper">
      <img src="${imgUrl}" alt="${item.titol}" class="activity-card__img" loading="lazy">
      <span class="activity-card__tag">${category}</span>
    </div>
    <div class="activity-card__body">
      <span class="activity-card__date">${formattedDate}</span>
      <h3 class="activity-card__title">${item.titol}</h3>
      <div class="activity-card__footer">
        <button class="btn--reservar btn--reservar-card">Reservar</button>
      </div>
    </div>
  `;

  // Obrir modal al fer clic
  card.addEventListener("click", () => {
    openActivityModal(item);
  });

  return card;
}

/* ----- DIÀLEG MODAL DETALL D'ACTIVITAT ----- */
function openActivityModal(item) {
  const modal = document.getElementById("activity-modal");
  const content = modal.querySelector(".activity-modal__content");

  // Imatge Hero del modal
  const imgData = item.imatge?.[0];
  const imgUrl = imgData ? getVoraMediaUrl(imgData.url) : "https://images.pexels.com/photos/8629107/pexels-photo-8629107.jpeg";

  const dateVal = item.data || item.date || "";
  const formattedDate = dateVal
    ? new Date(dateVal).toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

  const preuStr = item.preu ? `${item.preu} € (+IVA)` : "Gratuït";
  const placesStr = item.places ? `${item.places} places` : "Aforament limitat";

  content.innerHTML = `
    <div class="activity-modal__hero" style="background-image: linear-gradient(to bottom, rgba(40, 60, 91, 0.1), rgba(40, 60, 91, 0.75)), url('${imgUrl}');">
      <span class="activity-modal__tag">${item.categoria || "Activitat"}</span>
      <h2 class="activity-modal__title">${item.titol}</h2>
    </div>
    <div class="activity-modal__body-grid">
      <!-- Columna Principal: Descripció -->
      <div class="activity-modal__main">
        <div class="activity-modal__desc richtext">
          ${item.descripcio || "<p>Sense descripció disponible.</p>"}
        </div>
      </div>
      <!-- Columna Detalls: Reserva -->
      <div class="activity-modal__sidebar">
        <h4 class="activity-modal__sidebar-title">Detalls de l'esdeveniment</h4>
        <ul class="activity-modal__details-list">
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${formattedDate}</span>
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${placesStr}</span>
          </li>
          <li>

            <span class="price-val">${preuStr}</span>
          </li>
        </ul>
        <a href="index.html#contacte" class="btn--cta btn--cta--solid btn--cta--modal">
          <span class="btn--cta__text">RESERVAR PLAÇA</span>
          <span class="btn--cta__fill"></span>
        </a>
      </div>
    </div>
  `;

  // Animació d'obertura del modal
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  gsap.fromTo(modal,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: "power2.out" }
  );

  gsap.fromTo(modal.querySelector(".activity-modal__container"),
    { scale: 0.9, y: 30 },
    { scale: 1, y: 0, duration: 0.45, ease: "back.out(1.2)" }
  );

  // Lligar el botó de reserva del modal per tancar en fer click
  const ctaBtn = content.querySelector(".btn--cta--modal");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      closeActivityModal();
    });

    // Ripple effect como el resto de botones
    const fill = ctaBtn.querySelector(".btn--cta__fill");
    if (fill) {
      ctaBtn.addEventListener("mouseenter", (e) => {
        const rect = ctaBtn.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        gsap.fromTo(fill, { x: relX, y: relY, scale: 0 }, { scale: 50, duration: 4, ease: "power5.in", overwrite: "auto" });
      });

      ctaBtn.addEventListener("mouseleave", (e) => {
        const rect = ctaBtn.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        gsap.to(fill, { x: relX, y: relY, scale: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
      });
    }
  }
}

function closeActivityModal() {
  const modal = document.getElementById("activity-modal");
  if (!modal || modal.getAttribute("aria-hidden") === "true") return;

  const container = modal.querySelector(".activity-modal__container");

  const tl = gsap.timeline({
    onComplete: () => {
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }
  });

  tl.to(container, {
    scale: 0.92,
    y: 20,
    duration: 0.25,
    ease: "power2.in"
  });

  tl.to(modal, {
    opacity: 0,
    duration: 0.25,
    ease: "power2.in"
  }, "-=0.15");
}

function setupModalEvents() {
  const modal = document.getElementById("activity-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".activity-modal__close");
  const overlay = modal.querySelector(".activity-modal__overlay");

  closeBtn.addEventListener("click", () => {
    closeActivityModal();
  });

  overlay.addEventListener("click", () => {
    closeActivityModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeActivityModal();
    }
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

      gsap.to(fill, { x: relX, y: relY, scale: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
    });
  });
}
