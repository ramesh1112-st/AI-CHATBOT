function formatResponse(text) {
    if (!text) {
        return "No response received from server.";
    }

    return text
        .replace(/\*\*/g, "")      // Remove bold markdown
        .replace(/\* /g, "<br>• ") // Convert markdown bullets
        .replace(/\n/g, "<br>");   // Convert new lines
}

async function sendMessage() {

    const input = document.getElementById("message");
    const message = input.value.trim();

    if (message === "") return;

    const chatBox = document.getElementById("chat-box");

    // Show user message
    chatBox.innerHTML += `
        <div class="user">
            <b>You:</b> ${message}
        </div>
    `;

    input.value = "";

    // Loading message
    chatBox.innerHTML += `
        <div class="bot" id="loading">
            <b>AI:</b> Thinking...
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch(
            "https://ai-chatbot-7pq0.onrender.com/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        console.log("Server Response:", data);

        // Remove loading message
        const loading = document.getElementById("loading");
        if (loading) {
            loading.remove();
        }

        let reply =
            data.reply ||
            data.response ||
            data.message ||
            data.error ||
            "No response returned.";

        let formattedResponse = formatResponse(reply);

        chatBox.innerHTML += `
            <div class="bot">
                <b>AI:</b> ${formattedResponse}
            </div>
        `;

    } catch (error) {

        console.error("Error:", error);

        const loading = document.getElementById("loading");
        if (loading) {
            loading.remove();
        }

        chatBox.innerHTML += `
            <div class="bot">
                <b>AI:</b> Failed to connect to server.
            </div>
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send on Enter key
document
    .getElementById("message")
    .addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

// Theme Toggle
const themeBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");

    if (themeBtn) {
        themeBtn.textContent = "☀️";
    }
}

// Toggle theme
if (themeBtn) {
    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            themeBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeBtn.textContent = "🌙";
        }
    });
}