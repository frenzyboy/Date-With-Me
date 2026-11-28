/* =========================================================
   Gallery: the photo sections in the secret room (CONFIG.room.gallery)
     wall     — a 3×3 board of pinned Polaroids that drop in
     instant  — blank instant photos that develop when she taps them
     outfits  — a fanned hand of tall cards that spread out on tap
     scratch  — one photo under a scratch-card layer she rubs off
   Tapping any photo opens it big in the Lightbox (swipe or arrows to move;
   pinch, double-tap or mouse wheel to zoom, drag to look around while zoomed).
   Built the first time the room opens, so captions can use her name.
   ========================================================= */
class Lightbox {
  constructor() {
    this.el = $("#lightbox");
    this.img = $("#lbImg");
    this.cap = $("#lbCap");
    this.list = [];
    this.i = 0;
    this.back = null;
    this.swiped = false;
    $("#lbClose").addEventListener("click", () => this.close());
    $("#lbPrev").addEventListener("click", () => this.show(this.i - 1));
    $("#lbNext").addEventListener("click", () => this.show(this.i + 1));
    // Tap the dark area to close (but not right after a swipe)
    this.el.addEventListener("click", e => {
      if (this.swiped) { this.swiped = false; return; }
      if (e.target === this.el || e.target.classList.contains("lb-figure")) this.close();
    });
    document.addEventListener("keydown", e => {
      if (this.el.hidden) return;
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this.show(this.i - 1);
      if (e.key === "ArrowRight") this.show(this.i + 1);
    });
    // Swipe left/right to change photo (only when not zoomed in)
    let x0 = null;
    this.el.addEventListener("pointerdown", e => { if (!this.ptrs.size || this.ptrs.size === 1) x0 = e.clientX; });
    this.el.addEventListener("pointerup", e => {
      if (x0 == null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (this.scale > 1 || this.pinched) return;
      if (Math.abs(dx) > 50 && this.list.length > 1) { this.swiped = true; this.show(this.i + (dx < 0 ? 1 : -1)); }
    });
    this.setupZoom();
  }

  // ---------- zoom: pinch (2 fingers), double-tap / double-click, mouse wheel; drag to pan while zoomed
  setupZoom() {
    const img = this.img;
    this.ptrs = new Map();
    this.scale = 1; this.tx = 0; this.ty = 0;
    this.pinched = false;
    let pinch = null, lastTap = 0, downAt = null;

    img.addEventListener("pointerdown", e => {
      img.setPointerCapture(e.pointerId);
      this.ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      img.classList.remove("smooth");
      if (this.ptrs.size === 1) { this.pinched = false; downAt = [e.clientX, e.clientY]; }
      if (this.ptrs.size === 2) {
        const [a, b] = [...this.ptrs.values()];
        pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: this.scale };
        this.pinched = true;
      }
    });
    img.addEventListener("pointermove", e => {
      const prev = this.ptrs.get(e.pointerId);
      if (!prev) return;
      const cur = [e.clientX, e.clientY];
      this.ptrs.set(e.pointerId, cur);
      if (this.ptrs.size === 2 && pinch) {
        const [a, b] = [...this.ptrs.values()];
        this.zoomTo(pinch.s * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d);
      } else if (this.ptrs.size === 1 && this.scale > 1) {
        this.tx += cur[0] - prev[0];
        this.ty += cur[1] - prev[1];
        this.applyZoom();
      }
    });
    const up = e => {
      if (!this.ptrs.has(e.pointerId)) return;
      this.ptrs.delete(e.pointerId);
      if (this.ptrs.size < 2) pinch = null;
      if (this.scale < 1.05 && !this.ptrs.size) this.resetZoom(true);
      // double-tap: two quick taps that barely moved
      if (e.type === "pointerup" && !this.ptrs.size && !this.pinched && downAt &&
          Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) < 12) {
        const now = Date.now();
        if (now - lastTap < 320) { lastTap = 0; this.toggleZoom(e.clientX, e.clientY); }
        else lastTap = now;
      }
    };
    img.addEventListener("pointerup", up);
    img.addEventListener("pointercancel", up);
    img.addEventListener("wheel", e => {
      e.preventDefault();
      img.classList.remove("smooth");
      this.zoomTo(this.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
      if (this.scale < 1.05) this.resetZoom();
    }, { passive: false });
    // A tap on the photo itself never closes the viewer
    img.addEventListener("click", e => { e.stopPropagation(); this.swiped = false; });
  }
  zoomTo(s) {
    this.scale = Math.min(4, Math.max(1, s));
    this.applyZoom();
  }
  // Double-tap: zoom in on that spot, or back out
  toggleZoom(x, y) {
    this.img.classList.add("smooth");
    if (this.scale > 1) return this.resetZoom(true);
    const r = this.img.getBoundingClientRect(), s = 2.5;
    this.scale = s;
    this.tx = -(x - (r.left + r.width / 2)) * (s - 1);
    this.ty = -(y - (r.top + r.height / 2)) * (s - 1);
    this.applyZoom();
  }
  // Keeps the zoomed photo from being dragged off screen
  applyZoom() {
    const w = this.img.offsetWidth, h = this.img.offsetHeight;
    const mx = (w * this.scale - w) / 2, my = (h * this.scale - h) / 2;
    this.tx = Math.min(mx, Math.max(-mx, this.tx));
    this.ty = Math.min(my, Math.max(-my, this.ty));
    this.img.style.transform = `translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`;
    this.img.classList.toggle("zoomed", this.scale > 1);
    this.el.classList.toggle("is-zoomed", this.scale > 1);
    if (this.scale > 1) $("#lbHint").hidden = true;
  }
  resetZoom(smooth = false) {
    this.img.classList.toggle("smooth", smooth);
    this.scale = 1; this.tx = 0; this.ty = 0;
    this.applyZoom();
  }

