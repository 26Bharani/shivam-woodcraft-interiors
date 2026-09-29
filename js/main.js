/* =========================================================
   Shivam Woodcraft Interiors, main.js (vanilla JS, no libraries)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Business settings: edit these if details change ---------- */
  var BUSINESS = {
    name: "Shivam Woodcraft Interiors",
    whatsappNumber: "919080356021" // country code + number, digits only
  };

  var doc = document;
  var header = doc.getElementById("site-header");
  var nav = doc.getElementById("site-nav");
  var toggle = doc.getElementById("nav-toggle");
  var desktopNav = window.matchMedia("(min-width: 1024px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Sticky header state ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("no-scroll", open && !desktopNav.matches);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  // Reset the mobile panel if the window is resized up to the desktop layout.
  // (The closed mobile panel uses visibility:hidden, so it is not keyboard-reachable.)
  function syncNavToViewport() {
    if (desktopNav.matches) setMenu(false);
  }
  if (desktopNav.addEventListener) desktopNav.addEventListener("change", syncNavToViewport);
  else desktopNav.addListener(syncNavToViewport);

  /* ---------- Active link highlighting ---------- */
  var links = Array.prototype.slice.call(doc.querySelectorAll(".nav__link"));
  var linkById = {};
  links.forEach(function (a) { linkById[a.getAttribute("href").slice(1)] = a; });

  // Sections without their own menu link map to the closest one
  var alias = { featured: "services", process: "why", cta: "contact" };

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = alias[entry.target.id] || entry.target.id;
        links.forEach(function (a) {
          var active = a === linkById[id];
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    doc.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal for the process steps ---------- */
  var steps = doc.querySelectorAll(".step");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    steps.forEach(function (s) { reveal.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add("is-visible"); });
  }

  /* ---------- Gallery filter ---------- */
  var filterButtons = Array.prototype.slice.call(doc.querySelectorAll(".filter"));
  var items = Array.prototype.slice.call(doc.querySelectorAll(".work-item"));
  var status = doc.getElementById("work-status");

  function applyFilter(category) {
    var shown = 0;
    items.forEach(function (item) {
      var match = category === "all" || item.getAttribute("data-category") === category;
      item.hidden = !match;
      item.classList.remove("is-shown");
      if (match) {
        shown++;
        // restart the fade-in animation
        void item.offsetWidth;
        item.classList.add("is-shown");
      }
    });
    filterButtons.forEach(function (b) {
      var on = b.getAttribute("data-filter") === category;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    status.textContent = "Showing " + shown + (shown === 1 ? " project" : " projects");
  }

  filterButtons.forEach(function (b) {
    b.addEventListener("click", function () { applyFilter(b.getAttribute("data-filter")); });
  });

  /* ---------- Lightbox ---------- */
  var lb = doc.getElementById("lightbox");
  var lbImg = doc.getElementById("lb-img");
  var lbCaption = doc.getElementById("lb-caption");
  var lbClose = doc.getElementById("lb-close");
  var lbPrev = doc.getElementById("lb-prev");
  var lbNext = doc.getElementById("lb-next");
  var lbIndex = 0;
  var lbTrigger = null;

  function visibleItems() {
    return items.filter(function (i) { return !i.hidden; });
  }

  function showInLightbox(index) {
    var list = visibleItems();
    if (!list.length) return;
    lbIndex = (index + list.length) % list.length;
    var item = list[lbIndex];
    var img = item.querySelector("img");
    var cap = item.querySelector("figcaption");
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt") || "";
    // Caption is "<span>Category</span>Title": show it as "Category: Title"
    var span = cap && cap.querySelector("span");
    var category = span ? span.textContent : "";
    var title = cap ? cap.textContent.replace(category, "").trim() : "";
    lbCaption.textContent = category ? category + ": " + title : title;
    var single = list.length < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
  }

  function openLightbox(item) {
    var list = visibleItems();
    lbTrigger = item.querySelector("button");
    if (typeof lb.showModal === "function") lb.showModal();
    else lb.setAttribute("open", "");
    doc.body.classList.add("no-scroll");
    showInLightbox(list.indexOf(item));
    lbClose.focus();
  }

  function closeLightbox() {
    if (typeof lb.close === "function") lb.close();
    else lb.removeAttribute("open");
  }

  lb.addEventListener("close", function () {
    doc.body.classList.remove("no-scroll");
    lbImg.removeAttribute("src");
    if (lbTrigger) lbTrigger.focus();
  });

  items.forEach(function (item) {
    var btn = item.querySelector(".work-item__btn");
    btn.addEventListener("click", function () { openLightbox(item); });
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { showInLightbox(lbIndex - 1); });
  lbNext.addEventListener("click", function () { showInLightbox(lbIndex + 1); });

  // Click on the dark backdrop closes the viewer
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });

  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); showInLightbox(lbIndex - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); showInLightbox(lbIndex + 1); }
  });

  // Swipe left / right on touch screens
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) showInLightbox(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- "Enquire Now" buttons pre-select the service ---------- */
  var serviceSelect = doc.getElementById("f-service");

  function selectService(name) {
    for (var i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value === name || serviceSelect.options[i].text === name) {
        serviceSelect.selectedIndex = i;
        clearError(serviceSelect);
        return;
      }
    }
  }

  doc.querySelectorAll(".js-enquire").forEach(function (a) {
    a.addEventListener("click", function () {
      var name = a.getAttribute("data-service");
      if (name) selectService(name);
    });
  });

  /* ---------- Enquiry form -> WhatsApp ---------- */
  var form = doc.getElementById("enquiry-form");
  var formStatus = doc.getElementById("form-status");
  var nameInput = doc.getElementById("f-name");
  var phoneInput = doc.getElementById("f-phone");
  var messageInput = doc.getElementById("f-message");

  function fieldOf(el) { return el.closest(".field"); }
  function errorOf(el) { return doc.getElementById(el.id + "-err"); }

  function setError(el, on) {
    fieldOf(el).classList.toggle("has-error", on);
    var err = errorOf(el);
    if (err) err.hidden = !on;
    if (on) el.setAttribute("aria-describedby", el.id + "-err");
    else el.removeAttribute("aria-describedby");
    el.setAttribute("aria-invalid", on ? "true" : "false");
  }
  function clearError(el) { setError(el, false); }

  function validPhone(value) {
    var digits = value.replace(/[^\d]/g, "");
    return digits.length >= 10 && digits.length <= 13;
  }

  [nameInput, phoneInput, serviceSelect].forEach(function (el) {
    el.addEventListener("input", function () { clearError(el); });
    el.addEventListener("change", function () { clearError(el); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formStatus.textContent = "";

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var service = serviceSelect.value;
    var message = messageInput.value.trim();

    var okName = name.length > 0;
    var okPhone = validPhone(phone);
    var okService = service !== "";

    setError(nameInput, !okName);
    setError(phoneInput, !okPhone);
    setError(serviceSelect, !okService);

    if (!(okName && okPhone && okService)) {
      var firstBad = !okName ? nameInput : (!okPhone ? phoneInput : serviceSelect);
      firstBad.focus();
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    var text =
      "Hello " + BUSINESS.name + ", I would like to make an enquiry.\n\n" +
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Service Required: " + service + "\n" +
      "Message: " + (message || "-");

    var url = "https://wa.me/" + BUSINESS.whatsappNumber + "?text=" + encodeURIComponent(text);

    formStatus.textContent = "Opening WhatsApp. Press send there to share your enquiry.";
    var win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url; // pop-up blocked: open in the same tab
  });
})();
