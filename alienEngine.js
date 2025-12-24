document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 7 DAY FREE TRIAL
  // ==============================

  const TRIAL_DAYS = 7;
  const TRIAL_KEY = "footballAliensTrialStart";

  const now = Date.now();
  let trialStart = localStorage.getItem(TRIAL_KEY);

  if (!trialStart) {
    localStorage.setItem(TRIAL_KEY, now);
    trialStart = now;
  }

  const trialElapsedDays =
    (now - trialStart) / (1000 * 60 * 60 * 24);

  const trialExpired = trialElapsedDays >= TRIAL_DAYS;

  // ==============================
  // STATE
  // ==============================

  let currentAlien = null;

  // ==============================
  // DOM ELEMENTS
  // ==============================

  const alienButtons = document.querySelectorAll(".alien");
  const alienTitle = document.getElementById("alienTitle");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const responseBox = document.getElementById("response");
  const trialNotice = document.getElementById("trialNotice");

  // ==============================
  // TRIAL ENFORCEMENT
  // ==============================

  if (trialExpired) {
    trialNotice.innerText =
      "⏳ Free trial ended. Hold 420 FBA tokens to continue.";

    userInput.disabled = true;
    sendBtn.disabled = true;
    document.body.classList.add("locked");
  } else {
    const daysLeft = Math.ceil(TRIAL_DAYS - trialElapsedDays);
    trialNotice.innerText =
      `🆓 Free trial: ${daysLeft} day(s) remaining`;
  }

  // ==============================
  // ALIEN SELECTION
  // ==============================

  alienButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentAlien = btn.dataset.alien;
      alienTitle.innerText = getAlienName(currentAlien);

      if (!trialExpired) {
        userInput.disabled = false;
        sendBtn.disabled = false;
      }

      responseBox.innerText = "👽 Alien connected. Speak.";
    });
  });

  // ==============================
  // SEND MESSAGE
  // ==============================

  sendBtn.addEventListener("click", () => {

    if (document.body.classList.contains("locked")) {
      responseBox.innerText =
        "🔒 Trial ended. Hold 420 FBA tokens to unlock.";
      return;
    }

    if (!currentAlien) {
      responseBox.innerText = "👽 Select an alien first.";
      return;
    }

    const message = userInput.value.trim();
    if (!message) return;

    const reply = localAlienReply(currentAlien);
    responseBox.innerText = reply;
    userInput.value = "";
  });

  // ==============================
  // ALIEN BRAINS (LOCAL DEMO)
  // ==============================

  function localAlienReply(alien) {
    switch (alien) {
      case "sleep":
        return "😴 Sleep Alien: Wake up at the same time every day. Light first, caffeine later. Discipline wins.";

      case "coach":
        return "🏈 Coach Alien: Stop hesitating. Execute the plan. Winners don’t negotiate with weakness.";

      case "chaos":
        return "⚔️ Chaos Alien: You already know the answer. You’re just afraid to commit.";

      default:
        return "👽 The alien watches silently.";
    }
  }

  function getAlienName(alien) {
    switch (alien) {
      case "sleep":
        return "😴 Sleep Alien";
      case "coach":
        return "🏈 Coach Alien";
      case "chaos":
        return "⚔️ Chaos Alien";
      default:
        return "Unknown Alien";
    }
  }

});
