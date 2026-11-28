/* =========================================================
   App: creates everything and connects the pieces
   ========================================================= */
class App {
  constructor() {
    const urlSpeed = parseFloat(new URLSearchParams(location.search).get("speed"));
    this.pacer = new Pacer(urlSpeed > 0 ? urlSpeed : CONFIG.speed);
    this.state = { activity: null, date: "", slot: null, ticketNo: "", quizScore: null, quizTotal: 0, moods: {}, hearts: null, pickups: [], roomSeen: false };
    this.answered = false;
    this.ticketBlob = null;
    // Opened from disk: make the name lock now. The published build already has it (tools/build.mjs).
    if (!CONFIG.NAME_LOCK) CONFIG.NAME_LOCK = NameLock.make(CONFIG.SECOND_NAME);

    $$(".js-me").forEach(el => el.textContent = CONFIG.MY_NAME);

    // shared parts
    this.confetti = new Confetti($("#confetti"));
    this.music = new MusicPlayer($("#bgm"), $("#musicBtn"));
    this.sfx = new Sfx(this.music);
    this.downloads = new Downloads();
    this.portrait = new PortraitRenderer();
    this.ticket = new TicketRenderer(this);
    this.wizard = new Wizard(this);
    this.buddy = new Buddy(this);
    this.egg = new EasterEgg(this);
    this.intro = new Intro(this);

    // one object per step
    this.gate = new NameGate(this);                    // 1
    this.bearName = new BearName(this);                // 2
    this.applicant = new ApplicantForm(this);          // 3
    this.booth = new PhotoBooth(this);                 // 4
    this.quiz = new Quiz(this);                        // 5
    this.setupChoices();                               // 6 activity, 9 schedule
    this.moods = new MoodSliders(this);                // 7
    this.pickup = new PickupLines(this);               // 8
    this.game = new HeartGame(this);                   // 10
    this.setupTerms();                                 // 11
    this.final = new FinalQuestion(this);              // 12
    this.runaway = new RunawayButton(this, this.final.mascot);
    new Mascot($("#bearT"), "happy");                  // ticket
    this.share = new Share(this);
    this.room = new SecretRoom(this);                  // after the ticket
    this.setupDownloads();
    this.setupBuddyReactions();
    this.setupRestart();

    if (PREVIEW_PORTRAIT) {
      $('section[data-key="gate"]').insertAdjacentElement("afterend", $(".portrait"));
      $("#selfie").addEventListener("change", () => setTimeout(() => this.portrait.draw(), 50));
    }

    this.progress = new Progress(() => this.collect());
    const saved = this.progress.load();
    // The envelope shows on every visit until she has got past the gate (nothing to restore before that)
    if (saved && saved.v === 1 && saved.intro && saved.gate) this.restore(saved);
    else this.intro.play().then(() => { this.introDone = true; this.wizard.go(1); });
  }

  firstName() { return this.applicant.firstName(); }
  // First name + second name, unless she already typed the second name in the first-name box
  fullName() {
    const first = this.firstName(), second = RUNTIME.secondName;
    if (!second) return first;
    return normalizeName(first).includes(normalizeName(second)) ? first : `${first} ${second}`;
  }

  // Called by the Wizard every time a step is shown
  onEnter(key, sec, fresh) {
    this.buddy.enter(key);
    this.progress && this.progress.save();
    if (key === "gate") return this.gate.enter(fresh);
    if (key === "final") return this.final.run();
    if (key === "terms") this.signature.resize();
    if (key === "game") this.game.resize();
    if (key === "ticket") setTimeout(() => this.sfx.thunk(), 1400 * this.pacer.speed);   // APPROVED stamp
    const parts = [...sec.children];
    if (!fresh) return this.pacer.show(parts);
    this.pacer.reveal(parts).then(() => { if (key === "ticket") this.showSaveRow(); });
  }

  setupChoices() {
    const note = $("#activityNote"), blockedTries = {};
    this.tiles = {};
    this.tiles.activity = new ChoiceTiles($("#activities"), CONFIG.activities, {
      onPick: it => {
        this.state.activity = it;
        note.classList.remove("warn");
        note.textContent = it.note;
        $("#activityNext").disabled = false;
        this.buddy.react("activity", it.id);
      },
      // Each try on a blocked tile shows the next message from its list
      onBlocked: it => {
        const lines = [].concat(it.blocked);
        blockedTries[it.id] = (blockedTries[it.id] || 0) + 1;
        note.classList.add("warn");
        note.textContent = fill(lines[(blockedTries[it.id] - 1) % lines.length]);
        this.buddy.react("activity", it.id);
      }
    });
    const checkSchedule = () => { $("#scheduleNext").disabled = !(this.state.date && this.state.slot); };
    const dateItems = CONFIG.dates.map(d => ({ ...d, t: fmtDate(d.id, { weekday: "short", month: "short", day: "numeric" }) }));
    this.tiles.dates = new ChoiceTiles($("#dates"), dateItems, { row: true, onPick: it => {
      this.state.date = it.id; checkSchedule(); this.buddy.react("misc", "date");
    } });
    this.tiles.slots = new ChoiceTiles($("#slots"), CONFIG.slots, { row: true, onPick: it => {
      this.state.slot = it; checkSchedule(); this.buddy.react("slots", it.id);
    } });
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
    let wasSigned = false;
    const check = () => {
      const signed = this.signature.signed();
      if (signed && !wasSigned) this.buddy.react("misc", "signed");
      wasSigned = signed;
      $("#termsNext").disabled = !($("#agree").checked && signed);
    };
    this.signature = new SignaturePad($("#signPad"), check);
    $("#agree").addEventListener("change", () => {
      if ($("#agree").checked && !this.signature.signed()) this.buddy.react("misc", "agree");
      check();
    });
  }

