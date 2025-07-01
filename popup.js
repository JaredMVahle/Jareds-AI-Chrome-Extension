document.addEventListener("DOMContentLoaded", () => {
  const modeButtons = document.querySelectorAll(".mode-btn");
  const promptBox = document.getElementById("prompt");
  const suggestionBox = document.querySelector(".suggestion-box");
  const subheader = document.querySelector(".subheader");
  const smartRepliesContainer = document.querySelector(".smart-replies");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsOverlay = document.getElementById("settings-overlay");
  const closeBtn = document.getElementById("close-settings");

  const toggleQuickReplies = document.getElementById("toggle-quick-replies");
  const toggleModeSuggestions = document.getElementById("toggle-mode-suggestions");

  const suggestions = {
    dev: {
      tip: "💡 Suggestion: Describe your technical problem or feature goal.",
      sub: "Dev mode: Precise, technical, and structured responses.",
      default: "Explain the bug I'm facing with my JavaScript code..."
    },
    brainstorm: {
      tip: "💡 Suggestion: Give me 10 creative project ideas using AI.",
      sub: "Brainstorm mode: Fast, idea-rich, divergent responses.",
      default: "Give me 5 unique app ideas related to time management."
    },
    casual: {
      tip: "💡 Suggestion: What's something interesting about today's news?",
      sub: "Casual mode: Light, conversational, or reflective responses.",
      default: "What's something interesting about today's news?"
    }
  };

  function setMode(mode) {
    modeButtons.forEach(btn => btn.classList.remove("active"));
    document.getElementById(`${mode}-mode`).classList.add("active");

    if (toggleModeSuggestions.checked) {
      suggestionBox.textContent = suggestions[mode].tip;
      subheader.textContent = suggestions[mode].sub;
      suggestionBox.style.display = "block";
      subheader.style.display = "block";
    } else {
      suggestionBox.textContent = "";
      subheader.textContent = "";
      suggestionBox.style.display = "none";
      subheader.style.display = "none";
    }

    if (!promptBox.value.trim()) {
      promptBox.placeholder = suggestions[mode].default;
    }
  }

  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode);
    });
  });

  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(promptBox.value);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    localStorage.setItem("savedPrompt", promptBox.value);
  });

  // Restore saved prompt on load
  if (localStorage.getItem("savedPrompt")) {
    promptBox.value = localStorage.getItem("savedPrompt");
  }

  // Smart reply handler
  smartRepliesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("smart-reply")) {
      promptBox.value = e.target.textContent;
    }
  });

  // Settings panel logic
  settingsBtn.addEventListener("click", () => {
    settingsOverlay.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    settingsOverlay.classList.add("hidden");
  });

  // Save settings to localStorage
  toggleQuickReplies.addEventListener("change", () => {
    localStorage.setItem("showQuickReplies", toggleQuickReplies.checked);
    updateQuickRepliesVisibility();
  });

  toggleModeSuggestions.addEventListener("change", () => {
    localStorage.setItem("showModeSuggestions", toggleModeSuggestions.checked);
    const active = document.querySelector(".mode-btn.active");
    if (active) setMode(active.dataset.mode);
  });

  function updateQuickRepliesVisibility() {
    smartRepliesContainer.style.display = toggleQuickReplies.checked ? "block" : "none";
  }

  // Load saved settings
  toggleQuickReplies.checked = localStorage.getItem("showQuickReplies") === "true";
  toggleModeSuggestions.checked = localStorage.getItem("showModeSuggestions") !== "false";
  updateQuickRepliesVisibility();

  // Set initial mode
  setMode("casual");
});
