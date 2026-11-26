/* =========================================================
   App: creates everything and connects the pieces
   ========================================================= */
class App {
  constructor() {
    const urlSpeed = parseFloat(new URLSearchParams(location.search).get("speed"));
    this.pacer = new Pacer(urlSpeed > 0 ? urlSpeed : CONFIG.speed);
    this.state = { activity: null, date: "", slot: null, ticketNo: "", quizScore: null, quizTotal: 0, moods: {}, hearts: null };
    this.answered = false;
    this.ticketBlob = null;

    $$(".js-me").forEach(el => el.textContent = CONFIG.MY_NAME);
    $$(".js-second").forEach(el => el.textContent = CONFIG.SECOND_NAME);

    // shared parts
    this.confetti = new Confetti($("#confetti"));
    this.music = new MusicPlayer($("#bgm"), $("#musicBtn"));
    this.downloads = new Downloads();
    this.portrait = new PortraitRenderer();
    this.ticket = new TicketRenderer(this);
    this.wizard = new Wizard(this);

    // one object per step
    this.gate = new NameGate(this);                    // 1
    this.applicant = new ApplicantForm(this);          // 2
    this.booth = new PhotoBooth(this);                 // 3
    this.quiz = new Quiz(this);                        // 4
    this.setupChoices();                               // 5 activity, 7 schedule
    this.moods = new MoodSliders(this);                // 6
    this.game = new HeartGame(this);                   // 8
    this.setupTerms();                                 // 9
    this.final = new FinalQuestion(this);              // 10
    this.runaway = new RunawayButton(this, this.final.mascot);
    new Mascot($("#bearT"), "happy");                  // ticket
    this.setupDownloads();

    if (PREVIEW_PORTRAIT) {
      $('section[data-key="gate"]').insertAdjacentElement("afterend", $(".portrait"));
      $("#selfie").addEventListener("change", () => setTimeout(() => this.portrait.draw(), 50));
    }
    this.wizard.go(1);
  }

  firstName() { return this.applicant.firstName(); }
  // First name + second name, unless she already typed the second name in the first-name box
  fullName() {
    const first = this.firstName();
    return normalizeName(first).includes(normalizeName(CONFIG.SECOND_NAME)) ? first : `${first} ${CONFIG.SECOND_NAME}`;
  }

  // Called by the Wizard every time a step is shown
  onEnter(key, sec, fresh) {
    if (key === "gate") return this.gate.enter(fresh);
    if (key === "final") return this.final.run();
    if (key === "terms") this.signature.resize();
    if (key === "game") this.game.resize();
    const parts = [...sec.children];
    if (!fresh) return this.pacer.show(parts);
    this.pacer.reveal(parts).then(() => { if (key === "ticket") this.showSaveRow(); });
  }

  setupChoices() {
    const note = $("#activityNote");
    new ChoiceTiles($("#activities"), CONFIG.activities, {
      onPick: it => {
        this.state.activity = it;
        note.classList.remove("warn");
        note.textContent = it.note;
        $("#activityNext").disabled = false;
      },
      onBlocked: it => { note.classList.add("warn"); note.textContent = it.blocked; }
    });
    const checkSchedule = () => { $("#scheduleNext").disabled = !(this.state.date && this.state.slot); };
    const dateItems = CONFIG.dates.map(d => ({ ...d, t: fmtDate(d.id, { weekday: "short", month: "short", day: "numeric" }) }));
    new ChoiceTiles($("#dates"), dateItems, { row: true, onPick: it => { this.state.date = it.id; checkSchedule(); } });
    new ChoiceTiles($("#slots"), CONFIG.slots, { row: true, onPick: it => { this.state.slot = it; checkSchedule(); } });
  }

  // Terms list (*word* = italics) + "I agree" + signature; Submit needs both
  setupTerms() {
    CONFIG.terms.forEach(t => {
      const li = document.createElement("li");
      t.split(/(\*[^*]+\*)/).forEach(part => {
        if (/^\*[^*]+\*$/.test(part)) li.appendChild(Object.assign(document.createElement("em"), { textContent: part.slice(1, -1) }));
        else if (part) li.appendChild(document.createTextNode(part));
      });
      $("#terms").appendChild(li);
    });
    const check = () => { $("#termsNext").disabled = !($("#agree").checked && this.signature.signed()); };
    this.signature = new SignaturePad($("#signPad"), check);
    $("#agree").addEventListener("change", check);
  }

  setupDownloads() {
    const who = () => fileSafe(this.fullName());
    $("#dlBtn").addEventListener("click", () => this.downloads.save(
      () => (this.ticketBlob || (this.ticketBlob = this.ticket.render())),
      `Temporary-Date-Ticket-${who()}.png`, $("#dlStatus"),
      `Ticket saved! Now send it to ${CONFIG.MY_NAME} 💖`
    ));
    [["#portraitBlackBtn", "#000000", "Black", "black"], ["#portraitWhiteBtn", "#ffffff", "White", "white"]].forEach(([id, color, word, lower]) => {
      $(id).addEventListener("click", () => this.downloads.save(
        () => this.portrait.blob(color),
        `For-${who()}-Every-Word-${word}.jpg`, $("#portraitStatus"),
        `Portrait saved (${lower} lyrics) 💌`
      ));
    });
  }

  // Ticket texts shared by the page and the downloadable image
  compatText() {
    const { quizScore, quizTotal } = this.state;
    return `💞 ${CONFIG.quizResult.percent}%` + (quizScore != null ? ` (quiz: ${quizScore}/${quizTotal})` : "");
  }

  // She said yes: happy bear, a long happy moment, then the ticket
  async sayYes() {
    if (this.answered) return;
    this.answered = true;
    this.final.mascot.set("happy");
    this.runaway.finish();
    this.confetti.burst(60);
    await this.pacer.wait(4000);

    const { state } = this;
    $("#tHer").textContent = this.fullName();
    $("#tActivity").textContent = `${state.activity.emo} ${state.activity.t}`;
    $("#tDate").textContent = fmtDate(state.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " (temporary, can be rescheduled)";
    $("#tTime").textContent = `${state.slot.emo} ${state.slot.t}`;
    $("#tHearts").textContent = this.game.label();
    this.fillMoodRows();
    $("#tCompat").textContent = this.compatText();
    state.ticketNo = "#LOVE-" + String(Math.floor(1000 + Math.random() * 9000));
    $("#tNo").textContent = state.ticketNo;
    this.wizard.go(this.wizard.total + 1);
    this.confetti.burst(160);
    this.ticketBlob = this.ticket.render();
  }

  // One ticket row per mood slider, e.g. "Laugh level: 🤣 Can't breathe"
  fillMoodRows() {
    const slot = $("#tMoods");
    $$(".js-mood-row").forEach(el => el.remove());
    CONFIG.moods.forEach(m => {
      const dt = Object.assign(document.createElement("dt"), { className: "js-mood-row", textContent: m.label });
      const dd = Object.assign(document.createElement("dd"), { className: "js-mood-row", textContent: this.moods.label(m.id) });
      slot.before(dt, dd);
    });
  }

  async showSaveRow() {
    const row = $("#saveRow");
    row.classList.add("pre");
    row.hidden = false;
    await this.portrait.draw();          // needs the row visible to measure its width
    this.pacer.show([row]);
  }
}

const app = new App();   // reachable from the browser console for testing, e.g. app.pacer.speed = 0.2
