/* =========================================================
   TicketRenderer: the downloadable ticket PNG, drawn on a canvas
   ========================================================= */
class TicketRenderer {
  constructor(app) { this.app = app; }

  static roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  async render() {
    const { state } = this.app, guest = this.app.fullName();
    const rr = TicketRenderer.roundRect;
    const css = getComputedStyle(document.documentElement);
    const v = n => css.getPropertyValue(n).trim();
    const display = v("--display"), body = v("--body"), mono = v("--mono");
    try {
      await Promise.all([
        document.fonts.load(`96px ${display}`), document.fonts.load(`800 42px ${body}`),
        document.fonts.load(`400 42px ${body}`), document.fonts.load(`600 30px ${body}`), document.fonts.load(`26px ${mono}`)
      ]);
    } catch {}
    const W = 1080;
    const c = document.createElement("canvas"); c.width = W; c.height = 10;
    let ctx = c.getContext("2d");
    const C = { paper: v("--paper"), dot: v("--paper-dot"), card: v("--card"), ink: v("--ink"),
                muted: v("--muted"), line: v("--line"), accent: v("--accent"), stamp: v("--stamp") };

    // Measure the agreement first so the image is exactly as long as it needs to be
    const TERM_FONT = `600 30px ${body}`, LH = 42, GAP = 22;
    const wrap = (text, maxW) => {
      const words = text.split(" "), lines = []; let line = "";
      words.forEach(w => {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
      });
      if (line) lines.push(line);
      return lines;
    };
    ctx.font = TERM_FONT;
    const termLines = CONFIG.terms.map(t => wrap(t.replace(/\*/g, ""), 920 - 116 - 60));
    const termsBodyH = termLines.reduce((s, l) => s + l.length * LH + GAP, 0);

    // Ticket rows (the card grows with them)
    const dateLong = fmtDate(state.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const rows = [
      ["GUEST OF HONOR", guest],
      ["ESCORT", CONFIG.MY_NAME],
      ["ACTIVITY", `${state.activity.emo} ${state.activity.t}`],
      ["DATE", dateLong, "Temporary hold · can be rescheduled"],
      ["TIME", `${state.slot.emo} ${state.slot.t}`],
      ["HEART CATCHER", this.app.game.label()],
      ["PICKUP LINES", this.app.pickup.label()],
      ["BEAR ON DUTY", `🐻 ${RUNTIME.bearName || "The bear"}`],
      ...CONFIG.moods.map(m => [m.label.toUpperCase(), this.app.moods.label(m.id)]),
      ["COMPATIBILITY", this.app.compatText()],
      ["REFUNDS", "No longer available 😌"]
    ];
    const subs = rows.filter(r => r[2]).length;
    const sig = this.app.signature, SIG_H = sig.signed() ? 150 : 0;
    const photo = await this.selfie();

    const X = 80, Y = 140, CW = 920, R = 40, band = 470;
    const CH = band + 90 + (rows.length - 1) * 118 + subs * 40 + 190;   // card height
    const TY = Y + CH + 60;                            // top of the agreement card
    const TH = 215 + termsBodyH + 190 + SIG_H;         // heading + terms + signature
    const H = TY + TH + 110;
    c.height = H;
    ctx = c.getContext("2d");

    // paper + dots
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.dot;
    for (let y = 12; y < H; y += 34) for (let x = 12; x < W; x += 34) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); }

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.muted; ctx.textAlign = "center";
    ctx.font = `500 26px ${mono}`;
    ctx.fillText("TEMPORARY DATE RESERVATION SYSTEM™ · FORM TD-14", W / 2, 95);

