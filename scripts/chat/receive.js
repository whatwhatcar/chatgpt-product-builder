const chat_box = document.getElementById("chat-box");

function scroll_down() {
    chat_box.scrollTo({
        top: chat_box.scrollHeight,
        behavior: "smooth"
    });
}

export function prompt_message(input_text) {
    const prompt = document.createElement("div");
    prompt.classList.add("prompt");
    prompt.textContent = input_text;
    chat_box.appendChild(prompt);
    scroll_down();
}

export function reply_message(input_text) {
    const reply = document.createElement("div");
    reply.classList.add("reply");
    reply.textContent = input_text;
    chat_box.appendChild(reply);
    scroll_down();
}