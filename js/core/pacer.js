/* =========================================================
   Pacer: every wait and the typewriter effect, scaled by CONFIG.speed
   ========================================================= */
class Pacer {
  constructor(speed) { this.speed = speed; }
  wait(ms) { return new Promise(r => setTimeout(r, ms * this.speed)); }

  // Types out the text of an element letter by letter (keeps inner tags like <span>)
  async type(el, perChar = 38) {
    if (reduceMotion) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const texts = nodes.map(n => n.textContent);
    el.setAttribute("aria-label", el.textContent.trim());
    nodes.forEach(n => n.textContent = "");
    el.classList.add("typing");
    for (let i = 0; i < nodes.length; i++) {
      for (const ch of Array.from(texts[i])) {
        nodes[i].textContent += ch;
        if (ch !== " ") await this.wait(perChar);
      }
    }
    el.classList.remove("typing");
    el.removeAttribute("aria-label");
  }

  // Shows elements one after another; headings get typed out
  async reveal(els) {
    els = els.filter(e => !e.hidden);
    els.forEach(e => e.classList.add("pre"));
    for (const e of els) {
      e.classList.remove("pre");
      if (e.matches("h1, h2")) { await this.type(e); await this.wait(250); }
      else await this.wait(170);
    }
  }
  show(els) { els.forEach(e => e.classList.remove("pre")); }
}
