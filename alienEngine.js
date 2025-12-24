document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // CONFIG
  // ==============================

  const TRIAL_DAYS = 7;
  const DAILY_LIMIT = 10;

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
  // WALLET
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
    const trialKey = `fa_trial_${walletAddress}`;

    const now = Date.now();
    let trialStart = localStorage.getItem(trialKey);

    if (!trialStart) {
      localStorage.setItem(trialKey, now);
      trialStart = now;
    }

    const elapsedDays =
      (now - trialStart) / (1000 * 60 * 60 * 24);

    if (elapsedDays >= TRIAL_DAYS && !unlockedByToken) {
      lockApp();
      trialNotice.innerText =
        "⏳ Trial ended. Hold 420 FBA to unlock.";
    } else if (!unlockedByToken) {
      const daysLeft = Math.ceil(TRIAL_DAYS - elapsedDays);
      trialNotice.innerText =
        `🆓 Free trial: ${daysLeft} day(s) remaining`;
      unlockApp(false);
    }
  }

  // ==============================
  // DAILY MESSAGE LIMIT
  // ==============================

  function getTodayKey() {
    const today = new Date().toISOString().slice(0, 10);
    return `fa_msgs_${walletAddress}_${today}`;
  }

  function getMessagesUsed() {
    return Number(localStorage.getItem(getTodayKey())) || 0;
  }

  function incrementMessages() {
    const used = getMessagesUsed() + 1;
    localStorage.setItem(getTodayKey(), used);
    return used;
  }

  function checkDailyLimit() {
    if (unlockedByToken) return true;

    const used = getMessagesUsed();
    if (used >= DAILY_LIMIT) {
      responseBox.innerText =
        "🚫 Daily message limit reached. Hold 420 FBA for unlimited access.";
      return false;
    }
    return true;
  }

  // ==============================
  // FBA CHECK
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
        "✅ Unlimited access (420 FBA holder)";
    }
  }

  // ==============================
  // ALIEN SELECTION
  // ==============================

  alienButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentAlien = btn.dataset.alien;
      alienTitle.innerText = getAlienName(currentAlien);
      responseBox.innerText = "👽 Alien connected. Speak.";
    });
  });

  // ==============================
  // CHAT
  // ==============================

  sendBtn.addEventListener("click", () => {

    if (document.body.classList.contains("locked")) {
      responseBox.innerText =
        "🔒 Access locked. Hold 420 FBA.";
      return;
    }

    if (!currentAlien) {
      responseBox.innerText = "👽 Select an alien first.";
      return;
    }

    if (!checkDailyLimit()) return;

    incrementMessages();

    responseBox.innerText = localAlienReply(currentAlien);
    userInput.value = "";
  });

  // ==============================
  // ALIEN BRAINS
  // ==============================

  function localAlienReply(alien) {
    switch (alien) {
      case "sleep":
        return "😴 Sleep Alien: Consistency beats intensity. Wake time first.";
      case "coach":
        return "🏈 Coach Alien: Execute. Review. Repeat.";
      case "chaos":
        return "⚔️ Chaos Alien: Comfort is why you’re still here.";
      default:
        return "👽 The alien observes.";
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
    walletAddress = getWalletAddress();
    checkTrial();
    checkFBABalance();
  }, 1500);

});
DEMO_DAYS = 7;
const REQUIRED_FBA = 420;
const FBA_CONTRACT = "TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN";

let userAddress = null;

async function connectWallet() {
  console.log("Connect button clicked");

  if (!window.tronWeb) {
    alert("TronLink not detected. Please install TronLink.");
    return;
  }

  // TronLink injected but wallet locked
  if (!window.tronWeb.defaultAddress.base58) {
    alert("Please unlock TronLink and approve this site.");
    return;
  }

  userAddress = window.tronWeb.defaultAddress.base58;

  console.log("Connected address:", userAddress);

  document.getElementById("walletStatus").innerText =
    `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

  recordFirstUse();
  checkAccess();
}
const getFbaBtn = document.getElementById("getFbaBtn");

if (getFbaBtn) {
  getFbaBtn.addEventListener("click", () => {
    console.log("Get FBA clicked");
    window.open(
      "https://sunpump.meme/token/TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN",
      "_blank"
    );
  });
}
function recordFirstUse() {
  if (!localStorage.getItem("firstUseTimestamp")) {
    localStorage.setItem("firstUseTimestamp", Date.now());
  }
}

function daysSinceFirstUse() {
  const firstUse = localStorage.getItem("firstUseTimestamp");
  if (!firstUse) return 0;

  const diffMs = Date.now() - Number(firstUse);
  return diffMs / (1000 * 60 * 60 * 24);
}

async function getFBABalance(address) {
  const contract = await tronWeb.contract().at(FBA_CONTRACT);
  const balance = await contract.balanceOf(address).call();

  // TRC20 uses 6 decimals by default (common on TRON)
  return Number(balance) / 1_000_000;
}

async function checkAccess() {
  const daysUsed = daysSinceFirstUse();

  if (daysUsed <= DEMO_DAYS) {
    document.getElementById("accessStatus").innerText =
      `🧪 Demo Access: ${Math.ceil(DEMO_DAYS - daysUsed)} days remaining`;
    unlockApp();
    return;
  }

  const balance = await getFBABalance(userAddress);

  if (balance >= REQUIRED_FBA) {
    document.getElementById("accessStatus").innerText =
      "✅ Access Granted (420+ FBA detected)";
    unlockApp();
  } else {
    document.getElementById("accessStatus").innerText =
      "🔒 Hold 420 FBA tokens to continue using Football Aliens";
    lockApp();
  }
}

function lockApp() {
  document.body.classList.add("locked");
}

function unlockApp() {
  document.body.classList.remove("locked");
}

document
  .getElementById("connectWalletBtn")
  .addEventListener("click", connectWallet);
document.getElementById("getFbaBtn").addEventListener("click", () => {
  window.open(
    "https://sunpump.meme/token/TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN",
    "_blank"
  );
});
