/* =========================================================
   SignaturePad: step 9, she signs the agreement with her finger (or mouse).
   Strokes are stored relative to the pad's width, so they can be redrawn at any size
   (on screen after a resize, and on the downloadable ticket).
   ========================================================= */
class SignaturePad {
  constructor(canvas, onChange) {
    this.cv = canvas;
    this.onChange = onChange;
    this.strokes = [];
    this.cur = null;
    this.ratio = 0.3;   // height / width of the pad, updated on resize

    canvas.addEventListener("pointerdown", e => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      this.cur = [this.point(e)];
      this.strokes.push(this.cur);
      $("#signHint").hidden = true;
      this.redraw();
    });
    canvas.addEventListener("pointermove", e => {
      if (!this.cur) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (evs.length ? evs : [e]).forEach(ev => this.cur.push(this.point(ev)));
      this.redraw();
    });
    const end = () => { if (this.cur) { this.cur = null; this.onChange(this.signed()); } };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    $("#signClear").addEventListener("click", () => this.clear());
    window.addEventListener("resize", () => this.resize());
  }

  point(e) {
    const r = this.cv.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.width];
  }

  // Call when the pad becomes visible (it has no size while its step is hidden)
  resize() {
    const r = this.cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.cv.width = Math.round(r.width * dpr);
    this.cv.height = Math.round(r.height * dpr);
    this.ratio = r.height / r.width;
    this.redraw();
  }

  signed() { return this.strokes.reduce((n, s) => n + s.length, 0) >= 8; }

  clear() {
    this.strokes = [];
    $("#signHint").hidden = false;
    this.redraw();
    this.onChange(false);
  }

  // Draws the strokes into a box of width w at (x, y) on any canvas context
  draw(ctx, x, y, w, color, lineWidth) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.lineCap = "round"; ctx.lineJoin = "round";
    this.strokes.forEach(s => {
      const p = s.map(([px, py]) => [x + px * w, y + py * w]);
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      if (p.length === 1) ctx.lineTo(p[0][0] + 0.1, p[0][1]);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
        ctx.quadraticCurveTo(p[i][0], p[i][1], mx, my);
      }
      if (p.length > 1) ctx.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      ctx.stroke();
    });
    ctx.restore();
  }

  redraw() {
    const ctx = this.cv.getContext("2d"), w = this.cv.width;
    ctx.clearRect(0, 0, w, this.cv.height);
    this.draw(ctx, 0, 0, w, "#3f1229", 2.6 * (w / (this.cv.getBoundingClientRect().width || w)));
  }
}
