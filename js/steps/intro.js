/* =========================================================
   Intro: "You have 1 new letter 💌". She taps the sealed envelope,
   it opens, and the security checkpoint begins.
   Her first tap also starts the music.
   Tapping the page title at the top 5 times quickly plays it again (replay()).
   ========================================================= */
class Intro {
  constructor(app) {
    this.app = app;
    this.box = $("#intro");
    this.env = $("#introEnvelope");
    // Hidden replay: tap the title at the top 5 times in a row
    let taps = 0, last = 0;
    $(".masthead .sys").addEventListener("click", () => {
      const now = Date.now();
      taps = now - last < 1500 ? taps + 1 : 1;
      last = now;
      if (taps >= 5) { taps = 0; this.replay(); }
    });
  }

  // Shows the envelope again; her progress stays where it was
  replay() {
    if (!this.box.hidden) return;
    this.env.classList.remove("open");
    this.box.classList.remove("leave");
    this.play();
  }

  // Resolves once she has opened the envelope
  play() {
    document.body.classList.add("intro-on");
    this.box.hidden = false;
    $("#introTitle").textContent = fill(CONFIG.intro.title);
    $("#introHint").textContent = fill(CONFIG.intro.hint);
    $("#introLetter").textContent = fill(CONFIG.intro.letter);
    return new Promise(done => {
      const open = async () => {
        if (this.env.classList.contains("open")) return;
        this.env.classList.add("open");
        this.app.sfx.pop();
        $("#introHint").textContent = "";
        await this.app.pacer.wait(3400); // animation (~1.7s) + time to read the letter
        this.box.classList.add("leave");
        await this.app.pacer.wait(600);
        this.box.hidden = true;
        document.body.classList.remove("intro-on");
        done();
      };
      this.env.addEventListener("click", open, { once: true });
    });
  }

  skip() { this.box.hidden = true; document.body.classList.remove("intro-on"); }
}
