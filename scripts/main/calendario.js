if (typeof window.getKnownUsersForEvents !== "function") {
  window.getKnownUsersForEvents = function () {
    try {
      const base = typeof window.getAllKnownUsers === "function" ? window.getAllKnownUsers() : [];
      const fromLocalRaw = JSON.parse(localStorage.getItem("users") || "[]");
      const fromLocal = Array.isArray(fromLocalRaw)
        ? fromLocalRaw.map(u => (typeof u === "string" ? u : u?.name)).filter(Boolean)
        : [];

      const currentName = (JSON.parse(localStorage.getItem("user") || "{}") || {}).name;

      const chatUsers = Array.isArray(window.chatGrupos)
        ? window.chatGrupos.flatMap(g => [...(g.members || []), ...(g.admins || [])])
        : [];
      const teamUsers = Array.isArray(window.equipes)
        ? window.equipes.flatMap(e => e.members || [])
        : [];

      const all = [ ...base, ...fromLocal, currentName, ...chatUsers, ...teamUsers ]
        .filter(Boolean);

      return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
    } catch {
      return [];
    }
  };
}

function carregarConteudoCalendario() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  const mesAtual = dataAtualCalendario.getMonth();
  const anoAtual = dataAtualCalendario.getFullYear();

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Calendário</h1>
          <p style="color: #666666;">Gerencie eventos, reuniões e prazos</p>
        </div>
        <button id="newEventBtn" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Novo Evento
        </button>
      </div>
  
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <button id="prevMonth" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h2 id="currentMonthYear" style="font-size: 1.25rem; font-weight: 600; flex: 1; text-align: center;"></h2>
            <button id="nextMonth" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          <div id="calendarioGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background-color: #e5e7eb; border: 1px solid #e5e7eb;">
            <!-- Calendario will be generated here -->
          </div>
        </div>
  
        <div style="background-color: #ffffff; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 1rem;">Próximos Eventos</h3>
          <div id="upcomingEvents">
            ${gerarProximoEvento()}
          </div>
        </div>
      </div>
    `;

  configFuncionalidadeCalendario();
  gerarGridCalendario(mesAtual, anoAtual);
}

function configFuncionalidadeCalendario() {
  const newEventBtn = document.getElementById("newEventBtn");
  if (newEventBtn) {
    newEventBtn.addEventListener("click", mostrarNovoEventoModal);
  }

  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  if (prevMonth && nextMonth) {
    prevMonth.addEventListener("click", () => {
      dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() - 1);
      gerarGridCalendario(
        dataAtualCalendario.getMonth(),
        dataAtualCalendario.getFullYear()
      );
    });

    nextMonth.addEventListener("click", () => {
      dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() + 1);
      gerarGridCalendario(
        dataAtualCalendario.getMonth(),
        dataAtualCalendario.getFullYear()
      );
    });
  }
}

function gerarGridCalendario(mes, ano) {
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const currentMonthYear = document.getElementById("currentMonthYear");
  if (currentMonthYear) {
    currentMonthYear.textContent = `${monthNames[mes]} ${ano}`;
  }

  const calendarioGrid = document.getElementById("calendarioGrid");
  if (!calendarioGrid) return;

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const hoje = new Date();

  let calendarioHTML = `
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Dom</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Seg</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Ter</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Qua</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Qui</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Sex</div>
      <div style="background-color: #f9fafb; padding: 0.75rem; text-align: center; font-weight: 500; font-size: 0.875rem;">Sáb</div>
    `;

  for (let i = 0; i < primeiroDia; i++) {
    calendarioHTML +=
      '<div style="background-color: #ffffff; padding: 0.75rem; min-height: 80px;"></div>';
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const eHoje =
      dia === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear();
    const diaFormatado = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
    const diaEventos = eventos.filter((event) => event.date === diaFormatado);

    const dayStyle = eHoje
      ? "background-color: #000000; color: #ffffff; font-weight: 600;"
      : "background-color: #ffffff; color: #000000;";

    calendarioHTML += `
        <div style="${dayStyle} padding: 0.75rem; min-height: 80px; cursor: pointer; position: relative;" onclick="diaSelecionado(${dia}, ${mes}, ${ano})">
          <div style="margin-bottom: 0.5rem;">${dia}</div>
          ${diaEventos
            .map(
              (event) => `
            <div style="background-color: #3b82f6; color: white; font-size: 0.75rem; padding: 0.125rem 0.25rem; border-radius: 0.25rem; margin-bottom: 0.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${sanitizeHTML(event.title || '')}">
              ${sanitizeHTML(event.title || '')}
            </div>
          `
            )
            .join("")}
        </div>
      `;
  }

  calendarioGrid.innerHTML = calendarioHTML;
}

function diaSelecionado(dia, mes, ano) {
  const dataSelecionada = new Date(ano, mes, dia);
  dataSelecionada.setHours(0, 0, 0, 0);

  const eventosDoDia = eventos.filter((evento) => {
    const [anoEvt, mesEvt, diaEvt] = evento.date.split("-");
    const dataEvento = new Date(parseInt(anoEvt), parseInt(mesEvt) - 1, parseInt(diaEvt));
    dataEvento.setHours(0, 0, 0, 0);
    return dataEvento.getTime() === dataSelecionada.getTime();
  });

  if (eventosDoDia.length > 0) {
    const conteudoModal = eventosDoDia
      .map((evento) => {
        const [anoEvt, mesEvt, diaEvt] = evento.date.split("-");
        const dataFormatada = new Date(parseInt(anoEvt), parseInt(mesEvt) - 1, parseInt(diaEvt))
          .toLocaleDateString("pt-BR");

        return `
        <div style="padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.375rem;margin-bottom:0.5rem;">
          <h4 style="font-weight:500;margin-bottom:0.25rem;">${sanitizeHTML(evento.title)}</h4>
          <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">
            ${dataFormatada} às ${evento.time}
          </p>
          ${ (evento.description || "").trim() ? `
            <p style="font-size:0.875rem;color:#4b5563;white-space:pre-wrap;margin-bottom:0.25rem;">
              ${sanitizeHTML(evento.description)}</p>` : ``}
          <p style="font-size:0.75rem;color:#9ca3af;margin-bottom:0.5rem;">
            ${evento.participants?.length || 0} participantes
          </p>

        <div style="display:flex;gap:0.5rem;justify-content:flex-end;">
          <button type="button" class="btn btn-outline" onclick="showEventParticipantsModal(${evento.id})">
            Ver participantes
          </button>
          <button type="button" class="btn btn-outline" onclick="showEditEventModal(${evento.id})">
            Editar
          </button>
        </div>

        </div>`;
      })
      .join("");

    createModal(`Eventos em ${dataSelecionada.toLocaleDateString("pt-BR")}`, conteudoModal);
  } else {
    createModal(
      `Sem eventos em ${dataSelecionada.toLocaleDateString("pt-BR")}`,
      `<p style="color:#666;">Nenhum evento agendado para esta data.</p>`
    );
  }
}


function gerarProximoEvento() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosFuturos = eventos
    .filter((event) => {
      const [ano, mes, dia] = event.date.split("-");
      const dataEvento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      dataEvento.setHours(0, 0, 0, 0);
      return dataEvento >= hoje;
    })
    .sort((a, b) => {
      const [ay, am, ad] = a.date.split("-");
      const [by, bm, bd] = b.date.split("-");
      return new Date(parseInt(ay), parseInt(am) - 1, parseInt(ad)) -
             new Date(parseInt(by), parseInt(bm) - 1, parseInt(bd));
    })
    .slice(0, 5);

  return eventosFuturos
    .map((event) => {
      const [ano, mes, dia] = event.date.split("-");
      const dataFormatada = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
        .toLocaleDateString("pt-BR");

      const desc = (event.description || "").trim();
      const preview = desc.length > 160 ? desc.slice(0, 160) + "…" : desc;

return `
  <div style="padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.375rem;margin-bottom:0.5rem;">
    <h4 style="font-weight:500;margin-bottom:0.25rem;">${sanitizeHTML(event.title || '')}</h4>
    <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">
      ${dataFormatada} às ${event.time}
    </p>
    ${preview ? `
      <p style="font-size:0.75rem;color:#4b5563;margin-bottom:0.25rem;white-space:pre-wrap;overflow:hidden;">
        ${sanitizeHTML(preview)}</p>` : ``}
    <p style="font-size:0.75rem;color:#9ca3af;">
      ${event.participants?.length || 0} participantes
    </p>
    <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:0.5rem;">
      <button type="button" class="btn btn-outline" onclick="showEventParticipantsModal(${event.id})">
        Ver participantes
      </button>
    </div>
  </div>
