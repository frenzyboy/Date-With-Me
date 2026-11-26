/* =========================================================
   MusicPlayer: background music, on by default, mute button top-right.
   Browsers block sound until the visitor taps, so it starts on her first tap.
   ========================================================= */
class MusicPlayer {
  constructor(audio, button) {
    this.audio = audio;
    this.btn = button;
    this.muted = false;
    this.audio.volume = 0.5;
    // touchend/click/pointerup count as a "real" tap on phones; touchstart alone does not
    this.startEvents = ["pointerdown", "pointerup", "touchend", "click", "keydown"];
    this.tryPlay = this.tryPlay.bind(this);
    this.startEvents.forEach(ev => document.addEventListener(ev, this.tryPlay, true));
    this.btn.addEventListener("click", () => {
      this.muted = !this.muted;
      if (this.muted) this.audio.pause(); else this.tryPlay();
      this.update();
    });
    this.audio.addEventListener("play", () => this.update());
    this.audio.addEventListener("pause", () => this.update());
    this.audio.addEventListener("error", () => { this.btn.hidden = true; });
    // Pause while the tab is in the background, resume when she comes back
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.audio.pause(); else if (!this.muted) this.tryPlay();
    });
    this.update();
    this.tryPlay();
  }
  tryPlay() {
    if (this.muted || !this.audio.paused) return;
    this.audio.play().then(() => {
      this.startEvents.forEach(ev => document.removeEventListener(ev, this.tryPlay, true));
      this.update();
    }).catch(() => {});
  }
  update() {
    this.btn.classList.toggle("muted", this.muted);
    this.btn.classList.toggle("playing", !this.muted && !this.audio.paused);
    this.btn.setAttribute("aria-pressed", String(this.muted));
    this.btn.setAttribute("aria-label", this.muted ? "Play music" : "Mute music");
  }
}
