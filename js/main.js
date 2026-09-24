/* ==========================================================================
   Paola's Cleaning Services — site behavior
   ========================================================================== */

/* Paste your GoHighLevel form webhook or Formspree URL here.
   Example: const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   Leave it empty ("") to demo the form: it will pretend to send and show the
   success message, but nothing is delivered anywhere. */
const FORM_ENDPOINT = "";

(function () {
  "use strict";
  const t = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- mobile menu ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".i-open").hidden = open;
    menuBtn.querySelector(".i-close").hidden = !open;
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia("(min-width: 1200px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
  }

  /* ---------- accordions (service rows + FAQ) ---------- */
  document.querySelectorAll("[data-acc]").forEach((item) => {
    const btn = item.querySelector("button[aria-expanded]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("is-open", !open);
    });
  });

  /* ---------- before/after sliders ---------- */
  document.querySelectorAll("[data-ba]").forEach((ba) => {
    const range = ba.querySelector('input[type="range"]');
    const set = (v) => ba.style.setProperty("--pos", `${v}%`);
    range.addEventListener("input", () => set(range.value));
    set(range.value);

    let dragging = false;
    const fromPointer = (e) => {
      const r = ba.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      range.value = Math.round(pct);
      set(range.value);
    };
    ba.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      try { ba.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      fromPointer(e);
      range.focus({ preventScroll: true });
    });
    ba.addEventListener("pointermove", (e) => { if (dragging) fromPointer(e); });
    const stop = () => { dragging = false; };
    ba.addEventListener("pointerup", stop);
    ba.addEventListener("pointercancel", stop);   // vertical scroll on touch wins
  });

  /* ---------- before/after filters ---------- */
  const filterBar = document.querySelector(".filter-bar");
  const gallery = document.getElementById("gallery");
  const countEl = document.querySelector("[data-count]");
  const emptyEl = document.querySelector("[data-empty]");
  let activeFilter = "all";
  function renderCount(n) {
    if (!countEl) return;
    countEl.textContent = n === 1 ? t("bap.count.one") : t("bap.count.many", { n });
    if (emptyEl) emptyEl.hidden = n !== 0;
  }
  function applyFilter(f) {
    activeFilter = f;
    let n = 0;
    gallery.querySelectorAll("li[data-tags]").forEach((li) => {
      const show = f === "all" || li.getAttribute("data-tags").split(/\s+/).includes(f);
      li.hidden = !show;
      if (show) n++;
    });
    filterBar.querySelectorAll("button[data-filter]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f));
    });
    renderCount(n);
  }
  if (filterBar && gallery) {
    filterBar.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-filter]");
      if (b) applyFilter(b.getAttribute("data-filter"));
    });
    document.addEventListener("langchange", () => applyFilter(activeFilter));
    applyFilter("all");
  }

  /* ---------- quote form ---------- */
  const form = document.getElementById("quote-form");
  if (!form) return;

  const freqGroup = document.getElementById("freq-group");
  const summary = document.getElementById("form-summary");
  const sendError = document.getElementById("send-error");
  const submitBtn = document.getElementById("submit-btn");
  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const radioVal = (name) => { const r = form.querySelector(`input[name="${name}"]:checked`); return r ? r.value : ""; };
  function syncFrequency() {
    const recurring = radioVal("service") === "recurring";
    freqGroup.hidden = !recurring;
    if (!recurring) {
      form.querySelectorAll('input[name="frequency"]').forEach((r) => { r.checked = false; });
      clearError("frequency");
    }
  }
  form.querySelectorAll('input[name="service"]').forEach((r) => r.addEventListener("change", () => { syncFrequency(); validate("service"); }));
  form.querySelectorAll('input[name="frequency"]').forEach((r) => r.addEventListener("change", () => validate("frequency")));

  // Pre-select from links like quote.html#recurring-biweekly or quote.html#deep
  function applyHash() {
    const h = (location.hash || "").replace("#", "").toLowerCase();
    if (!h) return;
    const [svc, freq] = h.split("-");
    const s = form.querySelector(`input[name="service"][value="${svc}"]`);
    if (!s) return;
    s.checked = true;
    syncFrequency();
    if (svc === "recurring" && freq) {
      const f = form.querySelector(`input[name="frequency"][value="${freq}"]`);
      if (f) f.checked = true;
    }
  }
  applyHash();
  window.addEventListener("hashchange", applyHash);

  const RULES = {
    name: () => form.elements.name.value.trim().length >= 2 || "err.name",
    phone: () => form.elements.phone.value.replace(/\D/g, "").length >= 10 || "err.phone",
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.elements.email.value.trim()) || "err.email",
    address: () => form.elements.address.value.trim().length >= 3 || "err.address",
    service: () => !!radioVal("service") || "err.service",
    frequency: () => radioVal("service") !== "recurring" || !!radioVal("frequency") || "err.freq",
    beds: () => !!form.elements.beds.value || "err.beds",
    baths: () => !!form.elements.baths.value || "err.baths",
  };
  const ORDER = ["name", "phone", "email", "address", "service", "frequency", "beds", "baths"];

  function fieldEl(id) { return form.querySelector(`[data-field="${id}"]`); }
  function errEl(id) { return document.getElementById(`${id}-error`); }
  function controls(id) {
    const el = form.elements[id];
    if (!el) return [];
    return el instanceof RadioNodeList ? Array.from(el) : [el];
  }
  function showError(id, key) {
    const e = errEl(id);
    if (e) { e.dataset.key = key; e.textContent = t(key); }
    fieldEl(id)?.classList.add("has-error");
    controls(id).forEach((c) => c.setAttribute("aria-invalid", "true"));
  }
  function clearError(id) {
    const e = errEl(id);
    if (e) { delete e.dataset.key; e.textContent = ""; }
    fieldEl(id)?.classList.remove("has-error");
    controls(id).forEach((c) => c.removeAttribute("aria-invalid"));
  }
  function validate(id) {
    const res = RULES[id]();
    if (res === true) { clearError(id); return true; }
    showError(id, res);
    return false;
  }

  ["name", "phone", "email", "address", "beds", "baths"].forEach((id) => {
    const el = form.elements[id];
    el.addEventListener("blur", () => { if (el.value !== "" || fieldEl(id).classList.contains("has-error")) validate(id); });
    el.addEventListener("input", () => { if (fieldEl(id).classList.contains("has-error")) validate(id); });
    el.addEventListener("change", () => { if (fieldEl(id).classList.contains("has-error")) validate(id); });
  });

  // Re-translate visible messages when the language changes
  document.addEventListener("langchange", () => {
    document.querySelectorAll(".error[data-key]").forEach((e) => { e.textContent = t(e.dataset.key); });
  });

  const labelEl = submitBtn.querySelector("[data-label]");
  const badgeEl = submitBtn.querySelector("[data-badge]");
  const badgeHTML = badgeEl.innerHTML;
  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.setAttribute("aria-busy", String(on));
    labelEl.setAttribute("data-i18n", on ? "f.sending" : "f.submit");
    labelEl.textContent = t(on ? "f.sending" : "f.submit");
    badgeEl.innerHTML = on ? '<span class="spinner" aria-hidden="true"></span>' : badgeHTML;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    sendError.textContent = ""; delete sendError.dataset.key;
    const bad = ORDER.filter((id) => !validate(id));
    if (bad.length) {
      summary.dataset.key = "err.summary";
      summary.textContent = t("err.summary");
      const first = controls(bad[0])[0];
      if (first) first.focus();
      return;
    }
    summary.textContent = ""; delete summary.dataset.key;

    const data = Object.fromEntries(new FormData(form).entries());
    data.language = window.I18N ? window.I18N.lang : "en";
    data.source = "website quote form";
    data.page = location.href;
    data.submittedAt = new Date().toISOString();

    setLoading(true);
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        console.info("[demo] FORM_ENDPOINT is empty — simulating success. Payload:", data);
        await new Promise((r) => setTimeout(r, reduceMotion ? 200 : 900));
      }
      document.getElementById("form-wrap").hidden = true;
      const ok = document.getElementById("form-success");
      ok.hidden = false;
      ok.focus();
    } catch (err) {
      sendError.dataset.key = "err.send";
      sendError.textContent = t("err.send");
      setLoading(false);
    }
  });
})();
