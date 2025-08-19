function getAllKnownUsers() {
  const current = JSON.parse(localStorage.getItem("user") || "{}");
  const fromLocal = JSON.parse(localStorage.getItem("users") || "[]");
  const list = [];

  if (Array.isArray(fromLocal)) {
    for (const u of fromLocal) {
      if (typeof u === "string") list.push(u);
      else if (u && typeof u === "object" && u.name) list.push(u.name);
    }
  }

  if (Array.isArray(window.chatGrupos)) {
    for (const g of chatGrupos) {
      if (Array.isArray(g.members)) list.push(...g.members);
      if (Array.isArray(g.admins)) list.push(...g.admins);
    }
  }

  if (current && current.name) list.push(current.name);

  return Array.from(new Set(list.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function canUserPost(chat, userName) {
  const posting = chat?.policies?.posting || "all";
  if (posting === "admins") {
    return Array.isArray(chat.admins) && chat.admins.includes(userName);
  }
  return true;
}

function showToast(msg) {
  console.log(msg);
}

function carregarConteudoChat() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Chat</h1>
        <p style="color: #666666;">Comunicação em tempo real com sua equipe</p>
      </div>
      <button id="newChatBtn" class="btn btn-primary">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nova Conversa
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1rem; height: 600px;">
      <!-- Lista de Conversas -->
      <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1rem; display: flex; flex-direction: column;">
        <div style="position: relative; margin-bottom: 1rem;">
          <input 
            type="text" 
            id="chatSearch" 
            placeholder="Buscar conversas..."
            style="width: 100%; padding: 0.5rem 2rem 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #d1d5db;"
          >
          <svg style="position: absolute; right: 0.75rem; top: 0.5rem; width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="#666666">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 style="font-weight: 600; margin-bottom: 1rem;">Conversas</h3>
        <div id="chatGruposList" style="overflow-y: auto; flex: 1;">${gerarListaChats()}</div>
      </div>

      <!-- Mensagens -->
      <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; display: flex; flex-direction: column;">
        <div id="chatHeader" style="padding: 1rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
          <h3 id="currentChatName" style="font-weight: 600;">Selecione uma conversa</h3>
          <button id="leaveChatBtn" style="display: none;" class="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-right: 4px;">
              <path d="M16 17l5-5m0 0l-5-5m5 5H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
        <div id="chatMessages" style="flex: 1; padding: 1rem; overflow-y: auto; background-color: #f9fafb; display: flex; flex-direction: column;">
          <div style="text-align: center; color: #666666; margin-top: 2rem;">
            Selecione uma conversa para começar
          </div>
        </div>
        <div id="chatInput" style="padding: 1rem; border-top: 1px solid #e5e7eb; display: none;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="messageInput" placeholder="Digite sua mensagem..." style="flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <button id="clearMessage" class="btn btn-outline" style="padding: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666">
                <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button id="sendMessage" class="btn btn-primary">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  configChatFuncionalidade();
}

function configChatFuncionalidade() {
  document
    .getElementById("newChatBtn")
    ?.addEventListener("click", showNewChatModal);

  document.getElementById("chatSearch")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll(".chat-room-item").forEach((item) => {
      const name = item.querySelector("h4").textContent.toLowerCase();
      item.style.display = name.includes(term) ? "block" : "none";
    });
  });

  document.getElementById("chatGruposList")?.addEventListener("click", (e) => {
    const chatItem = e.target.closest(".chat-room-item");
    if (chatItem) {
      const roomId = parseInt(chatItem.getAttribute("data-room-id"));
      chatSelecionado(roomId);
    }
  });
}