`;

    })
    .join("");
}


function mostrarNovoEventoModal() {
  const knownUsers = getKnownUsersForEvents();
  const selected = new Map();

  createModal(
    "Criar Novo Evento",
    `
      <form id="newEventForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Título do Evento</label>
          <input type="text" id="eventTitle" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
          <textarea id="eventDescription" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Data</label>
            <input type="date" id="eventDate" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          </div>
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Horário</label>
            <input type="time" id="eventTime" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tipo</label>
          <select id="eventType" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="meeting">Reunião</option>
            <option value="review">Revisão</option>
            <option value="presentation">Apresentação</option>
            <option value="deadline">Prazo</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div style="margin-bottom:0.5rem;font-weight:600;">Participantes</div>

        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="eventUserSearch" placeholder="Buscar usuários..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="eventManualUser" placeholder="Adicionar manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="eventAddManualBtn" class="btn btn-outline">Adicionar</button>
        </div>

        <div id="eventUserList"
             style="max-height:220px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          <!-- linhas de usuários -->
        </div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Criar Evento</button>
        </div>
      </form>
    `
  );

  function upsertRow(name) {
    const list = document.getElementById("eventUserList");
    if (!list || list.querySelector(`[data-row="${CSS.escape(name)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(name)}">
        ${sanitizeHTML(name)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="evIncChk" data-user="${sanitizeHTML(name)}">
        <span>Participa</span>
      </label>
    `;
    list.appendChild(row);

    const inc = row.querySelector(".evIncChk");
    const st = selected.get(name) || { included: false };
    inc.checked = st.included;

    inc.addEventListener("change", () => {
      const cur = selected.get(name) || { included: false };
      cur.included = inc.checked;
      selected.set(name, cur);
    });
  }

  for (const u of knownUsers) {
    if (!selected.has(u)) selected.set(u, { included: false });
    upsertRow(u);
  }

  document.getElementById("eventUserSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#eventUserList [data-row]").forEach((r) => {
      const name = r.getAttribute("data-row") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });


  document.getElementById("eventAddManualBtn").addEventListener("click", () => {
    const input = document.getElementById("eventManualUser");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selected.has(name)) selected.set(name, { included: true });
    upsertRow(name);
    const row = document.querySelector(`#eventUserList [data-row="${CSS.escape(name)}"]`);
    const inc = row?.querySelector(".evIncChk");
    if (inc) inc.checked = true;
    selected.set(name, { included: true });
    input.value = "";
    input.focus();
  });

  document.getElementById("newEventForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const dateInput = document.getElementById("eventDate").value;
    const [ano, mes, dia] = dateInput.split("-");
    const dateOnly = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

    const participants = [];
    for (const [name, st] of selected.entries()) {
      if (st.included) participants.push(name);
    }

    const novoEvento = {
      id: Date.now(),
      title: document.getElementById("eventTitle").value,
      description: document.getElementById("eventDescription").value,
      date: dateOnly,
      time: document.getElementById("eventTime").value,
      type: document.getElementById("eventType").value,
      participants,
    };

    eventos.push(novoEvento);
    fecharModal();
    carregarConteudoCalendario();
  });
}


