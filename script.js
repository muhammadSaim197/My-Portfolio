/* =========================================================
   M Saim — Portfolio  |  GSAP + ScrollTrigger + AOS
   Rule of thumb used here:
   - GSAP  → hero, project rows, design process, focus cards, CTA
   - Buttons only change colour on hover (pure CSS) - they never move
   - AOS   → section headings, about, logo grid, skills, footer
   (they never animate the same element, so they don't fight)
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: reduceMotion
    });
  }

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("is-open", !open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("is-open");
    }
  });

  /* ---------- Stop here if GSAP failed to load or motion is reduced ---------- */
  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll("[data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) {
    document.querySelectorAll("[data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
    document.querySelectorAll(".project__media img").forEach(function (img) { img.style.transform = "none"; });
    return;
  }

  /* =======================================================
     1) HERO — intro timeline + parallax
     ======================================================= */
  var intro = gsap.timeline({ defaults: { ease: "power4.out" } });

  intro
    .from(".nav__inner > *", { y: -24, opacity: 0, duration: 0.8, stagger: 0.08 })
    .from(".hero__stats .stat", { y: 40, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.5")
    .from(".split__in", { yPercent: 115, duration: 1.1, stagger: 0.12 }, "-=0.7")
    .from(".hero__sub", { y: 30, opacity: 0, duration: 0.9 }, "-=0.7")
    .from(".hero__btns .btn", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.65")
    .from(".hero__img", { x: 90, opacity: 0, scale: 0.94, duration: 1.4, ease: "power3.out" }, 0.25);

  // number count-up (starts with the stats)
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseInt(el.dataset.count, 10);
    var obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 2,
      delay: 0.7,
      ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  });

  // portrait drifts slower than the page, text drifts slightly faster
  gsap.to(".hero__img", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  gsap.to(".hero__content", {
    yPercent: -12,
    opacity: 0.2,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "center top", end: "bottom top", scrub: true }
  });

  /* =======================================================
     2) PROJECT ROWS — reveal + image parallax
     ======================================================= */
  gsap.utils.toArray(".project").forEach(function (row) {
    var num = row.querySelector(".project__num");
    var body = row.querySelectorAll(".project__body > *");
    var media = row.querySelector(".project__media");
    var img = row.querySelector(".project__media img");

    var tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: "top 82%", toggleActions: "play none none none" },
      defaults: { ease: "power3.out" }
    });
    tl.from(row, { opacity: 0, duration: 0.8 })
      .from(num, { x: -30, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(body, { y: 28, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: "transform,opacity" }, "-=0.6")
      .from(media, { clipPath: "inset(0 0 100% 0 round 20px)", duration: 1.1, ease: "power4.inOut" }, "-=1");

    // image slides inside its frame while scrolling
    gsap.fromTo(img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true }
      }
    );
  });

  /* =======================================================
     3) DESIGN PROCESS — step-by-step build-in
     ======================================================= */
  var mm = gsap.matchMedia();

  mm.add("(min-width: 1001px)", function () {
    gsap.utils.toArray(".step").forEach(function (step, i) {
      var tl = gsap.timeline({
        scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" },
        defaults: { ease: "power3.out" }
      });
      tl.from(step.querySelector(".step__label"), { y: 20, opacity: 0, duration: 0.7 })
        .from(step.querySelector(".step__line"), { scaleY: 0, transformOrigin: "top", duration: 0.6 }, "-=0.35")
        .from(step.querySelector(".step__dot"), { scale: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.15")
        .from(step.querySelector(".pill-week"), { clipPath: "inset(0 100% 0 0 round 12px)", duration: 0.8, ease: "power4.inOut" }, "-=0.2")
        .from(step.querySelector(".hatch"), { opacity: 0, x: -20, duration: 0.6 }, "-=0.4")
        .from(step.querySelectorAll(".step__tags li"), { x: -30, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.3");
    });
  });

  mm.add("(max-width: 1000px)", function () {
    gsap.utils.toArray(".step").forEach(function (step) {
      gsap.from(step, {
        y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 88%" }
      });
    });
  });

  /* =======================================================
     4) FOCUS CARDS — staggered batch + inner image float
     ======================================================= */
  ScrollTrigger.batch(".fcard", {
    start: "top 90%",
    once: true,
    onEnter: function (batch) {
      gsap.from(batch, { opacity: 0, duration: 0.9, stagger: 0.13, ease: "power2.out", clearProps: "opacity" });
      gsap.from(batch.map(function (c) { return c.querySelector(".fcard__content"); }),
        { y: 24, duration: 0.9, stagger: 0.13, ease: "power3.out", clearProps: "transform" });
      gsap.from(batch.map(function (c) { return c.querySelector(".fcard__img"); }),
        { y: 40, duration: 1.1, stagger: 0.13, ease: "power3.out", delay: 0.15, clearProps: "transform" });
    }
  });

  /* =======================================================
     5) CTA — card scales in, pattern drifts, title rises
     ======================================================= */
  var ctaTl = gsap.timeline({
    scrollTrigger: { trigger: ".cta", start: "top 80%", toggleActions: "play none none none" },
    defaults: { ease: "power3.out" }
  });
  ctaTl
    .from(".cta", { scale: 0.92, opacity: 0, borderRadius: 80, duration: 1.1 })
    .from(".cta__title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.55")
    .from(".cta__sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.55")
    .from(".cta .btn", { y: 30, opacity: 0, scale: 0.9, duration: 0.7, ease: "back.out(2)" }, "-=0.5");

  // gsap.fromTo(".cta__pattern",
  //   { xPercent: -6 },
  //   { xPercent: 6, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true } }
  // );

  /* ---------- keep trigger positions right once images are in ---------- */
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
    if (window.AOS) AOS.refresh();
  });
})();





document.addEventListener('DOMContentLoaded', function () {
  const projects = document.querySelectorAll('.work .project');
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  projects.forEach((project) => {
    const number = project.querySelector('.project__num');
    const link = project.querySelector('.explore');

    if (number) {
      number.dataset.originalNumber = number.textContent.trim();
    }

    if (link) {
      link.dataset.originalHref = link.getAttribute('href');
    }
  });

  function updatePortfolio() {
    let mobileNumber = 1;

    projects.forEach((project, index) => {
      const number = project.querySelector('.project__num');
      const link = project.querySelector('.explore');

      if (mobileQuery.matches) {
        const hidden = index === 0 ||
                       index === 1 ||
                       index === projects.length - 1;

        if (hidden) return;

        if (number) {
          number.textContent = String(mobileNumber).padStart(2, '0');
          mobileNumber++;
        }

        if (link && link.dataset.mobileHref) {
          link.setAttribute('href', link.dataset.mobileHref);
        }
      } else {
        if (number) {
          number.textContent = number.dataset.originalNumber;
        }

        if (link) {
          link.setAttribute('href', link.dataset.originalHref);
        }
      }
    });
  }

  updatePortfolio();
  mobileQuery.addEventListener('change', updatePortfolio);
});
