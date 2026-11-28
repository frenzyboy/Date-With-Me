/* =========================================================
   Secret room: a small home page after the ticket.
   Sealed love letter, countdown + add to calendar, photo carousel,
   "reasons I like you" flip cards, a note about the date, a note from {me},
   and a button back to the registration (the ticket).
   Not a wizard step, so it doesn't change the progress count.
   Texts live in CONFIG.room.
   ========================================================= */
class SecretRoom {
  constructor(app) {
    this.app = app;
    this.sec = $("#room");
    this.track = $("#carTrack");
    this.dots = $("#carDots");
    this.index = 0;
    this.timer = null;
    this.clock = null;
    this.built = false;
    this.isOpen = false;
    this.mascot = new Mascot($("#bearRoom"), "happy");

    $("#roomBtn").addEventListener("click", () => this.open());
    $("#roomBack").addEventListener("click", () => this.close());
    $("#carPrev").addEventListener("click", () => { this.stopAuto(); this.goTo(this.index - 1); });
    $("#carNext").addEventListener("click", () => { this.stopAuto(); this.goTo(this.index + 1); });
    this.track.addEventListener("pointerdown", () => this.stopAuto());
    this.track.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { e.preventDefault(); this.stopAuto(); this.goTo(this.index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); this.stopAuto(); this.goTo(this.index + 1); }
    });
    // Swiping scrolls the track natively; keep the dots in sync
    let t;
    this.track.addEventListener("scroll", () => {
      clearTimeout(t);
      t = setTimeout(() => this.mark(Math.round(this.track.scrollLeft / this.track.clientWidth)), 60);
    });
    // The letter and the doors open one at a time (see oneAtATime)
    this.opening = false;
    this.savedHints = new Map();
    const once = (id, hint, open) => $(id).addEventListener("click", () => this.oneAtATime($(id), $(hint), open));
    once("#letterEnv", "#letterHint", () => this.openLetter());
    // Message doors: a knock-knock joke first, then the door opens
    once("#secretDoor", "#doorHint", async () => {
      if (!(await this.knock($("#secretDoor"), CONFIG.room.door.knock, $("#doorHint"), $("#doorKnock")))) return;
      await this.openDoor();
    });
    once("#lastDoor", "#lastDoorHint", async () => {
      if (!(await this.knock($("#lastDoor"), CONFIG.room.lastDoor.knock, $("#lastDoorHint"), $("#lastDoorKnock")))) return;
      await this.openDoor($("#lastDoor"), CONFIG.room.lastDoor, $("#lastDoorHint"), $("#lastDoorBody"));
    });
    this.prankTaps = 0;
    once("#prankDoor", "#prankHint", () => this.knockPrank());
    this.gallery = new Gallery(app, s => this.text(s));
    $("#calBtn").addEventListener("click", () => this.saveCalendar());
    this.buildReasons();
  }

  // Texts with {me}, {name}, {her}, {bear}, {activity}, {date}, {time}
  text(s) {
    const { state } = this.app;
    return fill(s)
      .replaceAll("{her}", this.app.firstName())
      .replaceAll("{activity}", state.activity ? `${state.activity.emo} ${state.activity.t}` : "Our date")
      .replaceAll("{date}", state.date ? fmtDate(state.date, { weekday: "long", month: "long", day: "numeric" }) : "the day we pick")
      .replaceAll("{time}", state.slot ? state.slot.t.toLowerCase() : "whenever suits you");
  }

  fillTexts() {
    const R = CONFIG.room;
    const set = (id, s) => { $(id).textContent = this.text(s); };
    set("#roomTitle", R.title);
    set("#roomIntro", R.intro);
    set("#noticeTitle", R.notice.title);
    set("#noticeStatus", R.notice.status);
    set("#noticeStamp", R.notice.stamp);
    $("#noticeText").replaceChildren(...R.notice.lines.map(l => Object.assign(document.createElement("p"), { textContent: this.text(l) })));
    set("#letterTitle", R.letterTitle);
    if (!$("#letterEnv").classList.contains("open")) set("#letterHint", R.letterHint);
    set("#countTitle", R.countdownTitle);
    set("#calBtn", R.calendarBtn);
    set("#reasonsTitle", R.reasonsTitle);
    set("#reasonsHint", R.reasonsHint);
    set("#roomDateTitle", R.dateTitle);
    set("#roomDateNote", R.dateNote);
    set("#roomMeTitle", R.meTitle);
    set("#roomMeNote", R.meNote);
    set("#roomSign", R.sign);
    set("#doorTitle", R.door.title);
    set("#doorSign", R.door.sign);
    if (!$("#secretDoor").classList.contains("open")) set("#doorHint", R.door.hint);
    set("#lastDoorTitle", R.lastDoor.title);
    set("#lastDoorSign", R.lastDoor.sign);
    if (!$("#lastDoor").classList.contains("open")) set("#lastDoorHint", R.lastDoor.hint);
    set("#prankTitle", R.prank.title);
    set("#prankSign", R.prank.sign);
    set("#prankSorry", R.prank.sorry);
    if (!this.prankTaps) set("#prankHint", R.prank.hint);
    $("#roomBackLabel").textContent = R.back;
    $$(".js-ticket-no").forEach(el => el.textContent = this.app.state.ticketNo || "#LOVE");
  }

  // ---------- love letter: tap the seal, then the paragraphs type out
  async openLetter() {
    const env = $("#letterEnv");
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    $("#letterHint").textContent = "";
    const body = $("#letterBody");
    body.innerHTML = "";
    body.hidden = false;
    await this.app.pacer.wait(900);
    const R = CONFIG.room;
    for (const para of [...R.letter, R.letterSign]) {
      const p = document.createElement("p");
      p.textContent = this.text(para);
      if (para === R.letterSign) p.className = "room-sign";
      body.appendChild(p);
      await this.app.pacer.type(p, 28);
      await this.app.pacer.wait(350);
    }
  }

  // ---------- one at a time: while a letter/door is still opening (its message typing out),
  // tapping another one only rattles it and shows CONFIG.room.oneAtATime for a moment
  async oneAtATime(el, hint, open) {
    if (el.classList.contains("open") || this.current === el) return;   // already open, or busy opening this one
    if (this.opening) {
      restart(el, "rattle");
      this.app.sfx.thunk();
      if (!this.savedHints.has(hint)) this.savedHints.set(hint, hint.textContent);
      hint.textContent = this.text(CONFIG.room.oneAtATime);
      clearTimeout(hint.restoreTimer);
      hint.restoreTimer = setTimeout(() => {
        if (!el.classList.contains("open")) hint.textContent = this.savedHints.get(hint);
        this.savedHints.delete(hint);
      }, 2600);
      return;
    }
    this.opening = true;
    this.current = el;
    try { await open(); } finally { this.opening = false; this.current = null; }
  }

  // ---------- knock-knock before a message door opens.
  // lines alternate: the door says [0], she answers [1] (a button), the door says [2], … ; the last line is the door's.
  // Resolves true once the joke is done (the door may open). Played once per door.
  async knock(door, lines, hint, box) {
    if (!lines || !lines.length || door.dataset.knocked) return true;
    const { pacer, sfx } = this.app;
    hint.textContent = "";
    box.innerHTML = "";
    box.hidden = false;
    const say = (text, who) => {
      const p = Object.assign(document.createElement("p"), { className: `knock-line ${who} pop`, textContent: this.text(text) });
      box.appendChild(p);
      return p;
    };
    for (let i = 0; i < lines.length; i++) {
      if (i % 2 === 0) {
        if (i === 0) {   // two knocks on the door
          for (let k = 0; k < 2; k++) { restart(door, "rattle"); sfx.thunk(); await pacer.wait(280); }
        }
        say(lines[i], "door");
        await pacer.wait(i === lines.length - 1 ? 1400 : 500);
      } else {
        const b = Object.assign(document.createElement("button"), { type: "button", className: "btn knock-reply", textContent: this.text(lines[i]) });
        box.appendChild(b);
        b.focus({ preventScroll: true });
        await new Promise(r => b.addEventListener("click", r, { once: true }));
        sfx.pop();
        b.remove();
        say(lines[i], "her");
        await pacer.wait(700);
      }
    }
    door.dataset.knocked = "1";
    return true;
  }

  // ---------- prank door: rattles and refuses until the last tap, then opens on a frog saying sorry
  async knockPrank() {
    const door = $("#prankDoor"), P = CONFIG.room.prank, hint = $("#prankHint");
    if (door.classList.contains("open")) return;
    this.prankTaps++;
    if (this.prankTaps < P.taps) {
      restart(door, "rattle");
      this.app.sfx.thunk();
      hint.textContent = this.text(P.refusals[Math.min(this.prankTaps, P.refusals.length) - 1]);
      return;
    }
    door.classList.add("open");
    door.setAttribute("aria-label", "The door is open: a frog saying sorry");
    this.app.sfx.pop();
    hint.textContent = "";
    await this.app.pacer.wait(600);
    this.app.sfx.ribbit();                // the frog hops up
    await this.app.pacer.wait(500);
    hint.textContent = this.text(P.reveal);
    await this.app.pacer.wait(400);
    this.app.sfx.ribbit();                // and says sorry once more
    await this.app.pacer.wait(1500);   // a moment to read it before the next door can open
  }

  // ---------- message doors: it swings open, then the message types out
  // (#secretDoor uses CONFIG.room.door, #lastDoor uses CONFIG.room.lastDoor)
  async openDoor(door = $("#secretDoor"), D = CONFIG.room.door, hint = $("#doorHint"), body = $("#doorBody")) {
    if (door.classList.contains("open")) return;
    door.classList.add("open");
    door.setAttribute("aria-label", "The door is open");
    this.app.sfx.pop();
    hint.textContent = "";
    body.innerHTML = "";
    body.hidden = false;
    await this.app.pacer.wait(1100);
    for (const para of [...D.message, D.messageSign]) {
      const p = document.createElement("p");
      p.textContent = this.text(para);
      if (para === D.messageSign) p.className = "room-sign";
      body.appendChild(p);
      await this.app.pacer.type(p, 28);
      await this.app.pacer.wait(450);
    }
  }

  // ---------- countdown to the chosen date and time slot
  target() {
    const { date, slot } = this.app.state;
    if (!date) return null;
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d, slot && slot.hour != null ? slot.hour : 12, 0, 0);
  }
  tick() {
    const t = this.target(), box = $("#countBoxes"), msg = $("#countMsg");
    if (!t) { box.hidden = true; return; }
    const ms = t - Date.now();
    const sameDay = new Date().toDateString() === t.toDateString();
    if (ms <= 0) {
      box.hidden = true;
      msg.textContent = this.text(sameDay ? CONFIG.room.countdownToday : CONFIG.room.countdownPast);
      return;
    }
    box.hidden = false;
    msg.textContent = this.text("{activity} · {date}, {time}");
    const s = Math.floor(ms / 1000);
    const parts = { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, mins: Math.floor(s / 60) % 60, secs: s % 60 };
    Object.entries(parts).forEach(([k, v]) => { $(`#cd-${k}`).textContent = String(v).padStart(2, "0"); });
  }

  // ---------- add to calendar (.ics file)
  saveCalendar() {
    const t = this.target();
    if (!t) return;
    const pad = n => String(n).padStart(2, "0");
    const stamp = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const end = new Date(t.getTime() + CONFIG.room.calendarHours * 3600000);
    const esc = s => s.replace(/[\\;,]/g, m => "\\" + m).replace(/\n/g, "\\n");
    const now = new Date();
    const utc = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Temporary Date Reservation System//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${(this.app.state.ticketNo || "date").replace(/\W/g, "")}-${stamp(t)}@temporary-date`,
      `DTSTAMP:${utc}`,
      `DTSTART:${stamp(t)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${esc(this.text(CONFIG.room.calendarTitle))}`,
      `DESCRIPTION:${esc(this.text("{activity}. Ticket " + (this.app.state.ticketNo || "") + ". Bring your best smile."))}`,
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Date in 2 hours 💖", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    this.app.downloads.save(
      () => new Blob([ics], { type: "text/calendar" }),
      "Temporary-Date.ics", $("#calStatus"), "Saved! Open the file to add it to your calendar 📅"
    );
  }

  // ---------- "reasons I like you" flip cards
  buildReasons() {
    const grid = $("#reasons");
    CONFIG.room.reasons.forEach((r, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "flip-card";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = `<span class="flip-inner"><span class="flip-front"><span class="flip-emo"></span><span class="flip-no"></span></span><span class="flip-back"></span></span>`;
      $(".flip-emo", b).textContent = r.front;
      $(".flip-no", b).textContent = `Reason #${i + 1}`;
      b.setAttribute("aria-label", `Reason ${i + 1}`);
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(on));
        $(".flip-back", b).textContent = on ? this.text(r.back) : "";
        b.setAttribute("aria-label", on ? this.text(r.back) : `Reason ${i + 1}`);
      });
      grid.appendChild(b);
    });
  }

  // ---------- photo carousel: her selfie first (if she took one), then CONFIG.room.photos
  buildSlides() {
    const photos = [...CONFIG.room.photos];
    if (this.app.portrait.url) photos.unshift({ src: this.app.portrait.url, caption: "The cutest applicant 📸" });

    this.track.innerHTML = "";
    this.dots.innerHTML = "";
    photos.forEach((p, i) => {
      const fig = document.createElement("figure");
      fig.className = "slide";
      fig.setAttribute("role", "group");
      fig.setAttribute("aria-roledescription", "slide");
      fig.setAttribute("aria-label", `${i + 1} of ${photos.length}`);
      const frame = document.createElement("div");
      frame.className = "slide-img" + (p.src ? "" : ` sample s${i % 4}`);
      if (p.src) frame.appendChild(Object.assign(document.createElement("img"), { src: p.src, alt: p.caption || "Photo", loading: "lazy" }));
      else frame.innerHTML = `<span class="sample-emo" aria-hidden="true">${p.emo || "💗"}</span><span class="sample-tag">Sample</span>`;
      fig.append(frame, Object.assign(document.createElement("figcaption"), { textContent: this.text(p.caption || "") }));
      this.track.appendChild(fig);

      const dot = Object.assign(document.createElement("button"), { type: "button", className: "car-dot" });
      dot.setAttribute("aria-label", `Photo ${i + 1}`);
      dot.addEventListener("click", () => { this.stopAuto(); this.goTo(i); });
      this.dots.appendChild(dot);
    });
    this.count = photos.length;
    $("#carousel").hidden = !photos.length;
    [$("#carPrev"), $("#carNext"), this.dots].forEach(el => el.hidden = photos.length < 2);
    this.mark(0);
  }

  goTo(i) {
    if (!this.count) return;
    i = (i + this.count) % this.count;
    this.track.scrollTo({ left: i * this.track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    this.mark(i);
  }
  mark(i) {
    this.index = i;
    $$(".car-dot", this.dots).forEach((d, n) => d.setAttribute("aria-current", n === i ? "true" : "false"));
  }

  startAuto() {
    this.stopAuto();
    if (reduceMotion || this.count < 2 || !this.isOpen) return;
    this.timer = setInterval(() => this.goTo(this.index + 1), 4500);
  }
  stopAuto() { clearInterval(this.timer); this.timer = null; }

  open() {
    this.isOpen = true;
    this.app.state.roomSeen = true;
    this.fillTexts();
    this.buildSlides();
    $$("section[data-step]").forEach(s => s.hidden = true);
    $("#saveRow").hidden = true;
    this.app.buddy.enter("room");
    this.sec.hidden = false;
    restart(this.sec, "enter");
    this.gallery.open();
    $("#stepLabel").textContent = "Secret room 🔐";
    $("#stepStatus").textContent = "Members only ✔";
    $("#fill").style.width = "100%";
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    $("#roomTitle").focus({ preventScroll: true });
    this.track.scrollLeft = 0;
    this.app.confetti.burst(40);
    this.tick();
    clearInterval(this.clock);
    this.clock = setInterval(() => this.tick(), 1000);

    const parts = [...this.sec.children];
    const reveal = this.built ? this.app.pacer.show(parts) : this.app.pacer.reveal(parts);
    this.built = true;
    Promise.resolve(reveal).then(() => this.startAuto());
    this.app.progress.save();
  }

  // Back to the registration: the ticket and its downloads
  close() {
    this.isOpen = false;
    this.stopAuto();
    clearInterval(this.clock);
    this.sec.hidden = true;
    const ticket = this.app.wizard.total + 1, seen = this.app.wizard.visited.has(ticket);
    this.app.wizard.go(ticket);
    if (seen) { $("#saveRow").hidden = false; $("#saveRow").classList.remove("pre"); }
  }
}
