/* =========================================================
   Confetti: confetti & hearts on a full-screen canvas
   ========================================================= */
class Confetti {
  constructor(canvas) { this.c = canvas; this.parts = []; this.running = false; }
  burst(count = 160) {
    if (reduceMotion) return;
    const colors = ["#df3567", "#ff8fab", "#ffc2d1", "#1f7a68", "#ffd166", "#ffffff"];
    for (let i = 0; i < count; i++) {
      this.parts.push({
        x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .35,
        vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4,
        size: 6 + Math.random() * 10, rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
        heart: Math.random() < .4, color: colors[(Math.random() * colors.length) | 0]
      });
    }
    if (!this.running) this.start();
  }
  start() {
    const c = this.c, ctx = c.getContext("2d"), dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.running = true;
    const frame = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      this.parts = this.parts.filter(p => p.y < innerHeight + 40);
      this.parts.forEach(p => {
        p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
        if (p.heart) { ctx.font = `${p.size * 1.6}px sans-serif`; ctx.fillText("❤", -p.size / 2, p.size / 2); }
        else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      if (this.parts.length) requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, innerWidth, innerHeight); this.running = false; }
    };
    requestAnimationFrame(frame);
  }
}
