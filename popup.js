let currentMode = "casual";

const modeButtons = {
  dev: document.getElementById("dev"),
  brainstorm: document.getElementById("brainstorm"),
  casual: document.getElementById("casual")
};

const suggestionBox = document.getElementById("mode-suggestion");
const assistantBox = document.getElementById("assistant-response");
const replyContainer = document.getElementById("chat-suggestion-buttons");
const promptBox = document.getElementById("prompt");

const settingsOverlay = document.getElementById("settings-overlay");
const toggleSuggestions = document.getElementById("toggle-suggestions");
const toggleQuickReplies = document.getElementById("toggle-quick-replies");
const popupSizeSelect = document.getElementById("popup-size");
const settingsToggleBtn = document.getElementById("settings-toggle");
const closeSettingsBtn = document.getElementById("close-settings");

const suggestionsByMode = {
  dev: "Help me write a Python script that reads a file and counts the word frequency.",
  brainstorm: "Give me 5 unique app ideas related to time management.",
  casual: "What’s something interesting about today’s news?"
};

function setMode(mode) {
  currentMode = mode;

  for (const key in modeButtons) {
    modeButtons[key].classList.remove("active");
  }
  modeButtons[mode].classList.add("active");

  const subheader = document.getElementById("mode-description");
  switch (mode) {
    case "dev":
      subheader.textContent = "Dev mode: Focused, technical, and logic-based responses.";
      break;
    case "brainstorm":
      subheader.textContent = "Brainstorm mode: Generative and idea-expanding responses.";
      break;
    case "casual":
      subheader.textContent = "Casual mode: Light, conversational, or reflective responses.";
      break;
  }

  if (toggleSuggestions.checked) {
    suggestionBox.style.display = "block";
    suggestionBox.textContent = `💡 Suggestion: ${suggestionsByMode[mode]}`;
  } else {
    suggestionBox.style.display = "none";
  }
}

suggestionBox.addEventListener("click", () => {
  const cursorPos = promptBox.selectionStart;
  const textToInsert = suggestionsByMode[currentMode];
  const currentText = promptBox.value;

  promptBox.value =
    currentText.slice(0, cursorPos) +
    textToInsert +
    currentText.slice(cursorPos);

  promptBox.focus();
  promptBox.selectionEnd = cursorPos + textToInsert.length;
});

modeButtons.dev.addEventListener("click", () => setMode("dev"));
modeButtons.brainstorm.addEventListener("click", () => setMode("brainstorm"));
modeButtons.casual.addEventListener("click", () => setMode("casual"));

document.getElementById("copy").addEventListener("click", () => {
  const text = formatPrompt();
  navigator.clipboard.writeText(text);
});

document.getElementById("save").addEventListener("click", () => {
  const entry = {
    prompt: formatPrompt(),
    mode: currentMode,
    time: new Date().toISOString()
  };

  chrome.storage.local.get({ logs: [] }, (result) => {
    const logs = result.logs;
    logs.push(entry);
    chrome.storage.local.set({ logs });
  });
});

function formatPrompt() {
  const prefixMap = {
    dev: "[Developer Mode]",
    brainstorm: "[Brainstorm Mode]",
    casual: "[Casual Chat Mode]"
  };
  return `${prefixMap[currentMode]} ${promptBox.value}`;
}

// Settings overlay logic
settingsToggleBtn.addEventListener("click", () => {
  settingsOverlay.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsOverlay.classList.add("hidden");
});

// Load settings
chrome.storage.local.get(["showSuggestions", "showQuickReplies", "popupSize"], (result) => {
  const suggestionsEnabled = result.showSuggestions !== false;
  const quickRepliesEnabled = result.showQuickReplies !== false;
  const savedSize = result.popupSize || "compact";

  toggleSuggestions.checked = suggestionsEnabled;
  toggleQuickReplies.checked = quickRepliesEnabled;
  popupSizeSelect.value = savedSize;

  applyPopupSize(savedSize);
  setMode(currentMode);

  if (quickRepliesEnabled) {
    updateAssistantResponse(
      "Let me know when you're ready for the final file: popup.js.",
      ["Ready for the popup.js file", "Show me all files together"]
    );
  } else {
    updateAssistantResponse("Let me know how you'd like to proceed:");
  }
});

toggleSuggestions.addEventListener("change", () => {
  chrome.storage.local.set({ showSuggestions: toggleSuggestions.checked });
  setMode(currentMode);
});

toggleQuickReplies.addEventListener("change", () => {
  chrome.storage.local.set({ showQuickReplies: toggleQuickReplies.checked });
  location.reload(); // optional, for simplicity
});

popupSizeSelect.addEventListener("change", () => {
  const selectedSize = popupSizeSelect.value;
  chrome.storage.local.set({ popupSize: selectedSize });
  applyPopupSize(selectedSize);
});

function applyPopupSize(size) {
  const sizes = {
    compact: [400, 500],
    medium: [500, 600],
    large: [600, 700]
  };

  const [width, height] = sizes[size] || sizes.compact;

  try {
    window.resizeTo(width, height);
  } catch (e) {
    console.warn("Popup resizing is blocked in some contexts.");
  }
}

// Smart Quick Actions
document.querySelectorAll(".smart-suggestions button").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    let smartPrompt = "";

    switch (action) {
      case "addSettings":
        smartPrompt = "Let’s work on adding more settings to the panel next.";
        break;
      case "responsiveLayout":
        smartPrompt = "Let’s improve layout responsiveness for smaller screens.";
        break;
      case "fullTabView":
        smartPrompt = "Let’s build out a full-size tab view version of this assistant.";
        break;
    }

    promptBox.value = smartPrompt;
    promptBox.focus();
    promptBox.selectionStart = promptBox.value.length;
  });
});

// Assistant Message Logic
function updateAssistantResponse(message, quickReplies = []) {
  assistantBox.textContent = message;
  replyContainer.innerHTML = "";

  quickReplies.forEach((text) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", () => {
      simulateUserReply(text);
    });
    replyContainer.appendChild(btn);
  });
}

function simulateUserReply(text) {
  promptBox.value = text;
  promptBox.focus();
  promptBox.selectionStart = promptBox.value.length;

  console.log(`🧠 Simulated user said: ${text}`);

  if (text.includes("popup.js")) {
    updateAssistantResponse(
      "Here’s the full updated popup.js file. Let me know when you want to test it!",
      ["Ready to test the full extension", "Let’s update the full tab view"]
    );
  }
}
