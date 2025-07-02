document.addEventListener("DOMContentLoaded", () => {
  const promptBox = document.getElementById("prompt");
  const copyBtn = document.getElementById("copy");
  const saveBtn = document.getElementById("save");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const suggestionBox = document.getElementById("mode-suggestion");
  const settingsButton = document.getElementById("settings-button");
  const settingsOverlay = document.getElementById("settings-overlay");
  const closeSettingsBtn = document.getElementById("close-settings");
  const toggleQuickReplies = document.getElementById("toggle-quick-replies");
  const toggleModeSuggestions = document.getElementById("toggle-mode-suggestions");

  const defaultSuggestions = {
    dev: "Refactor this function to improve readability.",
    brainstorm: "Give me 5 unique app ideas related to time management.",
    casual: "What's something interesting about today’s news?",
  };

  function setMode(mode) {
    modeButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    // Set default prompt suggestion if enabled
    if (toggleModeSuggestions.checked) {
      suggestionBox.textContent = `💡 ${defaultSuggestions[mode] || ""}`;
      suggestionBox.style.display = "block";
    } else {
      suggestionBox.style.display = "none";
    }
  }

  // Load saved settings
  chrome.storage.sync.get(["enableQuickReplies", "enableModeSuggestions"], (data) => {
    toggleQuickReplies.checked = data.enableQuickReplies ?? true;
    toggleModeSuggestions.checked = data.enableModeSuggestions ?? true;

    // Default to dev mode
    setMode("dev");
  });

  // Mode button clicks
  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
    });
  });

  // Copy prompt
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(promptBox.value)
      .then(() => copyBtn.textContent = "Copied!")
      .catch(() => copyBtn.textContent = "Failed");
    setTimeout(() => copyBtn.textContent = "Copy Prompt", 1500);
  });

  // Save prompt
  saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({ savedPrompt: promptBox.value });
  });

  // Settings modal
  settingsButton.addEventListener("click", () => {
    settingsOverlay.classList.remove("hidden");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsOverlay.classList.add("hidden");
  });

  toggleQuickReplies.addEventListener("change", () => {
    chrome.storage.sync.set({ enableQuickReplies: toggleQuickReplies.checked });
  });

  toggleModeSuggestions.addEventListener("change", () => {
    chrome.storage.sync.set({ enableModeSuggestions: toggleModeSuggestions.checked });
    const currentMode = document.querySelector(".mode-btn.active")?.dataset.mode;
    setMode(currentMode);
  });
});
