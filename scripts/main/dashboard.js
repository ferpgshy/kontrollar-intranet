const DS = {
  get projetos() {
    return Array.isArray(window.projetos)
      ? window.projetos
      : JSON.parse(localStorage.getItem("projetos") || "[]");
  },
  get tarefas() {
    return Array.isArray(window.tarefas)
      ? window.tarefas
      : JSON.parse(localStorage.getItem("tarefas") || "[]");
  },
  get eventos() {
    return Array.isArray(window.eventos)
      ? window.eventos
      : JSON.parse(localStorage.getItem("eventos") || "[]");
  },
  get equipes() {
    return Array.isArray(window.equipes)
      ? window.equipes
      : JSON.parse(localStorage.getItem("equipes") || "[]");
  },
};

const S =
  typeof sanitizeHTML === "function"
    ? sanitizeHTML
    : (s) =>
        String(s).replace(
          /[&<>"']/g,
          (m) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            }[m])
        );

// Mapeadores rápidos
function maps() {
  const projMap = new Map(DS.projetos.map((p) => [Number(p.id), p]));
  const teamMap = new Map(DS.equipes.map((t) => [Number(t.id), t]));
  return { projMap, teamMap };
}

// ---------- UI principal ----------
function carregarConteudoDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const conteudoPagina = document.getElementById("conteudoPagina");
  const projetos = DS.projetos;
  const tarefas = DS.tarefas;
  const eventos = DS.eventos;

  const totalProjetos = projetos.length;

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const projetosEsteMes = projetos.filter(
    (p) =>
      new Date(p.createdAt || p.updatedAt || p.deadline || Date.now()) >=
      inicioMes
  ).length;

  const limite7 = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() + 7
  );

  const proximoPrazo =
    projetos
      .map((p) => ({ ...p, _deadline: new Date(p.deadline || "2999-12-31") }))
      .filter((p) => p._deadline >= hoje && p._deadline <= limite7)
      .sort((a, b) => a._deadline - b._deadline)[0] || null;

  const prazoProximos7Dias = proximoPrazo
    ? `${proximoPrazo._deadline.toLocaleDateString("pt-BR")}`
    : "Nenhum prazo próximo";

  const prazoProximos7DiasChange = proximoPrazo
    ? proximoPrazo.name || "Sem nome"
    : "próximos 7 dias";

  conteudoPagina.innerHTML = `
    <div class="welcome-section">
      <h1 class="welcome-title">Bem-vindo de volta, ${S(
        user.name || "Usuário"
      )}! 👋</h1>
      <p class="welcome-description">Aqui está um resumo do que está acontecendo em seus projetos hoje.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Projetos Ativos</h3>
            <div class="stat-value">${totalProjetos}</div>
            <div class="stat-change">+${projetosEsteMes} este mês</div>
          </div>
          <div class="stat-icon blue">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <!-- Prancheta -->
              <rect x="4" y="4" width="16" height="18" rx="2" ry="2"/>
              <path d="M9 2h6v4H9z"/> <!-- Cabeçalho da prancheta -->
              <!-- Linhas de tarefas -->
              <line x1="8" y1="10" x2="16" y2="10"/>
              <line x1="8" y1="14" x2="16" y2="14"/>
              <line x1="8" y1="18" x2="16" y2="18"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card" id="card-tarefas-concluidas">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Tarefas Concluídas</h3>
            <div class="stat-value">0</div>
            <div class="stat-change">+0 esta semana</div>
          </div>
          <div class="stat-icon green">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card" id="teamsStatCard" style="border:1px solid #e5e7eb;border-radius:0.75rem;padding:1rem;background:#fff">
        <div class="stat-header" style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem">
          <div class="stat-info" style="display:flex;flex-direction:column;gap:0.25rem">
            <h3 style="margin:0;font-size:0.95rem;color:#111827;">Equipes & Parceiros</h3>
            <div class="stat-value" style="font-weight:700;font-size:1.35rem;color:#111827;">
              <span id="totalTeams">0</span> equipes
            </div>
            <div class="stat-sub" style="font-size:0.875rem;color:#6b7280;">
              Total de parceiros: <strong id="totalPartners">0</strong>
            </div>
          </div>

          <button type="button" title="Atualizar" onclick="updateTeamsStatCard()"
            class="stat-icon purple"
            style="border:none;background:#f5f3ff;color:#6d28d9;border-radius:0.75rem;padding:0.6rem;display:flex;align-items:center;justify-content:center;cursor:pointer">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:20px;height:20px">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </button>
        </div>
        <div id="teamPartnerBreakdown" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.75rem"></div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Prazo Próximo</h3>
            <div class="stat-value">${prazoProximos7Dias}</div>
            <div class="stat-change">${prazoProximos7DiasChange}</div>
          </div>
          <div class="stat-icon orange">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
        </div>
      </div>

    </div>

    <div class="content-grid">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <!-- Prancheta -->
              <rect x="4" y="4" width="16" height="18" rx="2" ry="2"/>
              <path d="M9 2h6v4H9z"/> <!-- Cabeçalho da prancheta -->
              <!-- Linhas de tarefas -->
              <line x1="8" y1="10" x2="16" y2="10"/>
              <line x1="8" y1="14" x2="16" y2="14"/>
              <line x1="8" y1="18" x2="16" y2="18"/>
            </svg>
            Projetos Recentes
          </h2>
          <p class="section-description">Acompanhe o progresso dos seus projetos principais</p>
        </div>
        <div class="section-content">
          ${gerarProjetosRecentes()}
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Calendário
          </h2>
        </div>
        <div class="section-content">
          ${gerarCalendario()}
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
            Tarefas Recentes
          </h2>
          <p class="section-description">Últimas tarefas atribuídas à sua equipe</p>
        </div>
        <div class="section-content">
          ${gerarTarefasRecentes()}
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Próximos Eventos
          </h2>
          <p class="section-description">Reuniões e eventos programados</p>
        </div>
        <div class="section-content">
          ${gerarEventosFuturos()}
        </div>
      </div>
    </div>
  `;

  atualizarCardTarefasConcluidas();
  requestAnimationFrame(updateTeamsStatCard);
}

