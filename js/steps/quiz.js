/* =========================================================
   Quiz: step 4, "How well do you know {me}?"
   One question at a time. Right answers get a ✔ CORRECT stamp; wrong ones show the real answer.
   Questions live in CONFIG.quiz.
   ========================================================= */
class Quiz {
  constructor(app) {
    this.app = app;
    this.items = CONFIG.quiz;
    this.i = 0;
    this.score = 0;
    this.locked = false;
    this.mascot = new Mascot($("#bearQuiz"), "nervous");
    this.resultBear = new Mascot($("#bearQuizResult"), "shocked");
    this.opts = $("#quizOptions");
    this.note = $("#quizNote");
    this.nextQ = $("#quizNextQ");
    this.nextQ.addEventListener("click", () => this.advance());
    this.show();
  }

  show() {
    const q = this.items[this.i];
    this.locked = false;
    $("#quizCount").textContent = `Question ${this.i + 1} of ${this.items.length}`;
    $("#quizQ").textContent = fill(q.q);
    this.note.textContent = "";
    this.nextQ.hidden = true;
    this.mascot.set("nervous");
    this.opts.innerHTML = "";
    q.options.forEach((text, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = `<span class="t"></span>`;
      $(".t", b).textContent = text;
      b.addEventListener("click", () => this.answer(k, b));
      this.opts.appendChild(b);
    });
    restart($("#quizCard"), "swap");
  }

  stamp(tile, text, kind) {
    const s = document.createElement("span");
    s.className = "qstamp " + kind;
    s.textContent = text;
    tile.appendChild(s);
  }

  async answer(k, btn) {
    if (this.locked) return;
    this.locked = true;
    const q = this.items[this.i], tiles = $$(".tile", this.opts);
    const right = q.answer === "any" || q.answer === k;
    tiles.forEach(t => t.disabled = true);
    btn.setAttribute("aria-pressed", "true");
    if (right) {
      this.score++;
      this.stamp(btn, "✔ CORRECT", "good");
      this.mascot.set("happy");
      this.note.textContent = fill(q.yes);
    } else {
      this.stamp(btn, q.miss || "NOPE 😌", "bad");
      this.stamp(tiles[q.answer], "✔ THIS ONE", "good");
      this.mascot.set("sad");
      this.note.textContent = fill(q.no);
    }
    await this.app.pacer.wait(900);
    const last = this.i === this.items.length - 1;
    this.nextQ.textContent = last ? "See my result 💞" : "Next question →";
    this.nextQ.hidden = false;
  }

  advance() {
    if (this.i < this.items.length - 1) { this.i++; this.show(); }
    else this.result();
  }

  async result() {
    const { pacer } = this.app, R = CONFIG.quizResult;
    $("#quizCard").hidden = true;
    const box = $("#quizResult");
    box.hidden = false;
    this.resultBear.set("shocked");
    $("#quizResultText").textContent = "";
    $("#quizScore").textContent = "";

    // Count the percentage up from 0
    const el = $("#quizPercent"), dur = reduceMotion ? 0 : 1600 * pacer.speed, start = performance.now();
    await new Promise(done => {
      const tick = t => {
        const p = dur ? Math.min(1, (t - start) / dur) : 1;
        el.textContent = Math.round(R.percent * (1 - Math.pow(1 - p, 3)));
        p < 1 ? requestAnimationFrame(tick) : done();
      };
      requestAnimationFrame(tick);
    });

    this.app.state.quizScore = this.score;
    this.app.state.quizTotal = this.items.length;
    this.resultBear.set("happy");
    this.app.confetti.burst(60);
    $("#quizResultText").textContent = fill(R.text);
    $("#quizScore").textContent = fill(R.score).replace("{score}", this.score).replace("{total}", this.items.length);
    $("#quizNext").hidden = false;     // Continue only appears once the quiz is done
    $("#quizNext").disabled = false;
  }
}
