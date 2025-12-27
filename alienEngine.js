console.log("👽 Alien Engine script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("👽 DOM fully loaded");

  /* ======================
     CONFIG
  ====================== */
  const TRIAL_DAYS = 7;
  const FBA_TOKEN_ADDRESS = "TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN";
  const FBA_REQUIRED = 420;
  const BACKEND_URL = "https://football-aliens-ai-backend-e3gj-7l0ghqxll-runnerzs-projects.vercel.app/api/alien";

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
      messages.innerHTML += `<div>👽 ${selectedAlien} online</div>`;
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

    appendMessage("human", userMessage);
    appendMessage("alien", `${selectedAlien} 👽 listening…`);
    chatInput.value = "";

    await talkToAlien(userMessage, selectedAlien);
  };

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  function appendMessage(sender, text) {
    const msgEl = document.createElement("div");
    msgEl.className = sender === "human" ? "human-msg" : "alien-msg";
    msgEl.innerHTML = text;
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
  }

  async function talkToAlien(message, alien) {
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, alien })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      // Remove the "listening…" placeholder
      const lastAlienMsg = messages.querySelector(".alien-msg:last-child");
      if (lastAlienMsg && lastAlienMsg.textContent.includes("listening…")) {
        lastAlienMsg.remove();
      }

      appendMessage("alien", `<b>${alien}:</b> ${data.reply || "👽 Alien brain static."}`);
    } catch (err) {
      console.error("❌ Talk error:", err);
      appendMessage("alien", `<b>${alien}:</b> ❌ Failed to connect: ${err.message}`);
    }
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
      const balance = await window.tronWeb.trx.getTokenBalance(FBA_TOKEN_ADDRESS, walletAddress);

      if (parseInt(balance) >= FBA_REQUIRED) {
        enableChat();
        statusEl.innerText = "🛸 Access granted — FBA tokens verified";
      } else {
        disableChat();
        statusEl.innerText = "⏰ Trial ended — hold 420 FBA tokens to continue";
      }
    } catch (err) {
      console.error("❌ Token check failed:", err);
      disableChat();
      statusEl.innerText = "⚠️ Could not verify FBA tokens";
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

  // INIT
  disableChat();
  checkAccess();
});
