/**
 * ==========================================================================
 * ADITYA KUMAR - GRAPHIC DESIGNER PORTFOLIO JAVASCRIPT
 * 100% Crash-Proof & Independent Version
 * ==========================================================================
 */

// 1. CONFIGURATION
const CONFIG = {
  whatsappNumber: "+916388004937", 
  whatsappMessage: "Hi Aditya, I saw your portfolio and would like to discuss a design project!",
  instagramUrl: "https://instagram.com/design.with_adi",
  linkedinUrl: "https://linkedin.com/in/YOUR_USERNAME",
  behanceUrl: "https://behance.net/adityakumar723",
  developerCreditName: "Aditya Kumar"
};

document.addEventListener("DOMContentLoaded", () => {
  // Safe GSAP registration (अगर CDN लोड न भी हो तो क्रैश नहीं होगा)
  try {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  } catch (e) {
    console.warn("GSAP plugin registration skipped:", e);
  }

  // 1. सबसे पहले Menu और Slider चलाएं (ताकि कोई और कोड इन्हें न रोक सके)
  setupNavigationDrawer();
  setupWorkSlider();

  // 2. इसके बाद बाकी चीज़ें लोड करें
  setupPlaceholders();
  setupScrollAnimations();
});

/**
 * --------------------------------------------------------------------------
 * 1. HAMBURGER MENU DRAWER (PURE JS + GSAP COMPATIBLE)
 * --------------------------------------------------------------------------
 */
function setupNavigationDrawer() {
  const openBtn = document.getElementById("menuOpenBtn");
  const closeBtn = document.getElementById("menuCloseBtn");
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("navOverlay");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!openBtn || !drawer || !overlay) {
    console.warn("Menu elements missing in HTML (Check menuOpenBtn, navDrawer, navOverlay)");
    return;
  }

  function openMenu() {
    drawer.setAttribute("aria-hidden", "false");
    drawer.style.visibility = "visible";
    drawer.style.transform = "translateX(0%)";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    document.body.style.overflow = "hidden";

    // GSAP Animation if available
    if (typeof gsap !== "undefined") {
      gsap.fromTo(drawer, { x: "100%" }, { x: "0%", duration: 0.4, ease: "power3.out" });
      gsap.fromTo(".nav-item", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, stagger: 0.06, delay: 0.1 });
    }
  }

  function closeMenu() {
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (typeof gsap !== "undefined") {
      gsap.to(drawer, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          drawer.style.visibility = "hidden";
          overlay.style.visibility = "hidden";
          overlay.style.opacity = "0";
        }
      });
    } else {
      drawer.style.transform = "translateX(100%)";
      drawer.style.visibility = "hidden";
      overlay.style.visibility = "hidden";
      overlay.style.opacity = "0";
    }
  }

  openBtn.onclick = (e) => {
    e.preventDefault();
    openMenu();
  };

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      closeMenu();
    };
  }

  overlay.onclick = closeMenu;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  navLinks.forEach(link => {
    link.onclick = (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        closeMenu();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          setTimeout(() => {
            const headerOffset = 70;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }, 320);
        }
      }
    };
  });
}

/**
 * --------------------------------------------------------------------------
 * 2. RESPONSIVE TOUCH & ARROW SLIDER
 * --------------------------------------------------------------------------
 */
function setupWorkSlider() {
  const viewport = document.getElementById("sliderViewport");
  const track = document.getElementById("sliderTrack");
  const slides = document.querySelectorAll(".work-slide");
  const prevBtn = document.getElementById("sliderPrevBtn");
  const nextBtn = document.getElementById("sliderNextBtn");
  const dotsContainer = document.getElementById("sliderDots");

  if (!viewport || !track || slides.length === 0) {
    console.warn("Slider elements missing in HTML (Check sliderViewport, sliderTrack)");
    return;
  }

  let currentIndex = 0;

  function getSlidesPerView() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  let slidesPerView = getSlidesPerView();
  let maxIndex = Math.max(0, slides.length - slidesPerView);

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    const totalSteps = maxIndex + 1;

    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement("button");
      dot.className = `slider-dot ${i === currentIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function updateArrowButtons() {
    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
  }

  function goToSlide(index, animate = true) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const firstSlide = slides[0];
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 28;
    const offset = -(currentIndex * (slideWidth + gap));

    if (animate && typeof gsap !== "undefined") {
      gsap.to(track, { x: offset, duration: 0.45, ease: "power2.out" });
    } else {
      track.style.transition = animate ? "transform 0.4s ease" : "none";
      track.style.transform = `translateX(${offset}px)`;
    }

    updateDots();
    updateArrowButtons();
  }

  if (prevBtn) prevBtn.onclick = () => goToSlide(currentIndex - 1);
  if (nextBtn) nextBtn.onclick = () => goToSlide(currentIndex + 1);

  // Touch / Swipe
  let startX = 0;
  viewport.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 45) goToSlide(currentIndex + 1);
    else if (diff < -45) goToSlide(currentIndex - 1);
  });

  window.addEventListener("resize", () => {
    slidesPerView = getSlidesPerView();
    maxIndex = Math.max(0, slides.length - slidesPerView);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    renderDots();
    goToSlide(currentIndex, false);
  });

  renderDots();
  goToSlide(0, false);
}

/**
 * --------------------------------------------------------------------------
 * 3. PLACEHOLDERS (SAFE - Won't crash if any ID is missing in HTML)
 * --------------------------------------------------------------------------
 */
function setupPlaceholders() {
  const cleanPhone = (CONFIG.whatsappNumber || "").replace(/[^0-9]/g, "");
  const waEncodedMsg = encodeURIComponent(CONFIG.whatsappMessage || "");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const waFullUrl = isMobile 
    ? `https://wa.me/${cleanPhone}?text=${waEncodedMsg}`
    : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${waEncodedMsg}`;

  // Safe checks with optional chaining / if
  const heroBtn = document.getElementById("heroWhatsappBtn");
  if (heroBtn) heroBtn.href = waFullUrl;

  const footerWa = document.getElementById("footerWhatsappLink");
  if (footerWa) {
    footerWa.href = waFullUrl;
    footerWa.textContent = CONFIG.whatsappNumber;
  }

  const viewMoreBtn = document.getElementById("viewMoreBtn");
  if (viewMoreBtn) viewMoreBtn.href = CONFIG.instagramUrl;

  const footerBehance = document.getElementById("footerBehance");
  if (footerBehance) footerBehance.href = CONFIG.behanceUrl;

  const footerInstagram = document.getElementById("footerInstagram");
  if (footerInstagram) footerInstagram.href = CONFIG.instagramUrl;

  const footerLinkedin = document.getElementById("footerLinkedin");
  if (footerLinkedin) footerLinkedin.href = CONFIG.linkedinUrl;

  const devCreditEl = document.getElementById("developerCredit");
  if (devCreditEl) devCreditEl.textContent = CONFIG.developerCreditName;
}

/**
 * --------------------------------------------------------------------------
 * 4. GSAP SCROLL ANIMATIONS (Safe check)
 * --------------------------------------------------------------------------
 */
function setupScrollAnimations() {
  if (typeof gsap === "undefined") return;

  try {
    gsap.from(".brand-logo", { opacity: 0, x: -20, duration: 0.6 });
    gsap.from(".hamburger-btn", { opacity: 0, x: 20, duration: 0.6 });
  } catch (err) {
    // Ignore animation error
  }
}