// --------- Equipes & Parceiros ----------
function getTeamsPartnersStats(equipesArr) {
  if (!Array.isArray(equipesArr)) equipesArr = DS.equipes;
  let totalTeams = 0,
    totalPartners = 0;
  const byTeam = [];

  for (const eq of equipesArr) {
    const count = Array.isArray(eq?.members)
      ? eq.members.filter(Boolean).length
      : 0;
    byTeam.push({ id: eq?.id, name: eq?.name ?? "Sem nome", count });
    totalTeams += 1;
    totalPartners += count;
  }
  byTeam.sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR")
  );
  return { totalTeams, totalPartners, byTeam };
}

function updateTeamsStatCard() {
  const totalsEl = document.getElementById("totalTeams");
  const partnersEl = document.getElementById("totalPartners");
  const listEl = document.getElementById("teamPartnerBreakdown");
  if (!totalsEl || !partnersEl || !listEl) return;

  const { totalTeams, totalPartners, byTeam } = getTeamsPartnersStats();

  totalsEl.textContent = totalTeams;
  partnersEl.textContent = totalPartners;

  listEl.innerHTML = byTeam.length
    ? byTeam
        .map(
          (t) => `
      <span title="${S(t.name)}"
            style="display:inline-flex;align-items:center;gap:0.35rem;background:#f3f4f6;color:#374151;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.75rem;">
        <span style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${S(
          t.name
        )}</span>
        <strong style="color:#111827;">${t.count}</strong>
      </span>`
        )
        .join("")
    : `<div style="font-size:0.85rem;color:#6b7280;">Nenhuma equipe cadastrada.</div>`;
}

