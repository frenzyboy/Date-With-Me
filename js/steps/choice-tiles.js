/* =========================================================
   ChoiceTiles: a group of pick-one buttons (activities, dates, slots)
   ========================================================= */
class ChoiceTiles {
  constructor(container, items, { row = false, onPick, onBlocked } = {}) {
    this.container = container;
    items.forEach(it => container.appendChild(this.tile(it, row, onPick, onBlocked)));
  }
  tile(it, row, onPick, onBlocked) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tile" + (row ? " row" : "");
    b.dataset.id = it.id;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span class="emo" aria-hidden="true">${it.emo}</span><span class="t">${it.t}</span><span class="s">${it.s}</span>`;
    b.addEventListener("click", () => {
      if (it.blocked) {
        if (!b.querySelector(".deny")) b.insertAdjacentHTML("beforeend", '<span class="deny"><b>Not available<br>for you 💗</b></span>');
        b.classList.add("denied");
        restart(b, "shake");
        onBlocked && onBlocked(it);
        return;
      }
      $$(".tile", this.container).forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      onPick(it);
    });
    return b;
  }
  // Picks a tile by id, as if she tapped it (used when restoring progress)
  pick(id) {
    const b = $$(".tile", this.container).find(t => t.dataset.id === String(id));
    if (b) b.click();
  }
}
