/* =========================================================
   MoodSliders: step 6, silly sliders (hunger, laugh, talk) from CONFIG.moods.
   Every stop has its own reply from {me}.
   ========================================================= */
class MoodSliders {
  constructor(app) {
    this.app = app;
    this.note = $("#moodNote");
    app.state.moods = {};
    CONFIG.moods.forEach(m => $("#sliders").appendChild(this.slider(m)));
  }

  slider(m) {
    const start = Math.floor(m.stops.length / 2);
    this.app.state.moods[m.id] = start;

    const box = document.createElement("div");
    box.className = "slider";
    box.innerHTML = `
      <div class="slider-head">
        <label class="label" for="mood-${m.id}"></label>
        <span class="slider-value" aria-hidden="true"></span>
      </div>
      <input type="range" id="mood-${m.id}" min="0" max="${m.stops.length - 1}" step="1" value="${start}">
      <div class="slider-ends" aria-hidden="true"><span></span><span></span></div>`;
    $("label", box).textContent = m.label;
    const ends = $$(".slider-ends span", box);
    ends[0].textContent = m.stops[0];
    ends[1].textContent = m.stops[m.stops.length - 1];

    const input = $("input", box), value = $(".slider-value", box);
    const update = announce => {
      const i = Number(input.value);
      this.app.state.moods[m.id] = i;
      value.textContent = m.stops[i];
      input.setAttribute("aria-valuetext", m.stops[i]);
      if (announce) {
        restart(value, "bump");
        this.note.textContent = fill(m.replies[i]);
      }
    };
    input.addEventListener("input", () => update(true));
    update(false);
    return box;
  }

  label(id) {
    const m = CONFIG.moods.find(x => x.id === id);
    return m ? m.stops[this.app.state.moods[id]] : "";
  }
}
