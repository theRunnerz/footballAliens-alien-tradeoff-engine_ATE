console.log("👽 Alien Engine script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("👽 DOM fully loaded");

  /* ======================
     CONFIG
  ====================== */
  const TRIAL_DAYS = 7;
  const AI_ENDPOINT = "https://football-aliens-ai-backend-4mgrjaiaw-runnerzs-projects.vercel.app/api/alien";


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

  if (
    !statusEl ||
    !connectBtn ||
    !getFBABtn ||
    !chatInput ||
    !sendBtn ||
    !messages
  ) {
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
    window.open(
      "https://sunpump.meme/token/TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN",
      "_blank"
    );
  };

  /* ======================
     ALIENS
  ====================== */
  alienButtons.forEach(btn => {
    btn.onclick = () => {
      selectedAlien = btn.dataset.alien;
      addSystemMessage(`${selectedAlien} online`);
      enableChat();
    };
  });

  /* ======================
     MESSAGE HELPERS
  ====================== */
  function addUserMessage(text) {
    messages.innerHTML += `<div><b>You:</b> ${text}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function addAlienMessage(text) {
    messages.innerHTML += `<div><b>${selectedAlien}:</b> ${text}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function addSystemMessage(text) {
    messages.innerHTML += `<div><i>${text}</i></div>`;
    messages.scrollTop = messages.scrollHeight;
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
     TALK TO ALIEN
  ====================== */
  async function talkToAlien(message) {
    addAlienMessage("👽 listening…");

    try {
      const res = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, alien: selectedAlien })
      });

      const data = await res.json();

      if (data.reply) {
        addAlienMessage(data.reply);
      } else if (data.debug) {
        addAlienMessage(`👽 Debug: ${JSON.stringify(data.debug)}`);
      } else {
        addAlienMessage("👽 Alien signal lost.");
      }
    } catch (err) {
      console.error("❌ Talk error:", err);
      addAlienMessage(`👽 AI core malfunction: ${err.message}`);
    }
  }

  /* ======================
     SEND BUTTON
  ====================== */
  sendBtn.onclick = async () => {
    if (!selectedAlien) {
      alert("Select an alien first");
      return;
    }

    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = "";

    await talkToAlien(text);
  };

  /* ======================
     TRIAL LOGIC
  ====================== */
  function checkAccess() {
    let trialStart = localStorage.getItem("trialStart");

    if (!trialStart) {
      trialStart = Date.now();
      localStorage.setItem("trialStart", trialStart);
    }

    const daysPassed =
      (Date.now() - parseInt(trialStart, 10)) / (1000 * 60 * 60 * 24);

    if (daysPassed < TRIAL_DAYS) {
      statusEl.innerText = `🆓 Free Trial Active (${Math.ceil(
        TRIAL_DAYS - daysPassed
      )} days left)`;
      enableChat();
    } else {
      statusEl.innerText =
        "⏰ Trial ended — hold 420 FBA to continue";
      disableChat();
    }
  }

  /* ======================
     INIT
  ====================== */
  disableChat();
  checkAccess();
});