  // Little reactions from the corner bear to things on step 3
  setupBuddyReactions() {
    $("#cutest").addEventListener("click", () => this.buddy.react("misc", "cutest"));
    $("#noBackBtn").addEventListener("click", () => this.buddy.react("misc", "noBack"));
  }

  // "Start over": the first tap asks, the second clears saved progress and reloads from the envelope
  setupRestart() {
    const R = CONFIG.restart;
    $$(".js-restart").forEach(b => {
      let armed = false, timer = null;
      const reset = () => { armed = false; b.textContent = R.button; };
      reset();
      b.addEventListener("click", () => {
        if (!armed) {
          armed = true;
          b.textContent = R.confirm;
          restart(b, "shake");
          timer = setTimeout(reset, R.wait);
          return;
        }
        clearTimeout(timer);
        this.startOver();
      });
    });
  }

  startOver() {
    this.progress.enabled = false;   // so the save on page unload doesn't write it back
    this.progress.clear();
    location.reload();
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
    this.sfx.chime();
    this.state.ticketNo = "#LOVE-" + String(Math.floor(1000 + Math.random() * 9000));
    this.progress.save();
    await this.pacer.wait(4000);
    this.fillTicket();
    this.wizard.go(this.wizard.total + 1);
    this.confetti.burst(160);
    this.ticketBlob = this.ticket.render();
  }

  fillTicket() {
    const { state } = this;
    $("#tHer").textContent = this.fullName();
    $("#tActivity").textContent = `${state.activity.emo} ${state.activity.t}`;
    $("#tDate").textContent = fmtDate(state.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " (temporary, can be rescheduled)";
    $("#tTime").textContent = `${state.slot.emo} ${state.slot.t}`;
    $("#tHearts").textContent = this.game.label();
    $("#tPickup").textContent = this.pickup.label();
    $("#tBear").textContent = `🐻 ${RUNTIME.bearName || "The bear"}`;
    this.fillMoodRows();
    $("#tCompat").textContent = this.compatText();
    $("#tNo").textContent = state.ticketNo;
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

  // ---------- remember progress (see Progress)
  collect() {
    const s = this.state, cur = this.wizard.current;
    const key = this.room.isOpen ? "room" : cur ? this.wizard.section(cur).dataset.key : "gate";
    return {
      v: 1, key,
      intro: !!this.introDone,
      gate: this.gate.passed, second: RUNTIME.secondName, bear: RUNTIME.bearName,
      her: $("#herName").value,
      selfie: this.portrait.saved || null, shy: !!this.booth.wasShy,
      quiz: s.quizScore,
      activity: s.activity && s.activity.id, moods: s.moods, pickups: s.pickups,
      date: s.date, slot: s.slot && s.slot.id, hearts: s.hearts,
      agree: $("#agree").checked, sign: this.signature.strokes,
      yes: this.answered, ticketNo: s.ticketNo, roomSeen: s.roomSeen
    };
  }

  restore(d) {
    this.progress.enabled = false;
    this.sfx.quiet = true;
    this.introDone = true;
    this.intro.skip();
    try {
      if (d.gate && d.second) { RUNTIME.secondName = d.second; this.gate.pass(); }
      this.bearName.set(d.bear);
      if (d.her) { $("#herName").value = d.her; this.applicant.sync(); }
      if (d.selfie) { this.portrait.use(d.selfie); this.portrait.saved = d.selfie; this.booth.snap(true); }
      else if (d.shy) this.booth.shy();
      if (d.quiz != null) this.quiz.restore(d.quiz);
      if (d.activity) this.tiles.activity.pick(d.activity);
      Object.entries(d.moods || {}).forEach(([id, i]) => this.moods.set(id, i));
      this.pickup.restore(d.pickups);
      if (d.date) this.tiles.dates.pick(d.date);
      if (d.slot) this.tiles.slots.pick(d.slot);
      if (d.hearts != null) this.game.restore(d.hearts);
      if (d.agree) $("#agree").checked = true;
      this.signature.load(d.sign);
      $("#agree").dispatchEvent(new Event("change"));
      this.state.roomSeen = !!d.roomSeen;
    } catch (e) { console.warn("Couldn't restore everything", e); }
    this.sfx.quiet = false;
    this.progress.enabled = true;

    // She already said yes: straight to the secret room (her "home page")
    if (d.yes && d.ticketNo && this.state.activity && this.state.date && this.state.slot) {
      this.answered = true;
      this.state.ticketNo = d.ticketNo;
      this.final.started = true;
      this.fillTicket();
      this.ticketBlob = this.ticket.render();
      this.room.open();
      return;
    }
    // Otherwise back to the step she was on (the final question starts over from its beginning)
    const key = d.key && d.key !== "ticket" && d.key !== "room" ? d.key : "gate";
    const sec = $(`section[data-key="${key}"]`);
    this.wizard.go(d.gate && sec ? Number(sec.dataset.step) : 1);
  }
}

const app = new App();   // reachable from the browser console for testing, e.g. app.pacer.speed = 0.2
