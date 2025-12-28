console.log("👽 Alien Engine loaded");

document.addEventListener("DOMContentLoaded", () => {
  /* ======================
     CONFIG
  ====================== */
  const TRIAL_DAYS = 7;
  const FBA_TOKEN_ADDRESS = "TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN";
  const FBA_REQUIRED = 420;

  // 🔥 PROXY URL (NOT backend directly)
  const BACKEND_URL =
    "https://football-aliens-proxy-nwa6x9nrf-runnerzs-projects.vercel.app/api/alien";

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
    window.open(
      "https://sunpump.meme/token/" + FBA_TOKEN_ADDRESS,
      "_blank"
    );
  };

  /* ======================
     ALIEN SELECTION
  ====================== */
  alienButtons.forEach(btn => {
    btn.onclick = () => {
      selectedAlien = btn.dataset.alien;
      messages.innerHTML = "";
      appendMessage("system", `👽 ${selectedAlien} connected`);
    };
  });

  /* ======================
     CHAT
  ====================== */
  sendBtn.onclick = sendMessage;
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    if (!selectedAlien) {
      alert("Select an alien first");
      return;
    }

    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage("human", message);
    chatInput.value = "";

    const thinkingEl = appendMessage(
      "alien",
      `<i>${selectedAlien} is thinking…</i>`
    );

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          alien: selectedAlien
        })
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();

      thinkingEl.remove();

      if (!data.reply) {
        throw new Error("No reply returned");
      }

      appendMessage("alien", `<b>${selectedAlien}:</b> ${data.reply}`);
    } catch (err) {
      console.error("❌ Talk error:", err);
      thinkingEl.remove();
      appendMessage(
        "alien",
        `<b>${selectedAlien}:</b> ❌ ${err.message}`
      );
    }
  }

  /* ======================
     UI HELPERS
  ====================== */
  function appendMessage(type, html) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
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
    let trialStart = localStorage.getItem("trialStart");

    if (!trialStart) {
      trialStart = Date.now();
      localStorage.setItem("trialStart", trialStart);
    }

    const daysPassed =
      (Date.now() - parseInt(trialStart)) / (1000 * 60 * 60 * 24);

    if (daysPassed < TRIAL_DAYS) {
      enableChat();
      statusEl.innerText = `🆓 Free Trial (${Math.ceil(
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
      const balance =
        await window.tronWeb.trx.getTokenBalance(
          FBA_TOKEN_ADDRESS,
          walletAddress
        );

      if (parseInt(balance) >= FBA_REQUIRED) {
        enableChat();
        statusEl.innerText = "🛸 Access granted (420 FBA verified)";
      } else {
        disableChat();
        statusEl.innerText =
          "⏰ Hold 420 FBA tokens to continue";
      }
    } catch (err) {
      console.error("❌ Token check failed:", err);
      disableChat();
      statusEl.innerText = "⚠️ Token check failed";
    }
  }

  /* ======================
     INIT
  ====================== */
  disableChat();
  checkAccess();
});
