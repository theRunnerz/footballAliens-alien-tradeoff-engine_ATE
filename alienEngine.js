console.log("👽 Alien Engine script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("👽 DOM fully loaded");

  /* ======================
     CONFIG
  ====================== */
  const TRIAL_DAYS = 7;
  const FBA_TOKEN_ADDRESS = "TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN";
  const FBA_REQUIRED = 420;

  // 🔥 IMPORTANT: base URL ONLY (no /api here)
  const BACKEND_URL =
    "https://football-aliens-ai-backend-b6k1-evlvnp5rq-runnerzs-projects.vercel.app";

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

  if (!statusEl || !connectBtn || !getFBABtn) {
    console.error("❌ Critical DOM elements missing");
    return;
  }

  /* ======================
     WALLET
  ====================== */
  connectBtn.onclick = async () => {
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

    await checkAccess();
  };

  getFBABtn.onclick = () => {
    console.log("🪙 Get FBA clicked");
    window.open(
      "https://sunpump.meme/token/" + FBA_TOKEN_ADDRESS,
      "_blank"
    );
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
  sendBtn.onclick = async () => {
    if (!selectedAlien) {
      alert("Select an alien first");
      return;
    }

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    messages.innerHTML += `<div><b>You:</b> ${userMessage}</div>`;
    messages.innerHTML += `<div><b>${selectedAlien}:</b> 👽 listening…</div>`;
    chatInput.value = "";

    await talkToAlien(userMessage, selectedAlien);
  };

  /* ======================
     TALK TO ALIEN (FIXED)
  ====================== */
  async function talkToAlien(message, alien) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/alien`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${alien} persona. Respond fully in character.\nHuman: ${message}`
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      messages.innerHTML += `<div><b>${alien}:</b> ${
        data.reply || "👽 Alien signal lost."
      }</div>`;
    } catch (err) {
      console.error("❌ Talk error:", err);
      messages.innerHTML += `<div><b>${alien}:</b> 👽 AI core malfunction</div>`;
    }
  }

  function enableChat() {
    chatInput.disabled = false;
    sendBtn.disabled = false;
  }

  function disableChat() {
    chatInput.disabled = true;
    sendBtn.disabled = true;
  }

  /* ======================
     TRIAL + FBA ACCESS
  ====================== */
  async function checkAccess() {
    console.log("🕒 Checking trial / FBA status");

    let trialStart = localStorage.getItem("trialStart");

    if (!trialStart) {
      trialStart = Date.now();
      localStorage.setItem("trialStart", trialStart);
      console.log("🆕 Trial initialized");
    }

    const daysPassed =
      (Date.now() - parseInt(trialStart)) / (1000 * 60 * 60 * 24);

    if (daysPassed < TRIAL_DAYS) {
      enableChat();
      statusEl.innerText = `🆓 Free Trial Active (${Math.ceil(
        TRIAL_DAYS - daysPassed
      )} days left)`;
      return;
    }

    if (!walletAddress) {
      disableChat();
      statusEl.innerText = "⏰ Trial ended — connect wallet";
      return;
    }

    try {
      const balance = await window.tronWeb.trx.getTokenBalance(
        FBA_TOKEN_ADDRESS,
        walletAddress
      );

      if (parseInt(balance) >= FBA_REQUIRED) {
        enableChat();
        statusEl.innerText = "🛸 Access granted — FBA tokens verified";
      } else {
        disableChat();
        statusEl.innerText =
          "⏰ Trial ended — hold 420 FBA tokens to continue";
      }
    } catch (err) {
      console.error("❌ Token check failed:", err);
      disableChat();
      statusEl.innerText = "⚠️ Could not verify FBA tokens";
    }
  }

  /* ======================
     INIT
  ====================== */
  disableChat();
  checkAccess();
});
