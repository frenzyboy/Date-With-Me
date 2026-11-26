/* =========================================================
   FinalQuestion: step 6 (processing → brave pause → the question)
   ========================================================= */
class FinalQuestion {
  constructor(app) {
    this.app = app;
    this.box = $("#processing");
    this.brave = $("#brave");
    this.q = $("#question");
    this.mascot = new Mascot($("#bearQ"), "nervous");
    this.braveBear = new Mascot($("#bearBrave"), "nervous", "breathe");
    this.started = false;
  }

  async run() {
    if (this.started) return;
    this.started = true;
    const { pacer } = this.app;

    // 1) fake processing
    const lines = [
      ["Checking availability", "available"],
      ["Verifying applicant cuteness", "off the charts"],
      ["Calculating chemistry", "98.7%"],
      ["Consulting the stars", "they said yes"]
    ];
    this.box.innerHTML = "";
    for (const [text, result] of lines) {
      const row = document.createElement("div");
      row.innerHTML = text + DOTS;
      this.box.appendChild(row);
      await pacer.wait(1500);
      row.innerHTML = `${text} <span class="ok">✔ ${result}</span>`;
      await pacer.wait(350);
    }
    await pacer.wait(900);

    // 2) he needs a moment to be brave
    this.box.hidden = true;
    this.brave.hidden = false;
    await pacer.reveal([...this.brave.children]);
    const breath = $("#breath");
    for (const t of ["*deep breath in* 😮‍💨", "*deep breath out*", "Okay. Okay. I can do this. 💪"]) {
      breath.textContent = t;
      await pacer.wait(1200);
    }

    // 3) the question, in two parts
    this.brave.hidden = true;
    this.q.hidden = false;
    const [intro, bear, heading, answers, plead] = [...this.q.children];
    [intro, bear, heading, answers, plead].forEach(e => e.classList.add("pre"));
    $("#q1").textContent = `So, ${this.app.firstName()}…`;
    $("#q2").textContent = "";
    await pacer.reveal([intro, bear]);
    heading.classList.remove("pre");
    heading.focus({ preventScroll: true });
    await pacer.type($("#q1"), 60);
    await pacer.wait(1500);
    $("#q2").textContent = "will you go on this date with me? 💌";
    await pacer.type($("#q2"), 45);
    await pacer.wait(500);

    // 4) buttons appear, but stay disabled briefly so a leftover tap can't hit Yes
    const btns = $$(".btn", answers);
    answers.classList.add("arming");
    btns.forEach(b => b.disabled = true);
    pacer.show([answers, plead]);
    await pacer.wait(1500);
    answers.classList.remove("arming");
    btns.forEach(b => b.disabled = false);
  }
}