function gerarListaChats() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return chatGrupos
    .map((room) => {
      const lastMessage = room.messages.length
        ? room.messages[room.messages.length - 1].content
        : "Sem mensagens ainda";

      const unreadCount = room.messages.reduce((count, msg) => {
        return msg.sender !== user.name && !msg.read ? count + 1 : count;
      }, 0);

      return `
      <div class="chat-room-item" data-room-id="${room.id}"
        style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem; cursor: pointer; position: relative;"
        onmouseover="this.style.backgroundColor='#f3f4f6'"
        onmouseout="this.style.backgroundColor='${
          room.id ===
          parseInt(
            localStorage.getItem("ultimoChat") ? "#f3f4f6" : "transparent"
          )
        }'">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="overflow: hidden; width: ${
            unreadCount ? "calc(100% - 30px)" : "100%"
          }">
            <h4 style="font-weight: 500; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
              room.name
            }</h4>
            <p style="font-size: 0.75rem; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMessage}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${
              unreadCount > 0
                ? `
              <span style="background-color: #3b82f6; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">
                ${unreadCount}
              </span>
            `
                : ""
            }
            <div style="width: 8px; height: 8px; background-color: ${
              room.type === "public" ? "#10b981" : "#3b82f6"
            }; border-radius: 50%;"></div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function chatSelecionado(roomId) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const room = chatGrupos.find((r) => r.id === roomId);
  if (!room) return;

  localStorage.setItem("ultimoChat", roomId);

  room.messages.forEach((msg) => {
    if (msg.sender !== user.name) msg.read = true;
  });

  document.getElementById("currentChatName").textContent = room.name;
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = generateChatMessages(room.messages);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  document.getElementById("chatInput").style.display = "block";

  const leaveBtn = document.getElementById("leaveChatBtn");
  leaveBtn.style.display = "block";
  leaveBtn.onclick = () => sairDaConversa(roomId);

  setupMessageSending(roomId);
  atualizarListaChats();
}

function sairDaConversa(roomId) {
  const roomIndex = chatGrupos.findIndex((r) => r.id === roomId);
  if (roomIndex === -1) return;

  chatGrupos.splice(roomIndex, 1);

  document.getElementById("currentChatName").textContent =
    "Selecione uma conversa";
  document.getElementById("chatMessages").innerHTML = `
    <div style="text-align: center; color: #666666; margin-top: 2rem;">
      Selecione uma conversa para começar
    </div>
  `;
  document.getElementById("chatInput").style.display = "none";
  document.getElementById("leaveChatBtn").style.display = "none";

  localStorage.removeItem("ultimoChat");

  atualizarListaChats();
}

function generateChatMessages(messages) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (messages.length === 0) {
    return `
      <div style="text-align: center; color: #666666; margin-top: 2rem;">
        Nenhuma mensagem ainda. Seja o primeiro a enviar!
      </div>
    `;
  }

  let currentDate = "";
  let html = "";
  let lastSender = null;

  messages.forEach((message, index) => {
    const isOwn = message.sender === user.name;
    const messageDate = new Date(message.timestamp).toLocaleDateString("pt-BR");
    const showDate = currentDate !== messageDate;

    if (showDate) {
      currentDate = messageDate;
      html += `
        <div style="text-align: center; margin: 1rem 0; position: relative;">
          <hr style="position: absolute; top: 50%; width: 100%; margin: 0; border-color: #e5e7eb;">
          <span style="background: #f9fafb; position: relative; z-index: 1; padding: 0 1rem; color: #666; font-size: 0.8rem;">
            ${currentDate}
          </span>
        </div>
      `;
    }

    const showSender = !isOwn && lastSender !== message.sender;
    lastSender = message.sender;

    html += `
      <div style="margin-bottom: 0.5rem; display: flex; ${
        isOwn ? "justify-content: flex-end" : "justify-content: flex-start"
      };">
        <div style="max-width: 70%; ${
          isOwn
            ? "background-color: #000000; color: white;"
            : "background-color: white; color: black; border: 1px solid #e5e7eb;"
        } padding: 0.75rem; border-radius: 0.5rem;">
          ${
            showSender && !isOwn
              ? `<div style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem;">${sanitizeHTML(
                  message.sender
                )}</div>`
              : ""
          }
          <div>${sanitizeHTML(message.content)}</div>
          <div style="font-size: 0.75rem; ${
            isOwn ? "color: #d1d5db" : "color: #9ca3af"
          }; margin-top: 0.25rem; text-align: right;">
            ${new Date(message.timestamp).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

function sanitizeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setupMessageSending(roomId) {
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendMessage");
  const clearButton = document.getElementById("clearMessage");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  clearButton.onclick = () => {
    messageInput.value = "";
    messageInput.focus();
  };

  const send = () => {
    const content = messageInput.value.trim();
    if (!content) return;

    const room = chatGrupos.find((r) => r.id === roomId);
    if (!room) return;

    const message = {
      id: Date.now(),
      sender: user.name,
      content,
      timestamp: new Date().toISOString(),
      type: "text",
      read: false,
    };

    room.messages.push(message);
    messageInput.value = "";
    messageInput.focus();

    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = generateChatMessages(room.messages);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    atualizarListaChats();
  };

  sendButton.onclick = send;
  messageInput.onkeypress = (e) => {
    if (e.key === "Enter") send();
  };
}

function showNewChatModal() {
  const knownUsers = getAllKnownUsers();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentName = currentUser?.name || "Você";

  const modal = createModal(
    "Nova Conversa",
    `
    <form id="newChatForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome da Conversa</label>
        <input type="text" id="chatName" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tipo</label>
          <select id="chatType" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="public">Público</option>
            <option value="private">Privado</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Envio de mensagens</label>
          <div style="display:flex;align-items:center;gap:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;padding:0.5rem;">
            <input type="checkbox" id="onlyAdminsPost">
            <label for="onlyAdminsPost" title="Se ativado, somente administradores podem enviar mensagens">
              Apenas administradores podem enviar
            </label>
          </div>
        </div>
      </div>

      <div style="margin-bottom:0.5rem;font-weight:600;">Participantes & Administradores</div>

      <div style="display:flex;gap:1rem;margin-bottom:0.75rem;">
        <input type="text" id="userSearch" placeholder="Buscar usuários..."
               style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        <div style="display:flex;gap:0.5rem;">
          <input type="text" id="manualUser" placeholder="Adicionar manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="addManualUserBtn" class="btn btn-outline">Adicionar</button>
        </div>
      </div>

      <div id="userList" style="max-height:220px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
        <!-- linhas de usuários -->
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Conversa</button>
      </div>
    </form>
    `
  );

  const selected = new Map();

  function ensureCreator() {
    selected.set(currentName, { included: true, admin: true, locked: true });
  }

  function upsertRow(name) {
    const list = document.getElementById("userList");
    if (!list || list.querySelector(`[data-row="${CSS.escape(name)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";

    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${name}">
        ${name}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="incChk" data-user="${name}">
        <span>Participa</span>
      </label>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="admChk" data-user="${name}">
        <span>Adm</span>
      </label>
    `;
    list.appendChild(row);

    const inc = row.querySelector(".incChk");
    const adm = row.querySelector(".admChk");
    const st = selected.get(name) || { included: false, admin: false };

    inc.checked = st.included;
    adm.checked = st.admin;
    adm.disabled = !st.included;

    if (st.locked) {
      inc.checked = true;
      inc.disabled = true;
      adm.checked = true;
      adm.disabled = true;
    }

    inc.addEventListener("change", () => {
      const cur = selected.get(name) || { included: false, admin: false };
      cur.included = inc.checked;
      if (!cur.included) cur.admin = false;
      selected.set(name, cur);
      adm.disabled = !cur.included || cur.locked;
      adm.checked = cur.admin;
    });

    adm.addEventListener("change", () => {
      const cur = selected.get(name) || { included: false, admin: false };
      if (!cur.included) {
        cur.included = true;
        inc.checked = true;
      }
      cur.admin = adm.checked;
      selected.set(name, cur);
    });
  }

  ensureCreator();
  for (const u of getAllKnownUsers()) {
    if (!selected.has(u)) selected.set(u, { included: false, admin: false });
    if (u === currentName) selected.set(u, { included: true, admin: true, locked: true });
    upsertRow(u);
  }

  document.getElementById("userSearch")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#userList [data-row]").forEach((r) => {
      const name = r.getAttribute("data-row") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("addManualUserBtn")?.addEventListener("click", () => {
    const input = document.getElementById("manualUser");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selected.has(name)) selected.set(name, { included: true, admin: false });
    upsertRow(name);
    const row = document.querySelector(`#userList [data-row="${CSS.escape(name)}"]`);
    row?.querySelector(".incChk")?.click?.();
    input.value = "";
  });

  document.getElementById("newChatForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const chatName = document.getElementById("chatName").value.trim();
    const chatType = document.getElementById("chatType").value;
    const onlyAdminsPost = document.getElementById("onlyAdminsPost").checked;

    if (!chatName) {
      showToast("Defina um nome para a conversa.");
      return;
    }

    const members = [];
    const admins = [];
    for (const [name, st] of selected.entries()) {
      if (st.included) {
        members.push(name);
        if (st.admin) admins.push(name);
      }
    }

    if (!members.length) {
      showToast("Selecione pelo menos um participante.");
      return;
    }
    if (!admins.length) {
      showToast("Defina pelo menos um administrador.");
      return;
    }
    if (!members.includes(currentName)) members.push(currentName);
    if (!admins.includes(currentName)) admins.push(currentName);

    const newChat = {
      id: Date.now(),
      name: chatName,
      type: chatType,
      members,      
      admins,       
      policies: {
        posting: onlyAdminsPost ? "admins" : "all",
      },
      messages: [],
    };

    window.chatGrupos = Array.isArray(window.chatGrupos) ? window.chatGrupos : [];
    chatGrupos.push(newChat);
    try { localStorage.setItem("chatGrupos", JSON.stringify(chatGrupos)); } catch (_) {}

    fecharModal();
    atualizarListaChats();
    setTimeout(() => chatSelecionado(newChat.id), 100);
  });
}

function atualizarListaChats() {
  const container = document.getElementById("chatGruposList");
  if (container) {
    container.innerHTML = gerarListaChats();
  }
}