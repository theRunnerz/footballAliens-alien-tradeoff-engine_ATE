console.log("👽 Alien Engine booting…");

/* ======================
   CONFIG
====================== */
const FBA_CONTRACT = "TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN";
const REQUIRED_FBA = 420;
const TRIAL_DAYS = 7;

/* ======================
   STATE
====================== */
let tronWeb = null;
let walletAddress = null;
let selectedAlien = null;

/* ======================
   WALLET
====================== */
async function connectWallet() {
  if (!window.tronWeb || !window.tronWeb.ready) {
    alert("Install / unlock TronLink");
    return;
  }

  tronWeb = window.tronWeb;
  walletAddress = tronWeb.defaultAddress.base58;

  document.getElementById("status").innerText =
    "Connected: " + walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

  await checkAccess();
}

function getFBA() {
  window.open("https://sunpump.meme/token/TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN", "_blank");
}

/* ======================
   TRIAL + TOKEN GATE
====================== */
function getTrialStart() {
  const stored = localStorage.getItem("trialStart");
  if (stored) return parseInt(stored);

  const now = Date.now();
  localStorage.setItem("trialStart", now.toString());
  return now;
}

function trialExpired() {
  const start = getTrialStart();
  const daysPassed = (Date.now() - start) / (1000 * 60 * 60 * 24);
  return daysPassed > TRIAL_DAYS;
}

async function hasEnoughFBA() {
  try {
    const contract = await tronWeb.contract().at(FBA_CONTRACT);
    const balance = await contract.balanceOf(walletAddress).call();
    const readable = Number(balance) / 1e6; // TRC20 decimals

    return readable >= REQUIRED_FBA;
  } catch (e) {
    console.error("Token check failed", e);
    return false;
  }
}

async function checkAccess() {
  const status = document.getElementById("status");

  if (!trialExpired()) {
    enableChat();
    status.innerText = "🆓 Free Trial Active";
    return;
  }

  if (!walletAddress) {
    status.innerText = "Trial ended – connect wallet";
    return;
  }

  const allowed = await hasEnoughFBA();
  if (allowed) {
    enableChat();
    status.innerText = "✅ FBA Holder Access";
  } else {
    disableChat();
    status.innerText = "❌ Need 420 FBA to continue";
  }
}

/* ======================
   CHAT
====================== */
function enableChat() {
  document.getElementById("chatInput").disabled = false;
  document.getElementById("sendBtn").disabled = false;
}

function disableChat() {
  document.getElementById("chatInput").disabled = true;
  document.getElementById("sendBtn").disabled = true;
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("messages");

  if (!selectedAlien) {
    alert("Select an alien first");
    return;
  }

  if (!input.value.trim()) return;

  const userText = input.value;
  input.value = "";

  messages.innerHTML += `<div><b>You:</b> ${userText}</div>`;
  messages.innerHTML += `<div><b>${selectedAlien}:</b> 👽 typing...</div>`;

  try {
    const res = await fetch(
      "https://football-aliens-gemini.yourname.workers.dev",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alien: selectedAlien,
          message: userText
        })
      }
    );

    const data = await res.json();

    messages.lastChild.innerHTML = `<b>${selectedAlien}:</b> ${data.reply}`;
  } catch (err) {
    messages.lastChild.innerHTML =
      `<b>${selectedAlien}:</b> ❌ Transmission failed`;
    console.error(err);
  }
}


/* ======================
   ALIENS
====================== */
function selectAlien(name) {
  selectedAlien = name;
  document.getElementById("messages").innerHTML =
    `<div>👽 ${name} selected</div>`;
}

/* ======================
   INIT
====================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connectWalletBtn").onclick = connectWallet;
  document.getElementById("getFBABtn").onclick = getFBA;
  document.getElementById("sendBtn").onclick = sendMessage;

  document.querySelectorAll("#aliens button").forEach(btn => {
    btn.onclick = () => selectAlien(btn.dataset.alien);
  });

  checkAccess();
});
