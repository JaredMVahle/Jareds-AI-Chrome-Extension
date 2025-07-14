document.addEventListener("DOMContentLoaded", () => {
  const promptBox = document.getElementById("prompt");
  const copyBtn = document.getElementById("copy");
  const saveBtn = document.getElementById("save");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const suggestionBox = document.getElementById("mode-suggestion");
  const quickActionsContainer = document.querySelector(".quick-actions");
  const settingsButton = document.getElementById("settings-button");
  const settingsOverlay = document.getElementById("settings-overlay");
  const closeSettingsBtn = document.getElementById("close-settings");
  const toggleQuickReplies = document.getElementById("toggle-quick-replies");
  const toggleModeSuggestions = document.getElementById("toggle-mode-suggestions");
  const fetchChatGPTBtn = document.getElementById("fetch-chatgpt");

  const defaultSuggestions = {
    dev: "Refactor this function to improve readability.",
    brainstorm: "Give me 5 unique app ideas related to time management.",
    casual: "What's something interesting about today’s news?",
  };

  function loadSettings() {
    return {
      enableQuickReplies: JSON.parse(localStorage.getItem("enableQuickReplies") || "true"),
      showModeSuggestions: JSON.parse(localStorage.getItem("showModeSuggestions") || "true")
    };
  }

  function saveSettings(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function applySettings() {
    const settings = loadSettings();

    if (settings.enableQuickReplies) {
      quickActionsContainer.style.display = "flex";
      promptBox.style.minHeight = "100px";
    } else {
      quickActionsContainer.style.display = "none";
      promptBox.style.minHeight = "150px";
    }

    const current = document.querySelector(".mode-btn.active")?.dataset.mode;
    if (settings.showModeSuggestions && current) {
      suggestionBox.textContent = `💡 ${defaultSuggestions[current]}`;
      suggestionBox.style.display = "block";
    } else {
      suggestionBox.style.display = "none";
    }

    toggleQuickReplies.checked = settings.enableQuickReplies;
    toggleModeSuggestions.checked = settings.showModeSuggestions;
  }

  function setMode(mode) {
    modeButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const settings = loadSettings();
    if (settings.showModeSuggestions) {
      suggestionBox.textContent = `💡 ${defaultSuggestions[mode]}`;
      suggestionBox.style.display = "block";
    } else {
      suggestionBox.style.display = "none";
    }
  }

  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
    });
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(promptBox.value)
      .then(() => copyBtn.textContent = "Copied!")
      .catch(() => copyBtn.textContent = "Failed");
    setTimeout(() => copyBtn.textContent = "Copy Prompt", 1500);
  });

  saveBtn.addEventListener("click", () => {
    localStorage.setItem("savedPrompt", promptBox.value);
  });

  settingsButton.addEventListener("click", () => {
    settingsOverlay.classList.remove("hidden");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsOverlay.classList.add("hidden");
  });

  toggleQuickReplies.addEventListener("change", () => {
    saveSettings("enableQuickReplies", toggleQuickReplies.checked);
    applySettings();
  });

  toggleModeSuggestions.addEventListener("change", () => {
    saveSettings("showModeSuggestions", toggleModeSuggestions.checked);
    applySettings();
  });

  fetchChatGPTBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes("chat.openai.com") || tab.url.includes("chatgpt.com")) {
        chrome.tabs.sendMessage(tab.id, { action: "getLatestResponse" }, (response) => {
          if (response && response.response) {
            promptBox.value = response.response;
          } else {
            alert("No response found.");
          }
        });
      } else {
        alert("Active tab is not ChatGPT.");
      }
    });
  });

  const saved = localStorage.getItem("savedPrompt");
  if (saved) {
    promptBox.value = saved;
  }

  setMode("dev");
  applySettings();
});
