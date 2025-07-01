// Mode setup
const modeButtons = {
  dev: document.getElementById("dev"),
  brainstorm: document.getElementById("brainstorm"),
  casual: document.getElementById("casual"),
};

const modeDescription = document.getElementById("mode-description");
const modeSuggestion = document.getElementById("mode-suggestion");
const promptTextarea = document.getElementById("prompt");

// Descriptions & suggestions for each mode
const modeData = {
  dev: {
    description: "Dev mode: Precise, technical assistance for coding and debugging.",
    suggestion: "Write a Python script that organizes files by extension.",
  },
  brainstorm: {
    description: "Brainstorm mode: Creative, fast idea generation and expansion.",
    suggestion: "Give me 5 unique app ideas related to time management.",
  },
  casual: {
    description: "Casual mode: Light, conversational, or reflective responses.",
    suggestion: "What's something interesting about today’s news?",
  },
};

// Mode switching logic
Object.entries(modeButtons).forEach(([key, button]) => {
  button.addEventListener("click", () => {
    Object.values(modeButtons).forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const { description, suggestion } = modeData[key];
    modeDescription.textContent = description;

    const showSuggestions = localStorage.getItem("showSuggestions") !== "false";
    modeSuggestion.textContent = showSuggestions ? `💡 Suggestion: ${suggestion}` : "";
    modeSuggestion.style.display = showSuggestions ? "block" : "none";

    promptTextarea.placeholder = "Write your prompt here...";
  });
});

// Buttons
document.getElementById("copy").addEventListener("click", () => {
  navigator.clipboard.writeText(promptTextarea.value);
});

document.getElementById("save").addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("promptHistory") || "[]");
  history.push({
    text: promptTextarea.value,
    date: new Date().toISOString(),
  });
  localStorage.setItem("promptHistory", JSON.stringify(history));
  alert("Prompt saved!");
});

// Smart replies
const assistantBlock = document.getElementById("assistant-response");
const suggestionContainer = document.getElementById("chat-suggestion-buttons");

function showQuickReplies(options = []) {
  const quickRepliesEnabled = localStorage.getItem("quickReplies") !== "false";
  suggestionContainer.innerHTML = "";
  if (!quickRepliesEnabled) return;

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      assistantBlock.textContent = `✅ ${opt.label}`;
      opt.onClick();
    });
    suggestionContainer.appendChild(btn);
  });
}

// Example
showQuickReplies([
  {
    label: "Add more settings to the panel",
    onClick: () => alert("We'll work on adding settings next."),
  },
  {
    label: "Make layout responsive",
    onClick: () => alert("Responsive layout is underway."),
  },
]);

// ⚙️ Settings Panel Logic
const settingsBtn = document.getElementById("settings-toggle");
const settingsOverlay = document.getElementById("settings-overlay");
const closeSettings = document.getElementById("close-settings");

const toggleQuickReplies = document.getElementById("toggle-quick-replies");
const toggleSuggestions = document.getElementById("toggle-suggestions");

settingsBtn.addEventListener("click", () => {
  settingsOverlay.classList.remove("hidden");
  toggleQuickReplies.checked = localStorage.getItem("quickReplies") !== "false";
  toggleSuggestions.checked = localStorage.getItem("showSuggestions") !== "false";
});

closeSettings.addEventListener("click", () => {
  settingsOverlay.classList.add("hidden");
});

toggleQuickReplies.addEventListener("change", () => {
  localStorage.setItem("quickReplies", toggleQuickReplies.checked);
  location.reload(); // refresh to apply changes immediately
});

toggleSuggestions.addEventListener("change", () => {
  localStorage.setItem("showSuggestions", toggleSuggestions.checked);
  location.reload();
});
