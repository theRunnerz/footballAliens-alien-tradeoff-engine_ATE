const DEMO_DAYS = 7;
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
      "https://sunswap.com/#/swap?inputCurrency=TRX&outputCurrency=TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN",
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
    "https://sunswap.com/#/swap?inputCurrency=TRX&outputCurrency=TNW5ABkp3v4jfeDo1vRVjxa3gtnoxP3DBN",
    "_blank"
  );
});
