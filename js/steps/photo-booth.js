/* =========================================================
   PhotoBooth: step 3. The selfie drops into a Polaroid with a camera flash.
   (PortraitRenderer listens to the same file input and keeps the photo for the portrait.)
   ========================================================= */
class PhotoBooth {
  constructor(app) {
    this.app = app;
    this.mascot = new Mascot($("#bearBooth"), "camera");
    this.next = $("#boothNext");
    this.note = $("#boothNote");
    this.polaroid = $("#polaroid");
    $("#selfie").addEventListener("change", e => {
      const f = e.target.files && e.target.files[0];
      if (f && f.type.startsWith("image/")) this.snap();
    });
    $("#shyBtn").addEventListener("click", () => this.shy());
  }

  snap() {
    restart($("#flash"), "go");
    this.shutter();
    this.polaroid.classList.remove("empty");
    restart(this.polaroid, "drop");
    $("#polaroidCaption").textContent = CONFIG.booth.caption;
    this.mascot.set("happy");
    this.note.textContent = fill(CONFIG.booth.taken);
    $("#shyBtn").hidden = true;
    this.next.disabled = false;
    this.next.textContent = "Looks great ✔";
  }

  shy() {
    this.mascot.set("covered");
    this.note.textContent = fill(CONFIG.booth.shy);
    this.next.disabled = false;
    this.next.textContent = "Continue without photo";
  }

  // A tiny camera "click" made with Web Audio (only when the music isn't muted)
  shutter() {
    try {
      if (this.app.music.muted) return;
      const ctx = this.ctx || (this.ctx = new (window.AudioContext || window.webkitAudioContext)());
      const len = Math.floor(ctx.sampleRate * 0.09);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      const src = ctx.createBufferSource(), gain = ctx.createGain();
      src.buffer = buf; gain.gain.value = 0.5;
      src.connect(gain).connect(ctx.destination);
      src.start();
    } catch {}
  }
}