    // card
    ctx.save(); ctx.shadowColor = "rgba(63,18,41,.22)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
    rr(ctx, X, Y, CW, CH, R); ctx.fillStyle = C.card; ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, X, Y, CW, CH, R); ctx.clip();
    ctx.fillStyle = C.accent; ctx.fillRect(X, Y, CW, band);
    ctx.restore();

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffe1ea"; ctx.font = `500 28px ${mono}`;
    ctx.fillText("BOOKING CONFIRMED", X + 60, Y + 95);
    ctx.fillStyle = "#ffffff"; ctx.font = `96px ${display}`;
    ctx.fillText("It's a date! 💖", X + 56, Y + 215);
    ctx.font = `600 34px ${body}`;
    ctx.fillText("Your Temporary Date™ has been approved.", X + 60, Y + 300);
    ctx.fillText("Please arrive with your best smile.", X + 60, Y + 350);

    // perforation
    const py = Y + band;
    ctx.strokeStyle = C.line; ctx.lineWidth = 4; ctx.setLineDash([16, 12]);
    ctx.beginPath(); ctx.moveTo(X + 50, py); ctx.lineTo(X + CW - 50, py); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.paper;
    [X, X + CW].forEach(cx => { ctx.beginPath(); ctx.arc(cx, py, 30, 0, Math.PI * 2); ctx.fill(); });

    // her Polaroid, top right of the details (the first rows get narrower to make room)
    if (photo) this.polaroid(ctx, photo, X + CW - 270, py + 50, mono, C);

    // details
    let y = py + 90;
    rows.forEach(([label, value, sub], i) => {
      const maxW = photo && i < 3 ? CW - 120 - 260 : CW - 120;
      ctx.fillStyle = C.muted; ctx.font = `500 26px ${mono}`; ctx.fillText(label, X + 60, y);
      ctx.fillStyle = C.ink; ctx.font = `800 44px ${body}`; ctx.fillText(value, X + 60, y + 54, maxW);
      if (sub) { ctx.fillStyle = C.muted; ctx.font = `400 28px ${body}`; ctx.fillText(sub, X + 60, y + 96); y += 40; }
      y += 118;
    });

    // ticket line
    ctx.strokeStyle = C.line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X + 60, Y + CH - 110); ctx.lineTo(X + CW - 60, Y + CH - 110); ctx.stroke();
    ctx.fillStyle = C.muted; ctx.font = `500 30px ${mono}`;
    ctx.fillText(`TICKET ${state.ticketNo}`, X + 60, Y + CH - 55);
    ctx.textAlign = "right"; ctx.fillText("ADMIT: 2", X + CW - 60, Y + CH - 55);

    // stamp
    ctx.save();
    ctx.translate(X + CW - 190, Y + CH - 330); ctx.rotate(-0.21);
    ctx.globalAlpha = .85; ctx.strokeStyle = C.stamp; ctx.fillStyle = C.stamp; ctx.lineWidth = 6;
    ctx.font = `56px ${display}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const sw = ctx.measureText("APPROVED").width + 50;
    rr(ctx, -sw / 2, -46, sw, 92, 18); ctx.stroke();
    ctx.fillText("APPROVED", 0, 4);
    ctx.restore();

    // agreement card
    ctx.save(); ctx.shadowColor = "rgba(63,18,41,.18)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
    rr(ctx, X, TY, CW, TH, R); ctx.fillStyle = C.card; ctx.fill(); ctx.restore();
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.accent; ctx.font = `500 26px ${mono}`;
    ctx.fillText("THE FINE PRINT", X + 60, TY + 80);
    ctx.fillStyle = C.ink; ctx.font = `56px ${display}`;
    ctx.fillText("Temporary Date™ Agreement", X + 58, TY + 150, CW - 120);
    let ty = TY + 220;
    termLines.forEach((lines, i) => {
      ctx.fillStyle = C.accent; ctx.font = `500 28px ${mono}`;
      ctx.fillText(String(i + 1).padStart(2, "0"), X + 60, ty);
      ctx.fillStyle = C.ink; ctx.font = TERM_FONT;
      lines.forEach((ln, k) => ctx.fillText(ln, X + 116, ty + k * LH));
      ty += lines.length * LH + GAP;
    });

    // signature: her handwriting above the line
    ty += 10;
    if (SIG_H) { sig.draw(ctx, X + 60, ty, Math.min(440, (SIG_H - 10) / sig.ratio), C.ink, 5); ty += SIG_H; }
    ctx.strokeStyle = C.line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X + 60, ty); ctx.lineTo(X + CW - 60, ty); ctx.stroke();
    ctx.fillStyle = C.muted; ctx.font = `500 24px ${mono}`;
    ctx.fillText("AGREED & SIGNED BY", X + 60, ty + 55);
    ctx.textAlign = "right";
    ctx.fillText("DATE SIGNED", X + CW - 60, ty + 55);
    ctx.fillStyle = C.ink; ctx.font = `800 38px ${body}`;
    ctx.fillText(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), X + CW - 60, ty + 108);
    ctx.textAlign = "left";
    ctx.fillText(`${guest} ✔`, X + 60, ty + 108, CW - 420);

    // footer
    ctx.textAlign = "center"; ctx.fillStyle = C.muted; ctx.font = `600 28px ${body}`;
    ctx.fillText(`With love, ${CONFIG.MY_NAME} 💌`, W / 2, H - 45);

    return new Promise(res => c.toBlob(res, "image/png"));
  }

  // Her selfie as an image, or null if she skipped the photo booth
  async selfie() {
    const url = this.app.portrait.url;
    if (!url) return null;
    const img = new Image();
    img.src = url;
    try { await img.decode(); return img; } catch { return null; }
  }

  // A tilted Polaroid with the photo cropped to a square
  polaroid(ctx, img, x, y, mono, C) {
    const W = 210, P = 14, S = W - P * 2, Hh = S + P + 46;
    ctx.save();
    ctx.translate(x + W / 2, y + Hh / 2); ctx.rotate(0.07); ctx.translate(-W / 2, -Hh / 2);
    ctx.shadowColor = "rgba(63,18,41,.28)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Hh);
    ctx.shadowColor = "transparent";
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, P, P, S, S);
    ctx.fillStyle = C.muted; ctx.font = `500 18px ${mono}`; ctx.textAlign = "center";
    ctx.fillText("RATING: 11/10", W / 2, S + P + 32);
    ctx.restore();
  }
}
