/* =========================================================
   Progress: remembers where she is, so a refresh doesn't start over.
   Kept in this browser only (localStorage); nothing is sent anywhere.
   App.collect() builds the snapshot and App.restore() puts it back.
   Add ?reset=1 to the link to forget everything and start fresh.
   ========================================================= */
class Progress {
  static KEY = "td14-progress-v1";

  constructor(collect) {
    this.collect = collect;
    this.timer = null;
    this.enabled = true;
    if (new URLSearchParams(location.search).has("reset")) this.clear();
    // Save shortly after anything she does
    ["click", "input", "change", "pointerup"].forEach(ev =>
      document.addEventListener(ev, () => this.soon(), true));
    window.addEventListener("pagehide", () => this.save());
  }

  load() {
    try { return JSON.parse(localStorage.getItem(Progress.KEY)) || null; } catch { return null; }
  }
  soon() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.save(), 500);
  }
  save() {
    if (!this.enabled) return;
    try { localStorage.setItem(Progress.KEY, JSON.stringify(this.collect())); }
    catch {
      // Storage full (a big selfie) or blocked: try once more without the photo
      try { const s = this.collect(); s.selfie = null; localStorage.setItem(Progress.KEY, JSON.stringify(s)); } catch {}
    }
  }
  clear() { try { localStorage.removeItem(Progress.KEY); } catch {} }
}
