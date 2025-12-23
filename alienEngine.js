async function askAlien(prompt) {
  const res = await fetch(
    "https://football-aliens-gemini.corb-pratt.workers.dev",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        system: alienProfiles[currentAlien].systemPrompt
      })
    }
  );

  const data = await res.json();
  return data.reply;
}

document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("response");

  responseBox.innerText = "👽 Thinking...";

  const reply = await askAlien(input);
  responseBox.innerText = reply;
});