// --------- Blocos de conteúdo ----------
function gerarProjetosRecentes() {
  const { teamMap } = maps();
  const recentes = DS.projetos
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || b.deadline || 0) -
        new Date(a.createdAt || a.updatedAt || a.deadline || 0)
    )
    .slice(0, 3);

  return (
    recentes
      .map((projeto) => {
        const equipeObj = projeto.equipeId
          ? teamMap.get(Number(projeto.equipeId))
          : null;
        const membersCount = Array.isArray(equipeObj?.members)
          ? equipeObj.members.length
          : Array.isArray(projeto.members)
          ? projeto.members.length
          : Array.isArray(projeto.equipe)
          ? projeto.equipe.length
          : 0;

        const progress = Number(projeto.progress || 0);
        const status = projeto.status || "Em andamento";
        const deadline = projeto.deadline
          ? formatarDataPtBR(String(projeto.deadline))
          : "—";

        return `
      <div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
          <h3 style="font-weight:600;color:#000;">${S(
            projeto.name || "Sem nome"
          )}</h3>
          <span style="padding:0.25rem 0.5rem;background:#f3f4f6;color:#374151;border-radius:0.25rem;font-size:0.75rem;">${S(
            status
          )}</span>
        </div>
        <div style="display:flex;gap:1rem;margin-bottom:0.75rem;font-size:0.875rem;color:#666;">
          <span>${membersCount} membros</span>
          <span>${deadline}</span>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-bottom:0.25rem;">
            <span>Progresso</span>
            <span>${progress}%</span>
          </div>
          <div style="width:100%;background:#e5e7eb;border-radius:0.25rem;height:0.5rem;">
            <div style="background:#000;height:100%;border-radius:0.25rem;width:${Math.max(
              0,
              Math.min(100, progress)
            )}%;"></div>
          </div>
        </div>
      </div>
    `;
      })
      .join("") || `<p style="color:#9ca3af;">Nenhum projeto encontrado.</p>`
  );
}

