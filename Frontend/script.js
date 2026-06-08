function formatResponse(text) {
    return text
        .replace(/\*\*/g, "")      // Remove bold markdown **
        .replace(/\* /g, "<br>• ") // Convert * item to bullet
        .replace(/\n/g, "<br>");   // Convert new lines
}

async function sendMessage() {

    const input = document.getElementById("message");
    const message = input.value.trim();

    if (message === "") return;

    const chatBox = document.getElementById("chat-box");

    chatBox.innerHTML += `
        <div class="user">
            <b>You:</b> ${message}
        </div>
    `;

    input.value = "";

    const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    });

    const data = await response.json();

    let formattedResponse = formatResponse(data.reply);

    chatBox.innerHTML += `
        <div class="bot">
            <b>AI:</b> ${formattedResponse}
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}

const themeBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeBtn.textContent = "☀️";
}

// Toggle theme
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