const CHAT_API_URL = window.CHAT_API_URL || "https://REPLACE_WITH_API_GATEWAY_URL/prod/chat";

const toggleButton = document.getElementById("chat-toggle");
const closeButton = document.getElementById("chat-close");
const chatPanel = document.getElementById("resume-chat");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

function appendMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatOpen(open) {
  if (open) {
    chatPanel.classList.add("open");
    toggleButton.setAttribute("aria-expanded", "true");
    chatInput.focus();
  } else {
    chatPanel.classList.remove("open");
    toggleButton.setAttribute("aria-expanded", "false");
  }
}

async function sendQuestion(question) {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Request failed (${response.status}): ${details}`);
  }

  const payload = await response.json();
  return payload.answer || "I could not generate an answer right now.";
}

toggleButton.addEventListener("click", () => {
  setChatOpen(true);
});

closeButton.addEventListener("click", () => {
  setChatOpen(false);
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();

  if (!question) {
    return;
  }

  appendMessage("user", question);
  chatInput.value = "";

  try {
    const answer = await sendQuestion(question);
    appendMessage("bot", answer);
  } catch (error) {
    appendMessage("bot", `Sorry, something went wrong. ${error.message}`);
  }
});
