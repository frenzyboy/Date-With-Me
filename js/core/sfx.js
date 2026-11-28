/* =========================================================
   Sfx: tiny sound effects made with Web Audio (no files).
   pop = tiles, stars, cards · thunk = stamps · shutter = camera · chime = she said yes.
   They keep playing when the music is muted (the mute button is only for the music).
   ========================================================= */
class Sfx {
  constructor(music) {
    this.music = music;
    this.ctx = null;
    this.quiet = false;   // true while progress is being restored (no sounds for replayed clicks)
    // A pop for anything she taps that picks something
    document.addEventListener("click", e => {
      if (e.target.closest(".tile:not(:disabled), .star, .flip-card, .seal")) this.pop();
    }, true);
  }

  audio() {
    if (this.quiet) return null;   // the mute button only mutes the music, not these
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    } catch { return null; }
  }

  tone(freqFrom, freqTo, dur, type = "sine", vol = 0.25, delay = 0) {
    const ctx = this.audio();
    if (!ctx) return;
    const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freqFrom, t);
    o.frequency.exponentialRampToValueAtTime(freqTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  noise(dur, vol, curve = 4) {
    const ctx = this.audio();
    if (!ctx) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, curve);
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buf; g.gain.value = vol;
    src.connect(g).connect(ctx.destination);
    src.start();
  }

  pop() { this.tone(520, 900, 0.09, "sine", 0.18); }
  blip() { this.tone(880, 1320, 0.07, "triangle", 0.12); }
  thunk() { this.tone(160, 55, 0.22, "sine", 0.55); this.noise(0.06, 0.25, 6); }
  shutter() { this.noise(0.09, 0.5); }
  chime() { [660, 880, 1320].forEach((f, i) => this.tone(f, f, 0.5, "sine", 0.14, i * 0.12)); }

  // A frog's "ribbit": two short croaks, each a low buzzy tone that pulses quickly
  ribbit() {
    const ctx = this.audio();
    if (!ctx) return;
    [[0, 0.12, 210, 150], [0.2, 0.17, 185, 115]].forEach(([at, dur, from, to]) => {
      const t = ctx.currentTime + at;
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      const pulse = ctx.createOscillator(), depth = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(from, t);
      o.frequency.exponentialRampToValueAtTime(to, t + dur);
      f.type = "bandpass"; f.frequency.value = 650; f.Q.value = 1.8;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.45, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      pulse.type = "square"; pulse.frequency.value = 36; depth.gain.value = 0.2;   // the "rrr" in ribbit
      pulse.connect(depth).connect(g.gain);
      o.connect(f).connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.03);
      pulse.start(t); pulse.stop(t + dur + 0.03);
    });
  }
}
