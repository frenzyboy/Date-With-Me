/* =========================================================
   ApplicantForm: step 2 (first name, selfie, silly checkbox, locked Back)
   ========================================================= */
class ApplicantForm {
  constructor(app) {
    this.app = app;
    this.nameInput = $("#herName");
    this.nextBtn = $("#verifyNext");
    this.nameInput.addEventListener("input", () => this.sync());
    this.nameInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && !this.nextBtn.disabled) { e.preventDefault(); app.wizard.next(this.nextBtn); }
    });
    this.sync();
    this.setupNoBack();
    this.setupCutest();
  }

  firstName() { return this.nameInput.value.trim().replace(/\s+/g, " ") || CONFIG.HER_NAME; }
  sync() {
    const typed = this.nameInput.value.trim().length > 0;
    $("#herVerified").hidden = !typed;
    this.nextBtn.disabled = !typed;
  }

  // There's no going back once the booking has started
  setupNoBack() {
    const lines = [
      "Sorry, your booking is already in progress. There's no going back now 😌",
      "The Back button is currently on vacation 🏖️",
      "Nice try. You're already in.",
      "Error 404: Way back not found.",
      `${CONFIG.MY_NAME} has locked this door. Forward is the only way 💘`
    ];
    let tries = 0;
    const b = $("#noBackBtn");
    b.addEventListener("click", () => {
      $("#noBackNote").textContent = lines[Math.min(tries, lines.length - 1)];
      tries++;
      restart(b, "shake");
      if (tries >= lines.length) { b.classList.add("locked"); b.textContent = "Back 🔒"; }
    });
  }

  // The un-uncheckable checkbox
  setupCutest() {
    const lines = [
      "This field cannot be changed. It's a fact.",
      "Nice try. Still the cutest.",
      "The system has re-checked this box for you.",
      "Error 143: modesty not accepted."
    ];
    let tries = 0;
    $("#cutest").addEventListener("click", e => {
      e.preventDefault();
      $("#cutestNote").textContent = lines[tries++ % lines.length];
    });
  }
}