function showEditEventModal(eventId) {
  const ev = eventos.find(e => e.id === eventId);
  if (!ev) return;

  const knownUsers = getKnownUsersForEvents();
  const selected = new Map();
  (Array.isArray(ev.participants) ? ev.participants : []).forEach(p => {
    selected.set(p, { included: true });
  });
  for (const u of knownUsers) if (!selected.has(u)) selected.set(u, { included: false });

  createModal(
    "Editar Evento",
    `
    <form id="editEventForm">
      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Título</label>
        <input type="text" id="editEventTitle" value="" required
               style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
        <textarea id="editEventDescription"
        style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Data</label>
          <input type="date" id="editEventDate" value="${ev.date}"
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Horário</label>
          <input type="time" id="editEventTime" value="${ev.time}"
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tipo</label>
        <select id="editEventType"
                style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <option value="meeting" ${ev.type==="meeting"?"selected":""}>Reunião</option>
          <option value="review" ${ev.type==="review"?"selected":""}>Revisão</option>
          <option value="presentation" ${ev.type==="presentation"?"selected":""}>Apresentação</option>
          <option value="deadline" ${ev.type==="deadline"?"selected":""}>Prazo</option>
          <option value="other" ${ev.type==="other"?"selected":""}>Outro</option>
        </select>
      </div>

      <div style="margin-bottom:0.5rem;font-weight:600;">Participantes</div>

      <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
        <input type="text" id="editEventUserSearch" placeholder="Buscar usuários..."
               style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        <input type="text" id="editEventManualUser" placeholder="Adicionar manualmente"
               style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        <button type="button" id="editEventAddManualBtn" class="btn btn-outline">Adicionar</button>
      </div>

      <div id="editEventUserList"
           style="max-height:220px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
        <!-- linhas -->
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
    `
  );

  document.getElementById("editEventTitle").value = ev.title || "";
  document.getElementById("editEventDescription").value = ev.description || "";

  function upsertRow(name) {
    const list = document.getElementById("editEventUserList");
    if (!list || list.querySelector(`[data-row="${CSS.escape(name)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(name)}">
        ${sanitizeHTML(name)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="evIncChk" data-user="${sanitizeHTML(name)}">
        <span>Participa</span>
      </label>
    `;
    list.appendChild(row);

    const inc = row.querySelector(".evIncChk");
    const st = selected.get(name) || { included: false };
    inc.checked = st.included;

    inc.addEventListener("change", () => {
      const cur = selected.get(name) || { included: false };
      cur.included = inc.checked;
      selected.set(name, cur);
    });
  }

  for (const u of Array.from(new Set([...knownUsers, ...selected.keys()]))) {
    if (!selected.has(u)) selected.set(u, { included: false });
    upsertRow(u);
  }

  document.getElementById("editEventUserSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#editEventUserList [data-row]").forEach((r) => {
      const name = r.getAttribute("data-row") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("editEventAddManualBtn").addEventListener("click", () => {
    const input = document.getElementById("editEventManualUser");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selected.has(name)) selected.set(name, { included: true });
    upsertRow(name);
    const row = document.querySelector(`#editEventUserList [data-row="${CSS.escape(name)}"]`);
    const inc = row?.querySelector(".evIncChk");
    if (inc) inc.checked = true;
    selected.set(name, { included: true });
    input.value = "";
    input.focus();
  });

  document.getElementById("editEventForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const parts = [];
    for (const [name, st] of selected.entries()) {
      if (st.included) parts.push(name);
    }

    ev.title = document.getElementById("editEventTitle").value;
    ev.description = document.getElementById("editEventDescription").value;
    ev.date = document.getElementById("editEventDate").value || ev.date;
    ev.time = document.getElementById("editEventTime").value || ev.time;
    ev.type = document.getElementById("editEventType").value;
    ev.participants = parts;

    fecharModal();
    carregarConteudoCalendario();
  });
}

function showEventParticipantsModal(eventId) {
  const ev = eventos.find(e => e.id === eventId);
  if (!ev) return;

  const parts = Array.isArray(ev.participants) ? ev.participants.filter(Boolean) : [];
  const listHtml = parts.length
    ? parts.map(p => `<li style="padding:0.25rem 0;border-bottom:1px dashed #eee;">${sanitizeHTML(p)}</li>`).join("")
    : '<p style="color:#666;">Nenhum participante adicionado.</p>';

  createModal(
    `Participantes — ${sanitizeHTML(ev.title || "")}`,
    `
      <div style="max-height:320px;overflow:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
          <span style="font-size:0.875rem;color:#6b7280">${parts.length} participante(s)</span>
          ${parts.length ? '<button type="button" class="btn btn-outline" id="copyParticipantsBtn">Copiar lista</button>' : ''}
        </div>
        ${parts.length ? `<ul id="participantsList" style="list-style:none;padding:0;margin:0;">${listHtml}</ul>` : listHtml}
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
        <button type="button" onclick="fecharModal()" class="btn btn-primary">Fechar</button>
      </div>
    `
  );

  const copyBtn = document.getElementById("copyParticipantsBtn");
  if (copyBtn && parts.length) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(parts.join(", "));
        if (typeof showToast === "function") showToast("Lista copiada.");
      } catch (err) {
        console.warn("Falha ao copiar participantes:", err);
      }
    });
  }
}