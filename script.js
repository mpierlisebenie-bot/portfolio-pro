
(() => {
  "use strict";

  const CONTACT_EMAIL = "ethosdesleadersedl@gmail.com";

  const bookSection = document.getElementById("livres");
  const gallerySection = document.getElementById("galerie");
  if (bookSection && gallerySection) {
    bookSection.after(gallerySection);
  }

  // ============================================
  // MENU DE NAVIGATION MOBILE
  // ============================================
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Ouvrir le menu" : "Fermer le menu"
      );

      mainNav.classList.toggle("open", !isOpen);
      document.body.style.overflow = isOpen ? "" : "hidden";
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mainNav.classList.contains("open")
      ) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        document.body.style.overflow = "";
        menuToggle.focus();
      }
    });
  }

  // ============================================
  // ANIMATIONS D'APPARITION
  // ============================================
  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || 0;

            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-visible");

            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealItems.forEach((item, index) => {
      item.dataset.revealDelay = Math.min(index * 80, 400);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // ============================================
  // ANNÉE AUTOMATIQUE DANS LE PIED DE PAGE
  // ============================================
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================
  // TÉLÉCHARGEMENT DE LA FICHE CONTACT
  // ============================================
  const saveContact = document.getElementById("saveContact");

  if (saveContact) {
    saveContact.addEventListener("click", () => {
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:ETHOS DES LEADERS (EDL)",
        "ORG:ETHOS DES LEADERS",
        "TITLE:L'Intelligence des Entreprises",
        "TEL;TYPE=WORK,VOICE:+221761377788",
        "TEL;TYPE=CELL,VOICE:+221708494058",
        "TEL;TYPE=CELL,VOICE:+221782912246",
        "EMAIL;TYPE=WORK:ethosdesleadersedl@gmail.com",
        "EMAIL;TYPE=WORK:coachavoudjigbepierre@outlook.com",
        "NOTE:Contact institutionnel EDL",
        "END:VCARD"
      ].join("\r\n");

      const blob = new Blob([vcard], {
        type: "text/vcard;charset=utf-8"
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "ethos-des-leaders.vcf";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  // ============================================
  // BOUTONS D'APPEL À L'ACTION
  // ============================================
  document.querySelectorAll("[data-inquiry]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = document.getElementById("inquiry");
      const requested = link.getAttribute("data-inquiry");

      if (!select || !requested) return;

      const options = Array.from(select.options);

      const match =
        options.find(
          (option) =>
            option.text.trim().toLowerCase() ===
            requested.trim().toLowerCase()
        ) ||
        options.find((option) =>
          option.text.toLowerCase().includes(requested.toLowerCase())
        );

      if (match) {
        select.value = match.value;
      }
    });
  });

  // ============================================
  // FORMULAIRE DE CONTACT
  // ============================================
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);

      const subject =
        `[EDL] ${String(data.get("inquiry") || "Demande de contact")}`;

      const body = [
        "Bonjour ETHOS DES LEADERS,",
        "",
        `Nom : ${data.get("name") || ""}`,
        `E-mail : ${data.get("email") || ""}`,
        `Organisation : ${data.get("organization") || "Non renseignée"}`,
        `Objet : ${data.get("inquiry") || ""}`,
        "",
        "Message :",
        data.get("message") || "",
        "",
        "Envoyé depuis le site web EDL."
      ].join("\n");

      const submitBtn = form.querySelector(".form-submit");
      const originalText = submitBtn ? submitBtn.innerHTML : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Préparation du message…";
      }

      const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (status) {
        status.textContent =
          "Votre messagerie a été ouverte avec votre demande préremplie.";
      }

      setTimeout(() => {
        window.location.href = mailtoLink;

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 250);
    });
  }

  // ============================================
  // DÉFILEMENT FLUIDE DE LA PAGE
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      let target;

      try {
        target = document.querySelector(targetId);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });

  // ============================================
  // BOUTON RETOUR EN HAUT
  // ============================================
  const backTop = document.querySelector(".back-top");

  if (backTop) {
    const toggleBackTop = () => {
      const visible = window.scrollY > 300;

      backTop.style.opacity = visible ? "1" : "0";
      backTop.style.pointerEvents = visible ? "auto" : "none";
    };

    window.addEventListener("scroll", toggleBackTop, {
      passive: true
    });

    toggleBackTop();

    backTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

  // ============================================
  // ACCESSIBILITÉ : NAVIGATION AU CLAVIER
  // ============================================
  if (!("focusVisible" in document.documentElement)) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        document.documentElement.classList.add("focus-visible");
      }
    });

    document.addEventListener("mousedown", () => {
      document.documentElement.classList.remove("focus-visible");
    });
  }

  // ============================================
  // PRÉCHARGEMENT DES PAGES LÉGALES
  // ============================================
  function preloadOnHover(selector, href) {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          const link = document.createElement("link");

          link.rel = "prefetch";
          link.href = href;

          document.head.appendChild(link);
        },
        { once: true }
      );
    });
  }

  preloadOnHover(
    'a[href="mentions-legales.html"]',
    "mentions-legales.html"
  );

  preloadOnHover(
    'a[href="politique-confidentialite.html"]',
    "politique-confidentialite.html"
  );

})();