function gerarTarefasRecentes() {
  const tarefas = DS.tarefas;
  if (!tarefas.length)
    return `<p style="color:#9ca3af;">Nenhuma tarefa encontrada.</p>`;

  const { projMap, teamMap } = maps();
  const ord = [...tarefas]
    .sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0))
    .slice(0, 5);

  return ord
    .map((t) => {
      const projNome =
        (t.projetoId && projMap.get(Number(t.projetoId))?.name) ||
        t.projetos ||
        "—";

      const equipeNome =
        (t.equipeId && teamMap.get(Number(t.equipeId))?.name) || t.equipe || "";

      const who = S(t.assignee || t.responsavel || "—");
      const prioridade = String(t.priority || "média").toLowerCase();

      const prioStyle =
        typeof getPriorityStyle === "function"
          ? getPriorityStyle(prioridade)
          : "background:#f3f4f6;color:#111827;";

      const extra = equipeNome ? ` • ${S(equipeNome)}` : "";

      return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem;">
        <div style="flex:1;">
          <h4 style="font-weight:500;color:#000;margin-bottom:0.25rem;">${S(
            t.title || "Sem título"
          )}</h4>
          <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">${S(
            projNome
          )}${extra}</p>
          <p style="font-size:0.75rem;color:#9ca3af;">Atribuído a: ${who}</p>
        </div>
        <span style="padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:500;${prioStyle}">${S(
        prioridade
      )}</span>
      </div>
    `;
    })
    .join("");
}

function atualizarCardTarefasConcluidas() {
  const t = DS.tarefas;
  const concluidas = t.filter((x) =>
    String(x.status || "")
      .toLowerCase()
      .includes("concl")
  );
  const concluidasSemana = concluidas.filter((x) => {
    const data = new Date(
      x.updatedAt || x.createdAt || x.deadline || Date.now()
    );
    const hoje = new Date();
    const sete = new Date();
    sete.setDate(hoje.getDate() - 7);
    return data >= sete && data <= hoje;
  });

  const card = document.querySelector("#card-tarefas-concluidas");
  if (!card) return;
  card.querySelector(".stat-value").textContent = String(concluidas.length);
  card.querySelector(
    ".stat-change"
  ).textContent = `+${concluidasSemana.length} esta semana`;
}

function gerarEventosFuturos() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const proximos = DS.eventos
    .map((ev) => {
      const [ano, mes, dia] = String(ev.date || "")
        .split("-")
        .map(Number);
      const data = new Date(ano, (mes || 1) - 1, dia || 1);
      data.setHours(0, 0, 0, 0);
      const diff = Math.floor((data - hoje) / (1000 * 60 * 60 * 24));
      let dataLabel =
        diff === 0
          ? "Hoje"
          : diff === 1
          ? "Amanhã"
          : data.toLocaleDateString("pt-BR", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            });
      return { ...ev, dataLabel, dataObj: data };
    })
    .filter((e) => e.dataObj >= hoje)
    .sort((a, b) => a.dataObj - b.dataObj)
    .slice(0, 5);

  if (!proximos.length)
    return `<p style="color:#666;">Nenhum evento futuro agendado.</p>`;

  return proximos
    .map(
      (ev) => `
    <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem;">
      <div style="width:0.5rem;height:0.5rem;background:#3b82f6;border-radius:50%;"></div>
      <div style="flex:1;">
        <h4 style="font-weight:500;color:#000;margin-bottom:0.25rem;">${S(
          ev.title || "Evento"
        )}</h4>
        <p style="font-size:0.875rem;color:#666;">${ev.dataLabel} às ${S(
        ev.time || "--:--"
      )}</p>
      </div>
    </div>
  `
    )
    .join("");
}

function gerarCalendario() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

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

  let cal = `
    <div style="text-align:center;margin-bottom:1rem;">
      <h3 style="font-weight:600;color:#000;">${
        monthNames[mesAtual]
      } ${anoAtual}</h3>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.25rem;text-align:center;">
      ${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
        .map(
          (d) =>
            `<div style="font-weight:500;color:#666;padding:0.5rem;font-size:0.75rem;">${d}</div>`
        )
        .join("")}
  `;

  for (let i = 0; i < primeiroDia; i++)
    cal += '<div style="padding:0.5rem;"></div>';

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const eHoje = dia === hoje.getDate();
    const temEvento = DS.eventos.some((ev) => {
      const [ano, mes, d] = String(ev.date || "")
        .split("-")
        .map(Number);
      return d === dia && mes === mesAtual + 1 && ano === anoAtual;
    });

    let style = `
      padding:0.5rem;
      ${eHoje ? "background:#000;color:#fff;" : "color:#000;cursor:pointer;"} 
      border-radius:0.25rem;
      font-weight:500;
      transition:background-color .2s ease;
      position:relative;`;

    if (temEvento) style += `border-bottom:3px solid #2563eb;`;

    cal += `
      <div style="${style}"
           onclick="diaSelecionado && diaSelecionado(${dia}, ${mesAtual}, ${anoAtual})"
           ${
             !eHoje
               ? "onmouseover=\"this.style.backgroundColor='#f3f4f6'\" onmouseout=\"this.style.backgroundColor='transparent'\""
               : ""
           }>
        ${dia}
      </div>`;
  }
  cal += "</div>";
  return cal;
}

// // eventos customizados disparados pelas outras abas (projetos/backlogs/equipes/calendário)
// ["projetos", "tarefas", "equipes", "eventos"].forEach((k) => {
//   document.addEventListener(`data:${k}:changed`, _refreshDashboard);
// });

// sincroniza quando localStorage muda (outra aba/janela)
window.addEventListener("storage", (e) => {
  if (["projetos", "tarefas", "equipes", "eventos"].includes(e.key))
    _refreshDashboard();
});
