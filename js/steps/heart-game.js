/* =========================================================
   HeartGame: step 8, a 10-second "catch the falling hearts" mini-game.
   She taps hearts (1 point) and honey jars (5 points). She always "wins".
   Texts and timing live in CONFIG.game.
   ========================================================= */
class HeartGame {
  constructor(app) {
    this.app = app;
    this.cfg = CONFIG.game;
    this.seconds = this.cfg.seconds;
    this.cv = $("#gameCanvas");
    this.ctx = this.cv.getContext("2d");
    this.items = [];
    this.pops = [];
    this.score = 0;
    this.best = null;
    this.running = false;
    this.w = 0; this.h = 0;
    this.mascot = new Mascot($("#bearGame"), "nervous");
    $("#gameSub").textContent = fill(this.cfg.intro);
    $("#gameStart").addEventListener("click", () => this.start());
    this.cv.addEventListener("pointerdown", e => this.tap(e));
    window.addEventListener("resize", () => this.resize());
  }

  // Call when the step becomes visible (the canvas has no size while hidden)
  resize() {
    const r = this.cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.w = r.width; this.h = r.height;
    this.cv.width = Math.round(r.width * dpr);
    this.cv.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  async start() {
    if (this.running) return;
    this.resize();
    const overlay = $("#gameOverlay"), title = $("#gameTitle");
    $("#gameStart").hidden = true;
    $("#gameSub").hidden = true;
    this.mascot.set("nervous");
    for (const n of ["3", "2", "1", "Go! 💘"]) {
      title.textContent = n;
      restart(title, "pop");
      await new Promise(r => setTimeout(r, 650));
    }
    overlay.hidden = true;
    this.items = []; this.pops = []; this.score = 0;
    this.updateHud(this.seconds);
    this.running = true;
    this.t0 = this.last = performance.now();
    this.nextSpawn = 0;
    requestAnimationFrame(t => this.loop(t));
  }

  spawn(elapsed) {
    const honey = Math.random() < this.cfg.honeyChance;
    const speedUp = 1 + elapsed / this.seconds;           // hearts fall a bit faster over time
    this.items.push({
      x: 26 + Math.random() * Math.max(0, this.w - 52),
      y: -24,
      vy: (95 + Math.random() * 75) * speedUp * (this.h / 340),
      size: honey ? 34 : 28 + Math.random() * 10,
      emo: honey ? this.cfg.honey : this.cfg.hearts[(Math.random() * this.cfg.hearts.length) | 0],
      value: honey ? this.cfg.honeyPoints : 1,
      phase: Math.random() * Math.PI * 2
    });
  }

  loop(t) {
    if (!this.running) return;
    const dt = Math.min(0.05, (t - this.last) / 1000), elapsed = (t - this.t0) / 1000;
    this.last = t;
    if (elapsed >= this.nextSpawn) {
      this.spawn(elapsed);
      this.nextSpawn = elapsed + Math.max(0.26, 0.5 - elapsed * 0.025);
    }
    this.items.forEach(it => { it.y += it.vy * dt; it.phase += dt * 3; });
    this.items = this.items.filter(it => it.y < this.h + 30);
    this.pops.forEach(p => p.t += dt);
    this.pops = this.pops.filter(p => p.t < 0.8);
    this.draw();
    this.updateHud(Math.max(0, this.seconds - elapsed));
    if (elapsed >= this.seconds) this.end();
    else requestAnimationFrame(n => this.loop(n));
  }

  tap(e) {
    if (!this.running) return;
    e.preventDefault();
    const r = this.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    let hit = null, best = Infinity;
    this.items.forEach(it => {
      const x = it.x + Math.sin(it.phase) * 8, d = Math.hypot(px - x, py - it.y);
      if (d < it.size * 0.8 + 14 && d < best) { best = d; hit = it; }
    });
    if (!hit) return;
    this.items.splice(this.items.indexOf(hit), 1);
    this.score += hit.value;
    this.pops.push({ x: hit.x, y: hit.y, text: "+" + hit.value, t: 0 });
    this.mascot.set("happy");
    clearTimeout(this.moodTimer);
    this.moodTimer = setTimeout(() => { if (this.running) this.mascot.set("nervous"); }, 500);
    try { navigator.vibrate && navigator.vibrate(12); } catch {}
  }

  draw() {
    const { ctx, w, h } = this;
    if (!w) return;
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    this.items.forEach(it => {
      ctx.font = `${it.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.fillText(it.emo, it.x + Math.sin(it.phase) * 8, it.y);
    });
    this.pops.forEach(p => {
      ctx.globalAlpha = 1 - p.t / 0.8;
      ctx.fillStyle = "#df3567";
      ctx.font = `800 ${22 + p.t * 10}px Nunito, sans-serif`;
      ctx.fillText(p.text, p.x, p.y - p.t * 60);
      ctx.globalAlpha = 1;
    });
  }

  updateHud(left) {
    $("#gameScore").textContent = this.score;
    $("#gameTime").textContent = left.toFixed(1);
  }

  end() {
    this.running = false;
    this.items = []; this.pops = [];
    this.draw();
    this.best = Math.max(this.best ?? 0, this.score);
    this.app.state.hearts = this.best;

    const text = (this.score < this.cfg.lowScore ? this.cfg.lowWin : this.cfg.highWin).replace("{score}", this.score);
    $("#gameTitle").textContent = fill(this.cfg.badge);
    $("#gameSub").textContent = fill(text);
    $("#gameSub").hidden = false;
    $("#gameStart").textContent = "Play again 🔁";
    $("#gameStart").hidden = false;
    $("#gameOverlay").hidden = false;
    restart($("#gameTitle"), "pop");
    this.mascot.set("happy");
    this.app.confetti.burst(70);
    $("#gameNext").hidden = false;
    $("#gameNext").disabled = false;
  }

  // Text for the ticket, e.g. "💘 14 hearts caught"
  label() {
    return this.best == null ? "💘 Skipped (heart already caught)" : `💘 ${this.best} hearts caught`;
  }
}
