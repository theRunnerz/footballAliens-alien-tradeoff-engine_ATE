console.log("👽 Alien Engine script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("👽 DOM fully loaded");

  /* ======================
     CONFIG
  ====================== */
  const TRIAL_DAYS = 7;

  /* ======================
     STATE
  ====================== */
  let selectedAlien = null;
  let walletAddress = null;

  /* ======================
     ELEMENTS
  ====================== */
  const statusEl = document.getElementById("status");
  const connectBtn = document.getElementById("connectWalletBtn");
  const getFBABtn = document.getElementById("getFBABtn");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const messages = document.getElementById("messages");
  const alienButtons = document.querySelectorAll("#aliens button");

  // HARD CHECK — if this fails, nothing works
  if (!statusEl || !connectBtn || !getFBABtn) {
    console.error("❌ Critical DOM elements missing");
    return;
  }

  /* ======================
     WALLET
  ====================== */
  connectBtn.onclick = () => {
    console.log("🔌 Connect wallet clicked");

    if (!window.tronWeb || !window.tronWeb.ready) {
      alert("Please install / unlock TronLink");
      return;
    }

    walletAddress = window.tronWeb.defaultAddress.base58;
    statusEl.innerText =
      "🔗 Connected: " +
      walletAddress.slice(0, 6) +
      "..." +
      walletAddress.slice(-4);

    checkAccess();
  };

  getFBABtn.onclick = () => {
    console.log("🪙 Get FBA clicked");
    window.open("https://sunpump.meme", "_blank");
  };

  /* ======================
     ALIENS
  ====================== */
  alienButtons.forEach(btn => {
    btn.onclick = () => {
      selectedAlien = btn.dataset.alien;
      console.log("👽 Selected alien:", selectedAlien);
      messages.innerHTML = `<div>👽 ${selectedAlien} online</div>`;
    };
  });

  /* ======================
     CHAT
  ====================== */
  sendBtn.onclick = () => {
    if (!selectedAlien) {
      alert("Select an alien first");
      return;
    }

    const text = chatInput.value.trim();
    if (!text) return;

    messages.innerHTML += `<div><b>You:</b> ${text}</div>`;
    messages.innerHTML += `<div><b>${selectedAlien}:</b> 👽 listening…</div>`;
    chatInput.value = "";
  };

  function enableChat() {
    chatInput.disabled = false;
    sendBtn.disabled = false;
  }

  function disableChat() {
    chatInput.disabled = true;
    sendBtn.disabled = true;
  }

  /* ======================
     TRIAL LOGIC (BULLETPROOF)
  ====================== */
  function checkAccess() {
    console.log("🕒 Checking trial status");

    let trialStart = localStorage.getItem("trialStart");

    if (!trialStart) {
      trialStart = Date.now();
      localStorage.setItem("trialStart", trialStart);
      console.log("🆕 Trial initialized");
    }

    const daysPassed =
      (Date.now() - parseInt(trialStart)) / (1000 * 60 * 60 * 24);

    console.log("📅 Days passed:", daysPassed);

    if (daysPassed < TRIAL_DAYS) {
      enableChat();
      statusEl.innerText = `🆓 Free Trial Active (${Math.ceil(
        TRIAL_DAYS - daysPassed
      )} days left)`;
    } else {
      disableChat();
      statusEl.innerText = "⏰ Trial ended — connect wallet";
    }
  }

  // INIT
  disableChat();
  checkAccess();
});
