chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLatestResponse") {
    try {
      // Log all matching elements for debugging
      const markdowns = document.querySelectorAll(".markdown");
      const prose = document.querySelectorAll(".prose");

      console.log("markdown count:", markdowns.length);
      console.log("prose count:", prose.length);

      const allMessages = [...markdowns, ...prose];
      const lastMessage = allMessages[allMessages.length - 1];

      const text = lastMessage ? lastMessage.innerText.trim() : "No response found.";
      sendResponse({ response: text });
    } catch (err) {
      sendResponse({ response: "Error retrieving response." });
    }
    return true;
  }
});