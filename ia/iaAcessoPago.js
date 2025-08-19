document.addEventListener("DOMContentLoaded", () => {
  const iaBtn = document.querySelector(".ia-premium-btn");
  const iaBox = document.querySelector(".ia-premium-container");
  const iaClose = iaBox.querySelector(".ia-close-btn");
  const messagesContainer = document.getElementById("iaChatPagoMessages");
  const typingIndicator = iaBox.querySelector(".ia-typing-indicator");
  const input = document.getElementById("iaInputPago");
  const sendBtn = document.getElementById("iaSendPago");

  if (!iaBtn || !iaBox || !iaClose || !messagesContainer || !input || !sendBtn) return;

  iaBtn.addEventListener("click", () => {
    iaBox.classList.toggle("ia-hidden");
    iaBox.classList.toggle("ia-visible");
    if (!iaBox.classList.contains("ia-hidden")) input.focus();
  });
  iaClose.addEventListener("click", () => {
    iaBox.classList.remove("ia-visible");
    iaBox.classList.add("ia-hidden");
  });

  function adicionarMensagemPremium(texto, autor = "ia") {
    const msg = document.createElement("div");
    msg.classList.add(autor === "user" ? "user-premium-message" : "ia-premium-response", "ia-premium-message");

    if (autor === "ia" && texto.includes("```")) {
      const parts = texto.split("```");
      let formatted = "";
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          formatted += parts[i].replace(/\n/g, "<br>");
        } else {
          formatted += `<pre>${parts[i]}</pre>`;
        }
      }
      msg.innerHTML = formatted;
    } else {
      msg.textContent = texto;
    }

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

  iaBox.querySelectorAll(".ia-quick-actions button").forEach((button) => {
    button.addEventListener("click", () => {
      const map = {
        tasks: "Como posso ver minhas tarefas pendentes para esta semana?",
        reports: "Como criar um relatório de progresso do projeto?",
        settings: "Onde encontro as configurações de notificação?",
      };
      const message = map[button.dataset.action];
      if (message) {
        input.value = message;
        sendBtn.click();
      }
    });
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  sendBtn.addEventListener("click", async () => {
    const message = input.value.trim();
    if (!message) return;

    adicionarMensagemPremium(message, "user");
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
              content:
                `Você é uma assistente técnica especializada da plataforma Kontrollar para usuários premium. Sua missão é ajudar o usuário a dominar todos os recursos avançados da dashboard com respostas técnicas precisas.

Contexto atual:
- Usuário está na área logada da plataforma
- Possui plano premium com todos os recursos ativados
- Está interagindo diretamente com a dashboard

Diretrizes:
1. Forneça instruções passo a passo detalhadas
2. Inclua snippets de código quando relevante (use \`\`\` para blocos de código)
3. Priorize eficiência e produtividade
4. Sugira atalhos e recursos avançados
5. Formate respostas técnicas com clareza

Recursos premium disponíveis:
• Relatórios personalizados
• Automatização de fluxos
• API de integração
• Exportação de dados avançada
• Controle de permissões granular`
            },
            { role: "user", content: message }
          ]
        })
      });

      if (!response.ok) throw new Error("Erro na API premium");

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Não consegui processar sua solicitação. Por favor, reformule.";

      setTimeout(() => {
        typingIndicator.style.display = "none";
        adicionarMensagemPremium(reply, "ia");
      }, 1200);

    } catch (err) {
      typingIndicator.style.display = "none";
      adicionarMensagemPremium("⚠️ Erro no sistema premium. Nossa equipe já foi notificada. Por favor, tente novamente em alguns minutos.", "ia");
      console.error("Erro premium:", err);
    }
  });
});
