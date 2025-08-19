document.addEventListener("DOMContentLoaded", () => {
  const iaBtn = document.querySelector(".ia-floating-btn");
  const iaBox = document.querySelector(".ia-chat-container");
  const closeBtn = iaBox.querySelector(".ia-close-btn");
  const input = document.getElementById("iaInputFree");
  const sendBtn = document.getElementById("iaSendFree");
  const messagesContainer = document.getElementById("iaChatFreeMessages");
  const typingIndicator = iaBox.querySelector(".ia-typing-indicator");

  if (!iaBtn || !iaBox || !closeBtn || !input || !sendBtn || !messagesContainer) return;

  iaBtn.addEventListener("click", () => {
    iaBox.classList.toggle("ia-hidden");
    iaBox.classList.toggle("ia-visible");
    iaBtn.style.opacity = iaBox.classList.contains("ia-visible") ? "0" : "1";
    if (!iaBox.classList.contains("ia-hidden")) input.focus();
  });
  closeBtn.addEventListener("click", () => {
    iaBox.classList.remove("ia-visible");
    iaBox.classList.add("ia-hidden");
    iaBtn.style.opacity = "1";
  });

  function adicionarMensagem(texto, autor = "ia") {
    const msg = document.createElement("div");
    msg.classList.add(autor === "user" ? "user-message" : "ia-message", "ia-message-bubble");
    msg.textContent = texto;

    msg.style.opacity = "0";
    msg.style.transform = "translateY(10px)";
    messagesContainer.appendChild(msg);

    requestAnimationFrame(() => {
      msg.style.transition = "opacity 0.3s, transform 0.3s";
      msg.style.opacity = "1";
      msg.style.transform = "translateY(0)";
    });

    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
  }

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  sendBtn.addEventListener("click", async () => {
    const message = input.value.trim();
    if (!message) return;

    adicionarMensagem(message, "user");
    input.value = "";

    typingIndicator.style.display = "flex";
    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "Você é um assistente simpático da Kontrollar... (mantenha seu prompt original)"
            },
            { role: "user", content: message }
          ]
        })
      });

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Não entendi sua pergunta. Poderia reformular?";

      setTimeout(() => {
        typingIndicator.style.display = "none";
        adicionarMensagem(reply, "ia");
      }, 1000);
    } catch (err) {
      typingIndicator.style.display = "none";
      adicionarMensagem("Desculpe, estou com dificuldades agora. Tente novamente mais tarde!", "ia");
      console.error("IA Free erro:", err);
    }
  });

  document.querySelectorAll(".ia-suggestions span").forEach((el) => {
    el.addEventListener("click", () => {
      input.value = el.textContent;
      sendBtn.click();
    });
  });
});
