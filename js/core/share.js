/* =========================================================
   Share: "Send to {me}" under the ticket (optional, see CONFIG.share).
   On phones that can share files, it opens the share sheet with the ticket image
   (she picks WhatsApp, Messenger, …). Otherwise it opens WhatsApp with a text message,
   straight to CONFIG.share.whatsapp if a number is set.
   ========================================================= */
class Share {
  constructor(app) {
    this.app = app;
    this.btn = $("#shareBtn");
    this.status = $("#shareStatus");
    const cfg = CONFIG.share;
    if (!cfg || !cfg.enabled) { this.btn.hidden = true; return; }
    this.btn.hidden = false;
    this.btn.textContent = fill(cfg.button);
    this.btn.addEventListener("click", () => this.share());
  }

  text() {
    const s = this.app.state;
    return fill(CONFIG.share.text)
      .replaceAll("{her}", this.app.firstName())
      .replaceAll("{ticket}", s.ticketNo || "")
      .replaceAll("{activity}", s.activity ? `${s.activity.emo} ${s.activity.t}` : "")
      .replaceAll("{date}", s.date ? fmtDate(s.date, { weekday: "long", month: "long", day: "numeric" }) : "");
  }

  async share() {
    const text = this.text();
    try {
      const blob = await (this.app.ticketBlob || (this.app.ticketBlob = this.app.ticket.render()));
      const file = blob && new File([blob], "Temporary-Date-Ticket.png", { type: "image/png" });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text });
        this.status.textContent = fill(CONFIG.share.done);
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;   // she closed the share sheet
    }
    // Fallback: WhatsApp with the text (the image can be downloaded with the button above)
    const num = String(CONFIG.share.whatsapp || "").replace(/\D/g, "");
    const url = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
    const a = Object.assign(document.createElement("a"), { href: url, target: "_blank", rel: "noopener" });
    document.body.appendChild(a); a.click(); a.remove();
    this.status.textContent = fill(CONFIG.share.fallback);
  }
}