  // list = [{ src, caption }], i = which one to show first
  open(list, i) {
    this.list = list;
    this.back = document.activeElement;
    this.el.hidden = false;
    document.body.classList.add("lb-on");
    this.show(i);
    $("#lbClose").focus({ preventScroll: true });
  }
  show(i) {
    const n = this.list.length;
    this.i = (i + n) % n;
    const p = this.list[this.i];
    this.resetZoom();
    this.img.src = p.src;
    this.img.alt = p.caption || "Photo";
    this.cap.textContent = p.caption || "";
    $("#lbPrev").hidden = $("#lbNext").hidden = n < 2;
    restart(this.img, "lb-in");
  }
  close() {
    this.resetZoom();
    this.ptrs.clear();
    this.el.hidden = true;
    document.body.classList.remove("lb-on");
    if (this.back) this.back.focus({ preventScroll: true });
  }
}

class Gallery {
  // text = the room's text filler ({me}, {her}, {bear}, …)
  constructor(app, text) {
    this.app = app;
    this.text = text;
    this.cfg = CONFIG.room.gallery || {};
    this.lightbox = new Lightbox();
    this.built = false;
    this.sc = null;   // scratch card state
  }

  // Called every time the room opens
  open() {
    if (!this.built) {
      this.buildWall();
      this.buildInstant();
      this.buildFan();
      this.buildScratch();
      this.watch();
      this.built = true;
    }
    requestAnimationFrame(() => this.scratchPaint());
  }

