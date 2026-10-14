/**
 * ==========================================================================
 * ADITYA KUMAR - GRAPHIC DESIGNER PORTFOLIO JAVASCRIPT
 * Bulletproof & Offline-Safe Version
 * ==========================================================================
 */

// 1. CONFIGURATION (ध्यान रखें: हर लाइन के अंत में कॉमा ',' जरूर रहे)
const CONFIG = {
  whatsappNumber: "+916388004937", 
  whatsappMessage: "Hi Aditya, I saw your portfolio and would like to discuss a design project!",
  instagramUrl: "https://instagram.com/design.with_adi",
  linkedinUrl: "https://linkedin.com/in/YOUR_USERNAME",
  behanceUrl: "https://behance.net/adityakumar723",
  developerCreditName: "Aditya Kumar"
};

document.addEventListener("DOMContentLoaded", () => {
  // Safe GSAP registration
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  setupPlaceholders();
  setupNavigationDrawer();
  setupWorkSlider();
  setupScrollAnimations();
  setupContactFormValidation();
});

/**
 * 1. DYNAMIC PLACEHOLDERS & URLS
 */
function setupPlaceholders() {
  const cleanPhone = (CONFIG.whatsappNumber || "").replace(/[^0-9]/g, "");
  const waEncodedMsg = encodeURIComponent(CONFIG.whatsappMessage || "");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const waFullUrl = isMobile 
    ? `https://wa.me/${cleanPhone}?text=${waEncodedMsg}`
    : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${waEncodedMsg}`;

  const heroWhatsappBtn = document.getElementById("heroWhatsappBtn");
  if (heroWhatsappBtn) heroWhatsappBtn.href = waFullUrl;

  const footerWhatsappLink = document.getElementById("footerWhatsappLink");
  if (footerWhatsappLink) {
    footerWhatsappLink.href = waFullUrl;
    footerWhatsappLink.textContent = CONFIG.whatsappNumber;
  }

  const viewMoreBtn = document.getElementById("viewMoreBtn");
  if (viewMoreBtn) viewMoreBtn.href = CONFIG.instagramUrl;

  const footerBehance = document.getElementById("footerBehance");
  if (footerBehance) footerBehance.href = CONFIG.behanceUrl;

  const footerInstagram = document.getElementById("footerInstagram");
  if (footerInstagram) footerInstagram.href = CONFIG.instagramUrl;

  const footerLinkedin = document.getElementById("footerLinkedin");
  if (footerLinkedin) footerLinkedin.href = CONFIG.linkedinUrl;

  document.querySelectorAll(".social-behance").forEach(el => el.href = CONFIG.behanceUrl);
  document.querySelectorAll(".social-instagram").forEach(el => el.href = CONFIG.instagramUrl);
  document.querySelectorAll(".social-linkedin").forEach(el => el.href = CONFIG.linkedinUrl);

  const devCreditEl = document.getElementById("developerCredit");
  if (devCreditEl) devCreditEl.textContent = CONFIG.developerCreditName;
}

/**
 * 2. NAVIGATION DRAWER (GSAP + FALLBACK)
 */
function setupNavigationDrawer() {
  const openBtn = document.getElementById("menuOpenBtn");
  const closeBtn = document.getElementById("menuCloseBtn");
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("navOverlay");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!openBtn || !closeBtn || !drawer || !overlay) return;

  const hasGsap = typeof gsap !== "undefined";
  let drawerTl = null;

  if (hasGsap) {
    drawerTl = gsap.timeline({ paused: true, reversed: true });
    drawerTl
      .set(drawer, { visibility: "visible" })
      .to(overlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
      .to(drawer, { x: "0%", duration: 0.4, ease: "power3.out" }, "-=0.2")
      .from(".nav-item", { x: 30, opacity: 0, duration: 0.25, stagger: 0.06, ease: "power2.out" }, "-=0.2");
  }

  function openMenu() {
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (hasGsap && drawerTl) {
      drawerTl.play();
    } else {
      // Fallback agar GSAP load na ho
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
      drawer.style.visibility = "visible";
      drawer.style.transform = "translateX(0%)";
    }
  }

  function closeMenu() {
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (hasGsap && drawerTl) {
      drawerTl.reverse();
    } else {
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      drawer.style.transform = "translateX(100%)";
    }
  }

  openBtn.onclick = openMenu;
  closeBtn.onclick = closeMenu;
  overlay.onclick = closeMenu;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      closeMenu();

      if (targetSection) {
        setTimeout(() => {
          const headerOffset = 70;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 300);
      }
    });
  });
}

/**
 * 3. RESPONSIVE WORK SLIDER & DOTS
 */
function setupWorkSlider() {
  const viewport = document.getElementById("sliderViewport");
  const track = document.getElementById("sliderTrack");
  const slides = document.querySelectorAll(".work-slide");
  const prevBtn = document.getElementById("sliderPrevBtn");
  const nextBtn = document.getElementById("sliderNextBtn");
  const dotsContainer = document.getElementById("sliderDots");

  if (!viewport || !track || slides.length === 0) return;

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

  // Swipe / Touch Controls
  let startX = 0;
  let isDragging = false;

  viewport.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 40) goToSlide(currentIndex + 1);
    else if (diff < -40) goToSlide(currentIndex - 1);
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
 * 4. GSAP ENTRANCE ANIMATIONS (Safe check)
 */
function setupScrollAnimations() {
  if (typeof gsap === "undefined") return;

  gsap.from(".brand-logo", { opacity: 0, x: -20, duration: 0.6 });
  gsap.from(".hamburger-btn", { opacity: 0, x: 20, duration: 0.6 });
  gsap.from(".hero-content > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 });

  if (typeof ScrollTrigger !== "undefined") {
    gsap.from(".work-slider-wrapper", {
      scrollTrigger: { trigger: ".work-slider-wrapper", start: "top 85%" },
      y: 35, opacity: 0, duration: 0.6
    });
  }
}

/**
 * 5. CONTACT FORM VALIDATION
 */
function setupContactFormValidation() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) return;

  // form.addEventListener("submit", (e) => {
  //   e.preventDefault();
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const message = document.getElementById("userMessage").value.trim();

    if (!name || !email || !phone || message.length < 5) {
      if (feedback) {
        feedback.className = "form-feedback error";
        feedback.textContent = "Please fill in all required fields correctly.";
        feedback.style.display = "block";
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
      if (feedback) {
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Message received.`;
        feedback.style.display = "block";
      }
      form.reset();
    }, 900);
  });
}