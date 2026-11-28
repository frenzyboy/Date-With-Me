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

  snap(quiet = false) {
    if (!quiet) { restart($("#flash"), "go"); this.app.sfx.shutter(); }
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
    this.wasShy = true;
    this.mascot.set("covered");
    this.note.textContent = fill(CONFIG.booth.shy);
    this.next.disabled = false;
    this.next.textContent = "Continue without photo";
  }
}