  // ---------- shared bits
  url(src) { return encodeURI(src); }   // the folders have spaces in their names
  list(photos) { return photos.map(p => ({ src: this.url(p.src), caption: this.text(p.caption || "") })); }
  img(src, alt) {
    return Object.assign(document.createElement("img"), { src, alt, loading: "lazy", decoding: "async", draggable: false });
  }
  // Fills a section's title and hint; hides the section if it has no photos
  head(id, c) {
    const box = $(id);
    if (!c || !((c.photos && c.photos.length) || c.photo)) { box.hidden = true; return null; }
    $(".js-gal-title", box).textContent = this.text(c.title || "");
    $(".js-gal-hint", box).textContent = this.text(c.hint || "");
    return box;
  }
  // The wall animates in when she scrolls to it
  watch() {
    const els = [$("#wall")];
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.2 });
    els.forEach(e => io.observe(e));
  }

  // ---------- photo wall
  buildWall() {
    const c = this.cfg.wall, box = this.head("#galWall", c);
    if (!box) return;
    const list = this.list(c.photos), wall = $("#wall", box);
    list.forEach((p, i) => {
      const b = Object.assign(document.createElement("button"), { type: "button", className: "pin" });
      b.style.setProperty("--i", i);
      b.setAttribute("aria-label", `Open photo: ${p.caption}`);
      b.append(this.img(p.src, p.caption), Object.assign(document.createElement("span"), { className: "pin-cap", textContent: p.caption }));
      b.addEventListener("click", () => this.lightbox.open(list, i));
      wall.appendChild(b);
    });
  }

  // ---------- instant photos: tap one → it shakes and develops; tap again → big view
  buildInstant() {
    const c = this.cfg.instant, box = this.head("#galInstant", c);
    if (!box) return;
    const list = this.list(c.photos), grid = $("#instants", box), wait = ms => ms * this.app.pacer.speed;
    let left = list.length;
    list.forEach((p, i) => {
      const b = Object.assign(document.createElement("button"), { type: "button", className: "instant" });
      b.setAttribute("aria-label", `Develop photo ${i + 1}`);
      b.innerHTML = `<span class="instant-photo"><span class="instant-film" aria-hidden="true">📸</span></span><span class="instant-cap"></span>`;
      $(".instant-photo", b).prepend(this.img(p.src, p.caption || `Instant photo ${i + 1}`));
      const cap = $(".instant-cap", b);
      cap.textContent = this.text(c.waiting || "");
      b.addEventListener("click", () => {
        if (b.classList.contains("dev")) return this.lightbox.open(list, i);
        b.classList.add("dev");
        b.setAttribute("aria-label", `Open photo: ${p.caption}`);
        this.app.sfx.shutter();
        cap.textContent = "…";
        setTimeout(() => { cap.textContent = p.caption; }, wait(1800));
        if (--left === 0) setTimeout(() => {
          $(".js-gal-hint", box).textContent = this.text(c.done || "");
          this.app.confetti.burst(40);
        }, wait(3200));
      });
      grid.appendChild(b);
    });
  }

  // ---------- outfit check: fanned cards, first tap spreads them
  buildFan() {
    const c = this.cfg.outfits, box = this.head("#galOutfits", c);
    if (!box) return;
    const list = this.list(c.photos), fan = $("#fan", box), mid = (list.length - 1) / 2;
    c.photos.forEach((p, i) => {
      const b = Object.assign(document.createElement("button"), { type: "button", className: "fan-card" });
      b.style.setProperty("--k", i - mid);
      b.setAttribute("aria-label", `Outfit ${i + 1}`);
      b.append(this.img(list[i].src, list[i].caption || `Outfit ${i + 1}`),
               Object.assign(document.createElement("span"), { className: "fan-stamp", textContent: this.text(p.stamp || "") }));
      b.addEventListener("click", () => {
        if (!fan.classList.contains("spread")) {
          fan.classList.add("spread");
          this.app.sfx.pop();
          setTimeout(() => this.app.sfx.thunk(), 600 * this.app.pacer.speed);
          $(".js-gal-hint", box).textContent = this.text(c.hintOpen || "");
          return;
        }
        this.lightbox.open(list, i);
      });
      fan.appendChild(b);
    });
  }

  // ---------- scratch to reveal
  buildScratch() {
    const c = this.cfg.scratch, box = this.head("#galScratch", c);
    if (!box) return;
    const s = this.sc = { c, box, wrap: $("#scratch", box), cv: $("#scratch canvas", box), img: $("#scratch img", box), done: false, painted: false };
    s.img.src = this.url(c.photo.src);
    s.img.alt = this.text(c.photo.caption || "Photo");
    let drawing = false, last = null, moves = 0;
    s.cv.addEventListener("pointerdown", e => {
      if (s.done) return;
      e.preventDefault();
      s.cv.setPointerCapture(e.pointerId);
      drawing = true;
      last = this.scPoint(e);
      this.scratchAt(last, last);
    });
    s.cv.addEventListener("pointermove", e => {
      if (!drawing) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (evs.length ? evs : [e]).forEach(ev => { const p = this.scPoint(ev); this.scratchAt(last, p); last = p; });
      if (++moves % 8 === 0) this.scratchCheck();
    });
    const end = () => { if (drawing) { drawing = false; this.scratchCheck(); } };
    s.cv.addEventListener("pointerup", end);
    s.cv.addEventListener("pointercancel", end);
    window.addEventListener("resize", () => { if (!s.done) this.scratchPaint(true); });
    s.wrap.addEventListener("click", () => { if (s.done) this.lightbox.open([{ src: s.img.src, caption: s.img.alt }], 0); });
  }
  scPoint(e) {
    const r = this.sc.cv.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  // Paints the pink scratch layer (again after a resize, which starts it over)
  scratchPaint(force = false) {
    const s = this.sc;
    if (!s || s.done || (s.painted && !force)) return;
    const r = s.cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), ctx = s.cv.getContext("2d");
    s.cv.width = Math.round(r.width * dpr);
    s.cv.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#f7a6bd"); g.addColorStop(0.5, "#ffd1dc"); g.addColorStop(1, "#df3567");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(255,255,255,.55)";
    for (let i = 0; i < 70; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * r.width, Math.random() * r.height, 0.6 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    const display = getComputedStyle(document.documentElement).getPropertyValue("--display");
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(63,18,41,.35)"; ctx.shadowBlur = 8;
    ctx.font = `30px ${display}`;
    ctx.fillText(this.text(s.c.cover || "Scratch me ✨"), r.width / 2, r.height / 2, r.width - 24);
    ctx.shadowColor = "transparent";
    s.painted = true;
  }
  scratchAt(a, b) {
    const ctx = this.sc.cv.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 46; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0] + 0.01, b[1]);
    ctx.stroke();
  }
  // Counts how much is scratched off (sampling every 16th pixel); over 55% → reveal
  scratchCheck() {
    const s = this.sc;
    if (s.done || !s.cv.width) return;
    const d = s.cv.getContext("2d").getImageData(0, 0, s.cv.width, s.cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 64) { total++; if (d[i] < 32) clear++; }
    if (clear / total > 0.55) this.scratchDone();
  }
  scratchDone() {
    const s = this.sc;
    s.done = true;
    s.wrap.classList.add("done");
    $(".js-gal-hint", s.box).textContent = "";
    const cap = $("#scratchCaption");
    cap.textContent = this.text(s.c.photo.caption || "");
    cap.hidden = false;
    this.app.confetti.burst(80);
    this.app.sfx.chime();
  }
}
