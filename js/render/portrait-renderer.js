/* =========================================================
   PortraitRenderer: her selfie showing through the song lyrics
   The selfie stays in her browser; nothing is uploaded.
   ========================================================= */
class PortraitRenderer {
  static TEXT_ON_PAGE = "#000000";   // lyric color shown on the page
  static EXPORT_WIDTH = 1800;        // pixel width of the downloaded portrait

  constructor() {
    this.url = null;
    this.img = null;
    this.ratio = 0;      // lyric font size relative to width, so every size looks the same
    this.ready = false;
    $("#selfie").addEventListener("change", e => this.pick(e.target.files && e.target.files[0]));
  }

  pick(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = URL.createObjectURL(file);
    this.ready = false;
    const prev = $("#selfiePreview");
    prev.src = this.url; prev.hidden = false;
    $("#selfieIcon").hidden = true;
    $("#selfieTitle").textContent = "Looking good! ✔";
    $("#selfieHint").textContent = "Tap to change photo.";
  }

  async draw() {
    if (this.ready) return;
    const cv = $("#portraitCanvas"), fig = cv.closest(".portrait");
    if (!this.url) { fig.hidden = true; return; }   // no selfie → no portrait
    const img = new Image();
    img.src = this.url;
    try { await img.decode(); } catch { fig.hidden = true; return; }
    try { await document.fonts.load("400 10px Poppins"); } catch {}
    this.img = img;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const W = Math.round(Math.min(cv.clientWidth || 360, 440) * dpr);
    this.ratio = (5 * dpr) / W;
    this.paint(cv, PortraitRenderer.TEXT_ON_PAGE, W);
    this.ready = true;
  }

  paint(cv, textColor, W) {
    const img = this.img;
    const H = Math.round(W * img.naturalHeight / img.naturalWidth);
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");

    // 1) Lay out the lyrics as one continuous stream of small text, line after line
    const fs = W * this.ratio, lh = fs * 0.85;   // font size, line spacing (lower = tighter)
    const font = `400 ${fs}px Poppins, "Segoe UI", Arial, sans-serif`;
    ctx.font = font;
    const stream = LYRICS.replace(/\s*\n\s*/g, " · ") + " · ";
    const lines = [];
    let pos = 0;
    for (let y = fs; y < H + lh; y += lh) {
      let line = "";
      while (ctx.measureText(line).width < W + fs * 4) { line += stream[pos % stream.length]; pos++; }
      lines.push([line, y]);
    }

    // 2) Photo multiplied onto light grey (#ffffff = full photo, darker = dimmer), then the lyrics on top
    ctx.fillStyle = "#d0d0d0"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(img, 0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    ctx.font = font; ctx.fillStyle = textColor;
    lines.forEach(([t, y]) => ctx.fillText(t, -fs * 0.5, y));
  }

  blob(textColor) {
    if (!this.ready) return Promise.resolve(null);
    const c = document.createElement("canvas");
    this.paint(c, textColor, PortraitRenderer.EXPORT_WIDTH);
    return new Promise(res => c.toBlob(res, "image/jpeg", 0.92));
  }
}
