/* =========================================================
   Downloads: claude.ai's download feature, or a normal browser download elsewhere
   ========================================================= */
class Downloads {
  constructor() {
    this.api = null;
    this.onClaude = !!(window.claude && window.claude.use);
    this.init();
  }
  async init() {
    if (this.onClaude) {
      try { this.api = await window.claude.use("downloads"); } catch { this.api = null; }
      if (!this.api) return;
    }
    $$(".dl-btn").forEach(b => b.hidden = false);
  }
  plain(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  async save(getBlob, name, status, savedMsg) {
    try {
      const blob = await getBlob();
      if (!blob) throw { code: "not_ready" };
      if (this.api) await this.api.save({ filename: name, data: blob });
      else if (!this.onClaude) this.plain(blob, name);
      else return;
      status.textContent = savedMsg;
    } catch (e) {
      const code = e && e.code;
      if (code === "declined") status.textContent = "Download cancelled. You can try again anytime.";
      else if (code === "rate_limited") status.textContent = "One moment, then try again.";
      else if (code === "host_unavailable") status.textContent = "This app can't save files. Open the link in a browser, or take a screenshot instead.";
      else status.textContent = "Couldn't save it here. A screenshot works too 📸";
    }
  }
}
