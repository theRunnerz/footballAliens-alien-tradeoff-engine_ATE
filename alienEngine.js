document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // CONFIG
  // ==============================

  const TRIAL_DAYS = 7;

  const FBA_CONTRACT = "TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN";
  const REQUIRED_FBA = 420;
  const FBA_DECIMALS = 6;

  // ==============================
  // STATE
  // ==============================

  let currentAlien = null;
  let unlockedByToken = false;
  let walletAddress = null;

  // ==============================
  // DOM
  // ==============================

  const alienButtons = document.querySelectorAll(".alien");
  const alienTitle = document.getElementById("alienTitle");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const responseBox = document.getElementById("response");
  const trialNotice = document.getElementById("trialNotice");

  // ==============================
  // WALLET DETECTION
  // ==============================

  function getWalletAddress() {
    if (window.tronWeb && tronWeb.defaultAddress.base58) {
      return tronWeb.defaultAddress.base58;
    }
    return "guest";
  }

  // ==============================
  // PER-WALLET TRIAL
  // ==============================

  function checkTrial() {
    walletAddress = getWalletAddress();
    const trialKey = `footballAliensTrial_${walletAddress}`;

    const now = Date.now();
    let trialStart = localStorage.getItem(trialKey);

    if (!trialStart) {
      localStorage.setItem(trialKey, now);
      trialStart = now;
    }

    const elapsedDays =
      (now - trialStart) / (1000 * 60 * 60 * 24);

    const expired = elapsedDays >= TRIAL_DAYS;

    if (expired && !unlockedByToken) {
      lockApp();
      trialNotice.innerText =
        "⏳ Trial ended for this wallet. Hold 420 FBA to unlock.";
    } else if (!unlockedByToken) {
      const daysLeft = Math.ceil(TRIAL_DAYS - elapsedDays);
      trialNotice.innerText =
        `🆓 Free trial: ${daysLeft} day(s) remaining`;
      unlockApp(false);
    }
  }

  // ==============================
  // FBA TOKEN CHECK
  // ==============================

  async function checkFBABalance() {
    if (!window.tronWeb || !tronWeb.defaultAddress.base58) return;

    try {
      const contract = await tronWeb.contract().at(FBA_CONTRACT);
      const balance = await contract.balanceOf(
        tronWeb.defaultAddress.base58
      ).call();

      const normalized =
        Number(balance) / Math.pow(10, FBA_DECIMALS);

      if (normalized >= REQUIRED_FBA) {
        unlockedByToken = true;
        unlockApp(true);
      }
    } catch (err) {
      console.error("FBA check failed", err);
    }
  }

  // ==============================
  // LOCK / UNLOCK
  // ==============================

  function lockApp() {
    userInput.disabled = true;
    sendBtn.disabled = true;
    document.body.classList.add("locked");
  }

  function unlockApp(byToken) {
    document.body.classList.remove("locked");
    userInput.disabled = false;
    sendBtn.disabled = false;

    if (byToken) {
      trialNotice.innerText =
        "✅ Access unlocked by holding 420 FBA";
    }
  }

  // ==============================
  // ALIEN SELECTION
  // ==============================

  alienButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentAlien = btn.dataset.alien;
      alienTitle.innerText = getAlienName(currentAlien);

      if (!document.body.classList.contains("locked")) {
        userInput.disabled = false;
        sendBtn.disabled = false;
      }

      responseBox.innerText = "👽 Alien connected. Speak.";
    });
  });

  // ==============================
  // CHAT
  // ==============================

  sendBtn.addEventListener("click", () => {

    if (document.body.classList.contains("locked")) {
      responseBox.innerText =
        "🔒 Hold 420 FBA tokens to unlock full access.";
      return;
    }

    if (!currentAlien) {
      responseBox.innerText = "👽 Select an alien first.";
      return;
    }

    const message = userInput.value.trim();
    if (!message) return;

    responseBox.innerText = localAlienReply(currentAlien);
    userInput.value = "";
  });

  // ==============================
  // ALIEN BRAINS (DEMO)
  // ==============================

  function localAlienReply(alien) {
    switch (alien) {
      case "sleep":
        return "😴 Sleep Alien: Same wake time. Morning light. No negotiation.";

      case "coach":
        return "🏈 Coach Alien: Discipline beats motivation. Execute.";

      case "chaos":
        return "⚔️ Chaos Alien: Comfort is why you’re stuck. Burn it.";

      default:
        return "👽 The alien watches.";
    }
  }

  function getAlienName(alien) {
    switch (alien) {
      case "sleep": return "😴 Sleep Alien";
      case "coach": return "🏈 Coach Alien";
      case "chaos": return "⚔️ Chaos Alien";
      default: return "Unknown Alien";
    }
  }

  // ==============================
  // INIT
  // ==============================

  setTimeout(() => {
    checkTrial();
    checkFBABalance();
  }, 1500);

});
