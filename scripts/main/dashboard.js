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







// ===== Equipes & Parceiros (100% compatível com data.js) =====

// Fonte única de verdade: data.js usa `const equipes = [...]`.
// Aqui, tentamos nesta ordem: window.equipes -> (global) equipes -> localStorage.
function getEquipesArray() {
  if (Array.isArray(window?.equipes)) return window.equipes;
  try { if (typeof equipes !== "undefined" && Array.isArray(equipes)) return equipes; } catch {}
  try {
    const ls = JSON.parse(localStorage.getItem("equipes") || "[]");
    if (Array.isArray(ls)) return ls;
  } catch {}
  return [];
}

function computeTeamsPartnersStats() {
  const arr = getEquipesArray();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "";

  let totalTeams = 0;
  let totalPartners = 0;
  const byTeam = [];

  for (const eq of arr) {
    // só conta se o usuário é líder ou membro
    const isMyTeam =
      eq?.leader === userName ||
      (Array.isArray(eq?.members) && eq.members.includes(userName));

    if (!isMyTeam) continue;

    const name = eq?.name ? String(eq.name) : "Sem nome";
    const count = Array.isArray(eq?.members) ? eq.members.filter(Boolean).length : 0;
    byTeam.push({ id: Number(eq?.id) || 0, name, count });
    totalTeams += 1;
    totalPartners += count;
  }

  byTeam.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));
  return { totalTeams, totalPartners, byTeam };
}


function makeTeamChip({ name, count }) {
  const chip = document.createElement("span");
  chip.title = name;
  chip.style.display = "inline-flex";
  chip.style.alignItems = "center";
  chip.style.gap = "0.35rem";
  chip.style.background = "#f3f4f6";
  chip.style.color = "#374151";
  chip.style.borderRadius = "999px";
  chip.style.padding = "0.25rem 0.6rem";
  chip.style.fontSize = "0.75rem";

  const label = document.createElement("span");
  label.style.maxWidth = "180px";
  label.style.whiteSpace = "nowrap";
  label.style.overflow = "hidden";
  label.style.textOverflow = "ellipsis";
  label.textContent = name;

  const strong = document.createElement("strong");
  strong.style.color = "#111827";
  strong.textContent = String(count);

  chip.append(label, strong);
  return chip;
}

function updateTeamsStatCard() {
  const card = document.getElementById("teamsStatCard");
  if (!card) return;

  const totalTeamsEl    = card.querySelector("#totalTeams");
  const totalPartnersEl = card.querySelector("#totalPartners");
  const breakdownEl     = card.querySelector("#teamPartnerBreakdown");
  if (!totalTeamsEl || !totalPartnersEl || !breakdownEl) return;

  const { totalTeams, totalPartners, byTeam } = computeTeamsPartnersStats();

  totalTeamsEl.textContent = String(totalTeams);
  totalPartnersEl.textContent = String(totalPartners);

  while (breakdownEl.firstChild) breakdownEl.removeChild(breakdownEl.firstChild);

  if (byTeam.length === 0) {
    const empty = document.createElement("div");
    empty.style.fontSize = "0.85rem";
    empty.style.color = "#6b7280";
    empty.textContent = "Nenhuma equipe cadastrada.";
    breakdownEl.appendChild(empty);
    return;
  }

  const frag = document.createDocumentFragment();
  for (const t of byTeam) frag.appendChild(makeTeamChip(t));
  breakdownEl.appendChild(frag);
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

          <div class="stat-icon purple"
            style="background:#f5f3ff;color:#6d28d9;border-radius:0.75rem;padding:0.6rem;display:flex;align-items:center;justify-content:center;margin-top:10%">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" xml:space="preserve" width="40" height="40"><path d="M40 28.248c0-2.34-.7-4.6-2.028-6.536a11.6 11.6 0 0 0-3.604-3.408 8.68 8.68 0 0 0 2.724-6.316c0-4.8-3.904-8.704-8.704-8.704A8.73 8.73 0 0 0 21.26 7a8.8 8.8 0 0 0-2.52 0 8.72 8.72 0 0 0-7.128-3.716c-4.8 0-8.704 3.904-8.704 8.704a8.68 8.68 0 0 0 2.724 6.316A11.68 11.68 0 0 0 0 28.248v4.84h8.388v3.624h23.22v-3.624h8.388zM28.388 5.436c3.616 0 6.556 2.94 6.556 6.556s-2.94 6.556-6.556 6.556l-.196-.004.012-.04a8 8 0 0 0 .28-.976l.016-.072.052-.272.024-.128.06-.416.024-.216.016-.224.012-.176q.008-.188.008-.38V15.6l-.008-.388-.008-.112-.024-.324-.008-.072a8.68 8.68 0 0 0-5.164-7.064 6.56 6.56 0 0 1 4.9-2.204M17.728 9.464l.064-.024a8 8 0 0 1 .46-.144 6.4 6.4 0 0 1 1.744-.236 6.4 6.4 0 0 1 1.856.272l.148.044.2.068.06.02a6.58 6.58 0 0 1 4.208 5.128l.008.056.032.244.008.088.024.32.008.288v.036l-.008.28-.004.088-.02.268-.012.104-.02.172-.02.132a8 8 0 0 1-.096.48l-.068.26-.028.104-.048.148-.04.116-.048.132q-.04.112-.088.22l-.04.096-.084.18-.008.02-.032.064-.1.192-.04.076-.004.004-.116.2-.048.08-.132.208-.088.124-.076.104-.172.224-.108.136-.072.08-.116.132-.072.076-.2.2-.12.116-.088.076-.216.184-.176.14-.048.036c-1.092.812-2.44 1.292-3.904 1.292s-2.812-.48-3.904-1.292l-.048-.036-.18-.14-.072-.06-.144-.124-.084-.076-.12-.116-.2-.2-.072-.076-.116-.132-.072-.08-.18-.224-.1-.132-.076-.104-.088-.124-.132-.208-.048-.076-.116-.204-.04-.076-.1-.192-.032-.068-.004-.012-.088-.188-.04-.092-.088-.228-.044-.124-.044-.128-.044-.14-.06-.212-.036-.148-.028-.116-.032-.144-.04-.228-.02-.124-.024-.184-.012-.092-.02-.272-.004-.08-.008-.296.008-.316.004-.084.016-.236.008-.08q.012-.128.032-.252l.008-.048a6.6 6.6 0 0 1 4.208-5.132M5.056 11.988a6.56 6.56 0 0 1 11.456-4.352 8.68 8.68 0 0 0-5.164 7.068l-.004.064-.024.336-.004.104-.012.404.012.412.012.164.016.236.024.208.06.416.024.14.052.26.02.084a8 8 0 0 0 .272.948l.02.06-.196.004a6.56 6.56 0 0 1-6.556-6.556m5.132 13.692-.068.112-.144.24-.076.136-.2.368-.116.224-.068.144-.112.24-.06.132-.12.292-.036.084-.144.38-.028.088-.1.296-.04.136-.072.252-.04.152-.06.244-.088.404-.028.152-.048.272-.02.128-.052.404v.004l-.036.368H2.148V28.24c0-3.68 2.116-6.98 5.428-8.552a8.64 8.64 0 0 0 4.036.996q.632 0 1.264-.092l.2.276.072.092.208.256.088.104.312.34.192.192.072.072-.276.172-.044.028-.272.184-.092.064-.236.172-.076.056-.296.232-.064.052-.316.272-.224.204-.06.052-.268.26-.068.068-.2.208-.08.084q-.112.12-.22.248l-.036.04q-.124.144-.24.292l-.064.084-.176.228-.068.088-.224.312-.228.344m.348 8.884V31.86q0-.18.008-.356l.008-.116.012-.236.012-.144.02-.208.02-.152.024-.196.024-.156.032-.188.032-.16.04-.184.04-.16.044-.176.044-.16.048-.172.052-.16.056-.168.056-.156.124-.32.068-.16.068-.152.072-.156.076-.152.076-.156.08-.148.084-.152.084-.148.088-.148.092-.144.092-.144.096-.14.096-.14.1-.136a4 4 0 0 1 .212-.272l.108-.132.112-.132.112-.128.116-.128.116-.124.12-.124.124-.12.124-.116.128-.116.128-.112.132-.112.132-.108.136-.108.28-.208.432-.292.3-.184.468-.256.156-.076.124-.06a8.64 8.64 0 0 0 4.036.996 8.64 8.64 0 0 0 4.036-.996l.12.06.316.16.308.172.3.184.292.192.144.1.14.104.276.212.136.108.132.112.256.228.128.12.12.12.12.124.116.124.116.128.112.128.112.132.108.132.108.136.1.136.104.14.192.28.092.144.092.144.088.144.088.148.084.148.08.152.076.152.076.152.072.156.068.156.068.16.064.156.06.164.056.156.056.168.052.16.048.172.044.16.044.176.04.16.04.18.032.16.032.188.028.156.024.196.02.152.02.208.012.144.012.236.008.116q.008.176.008.356v2.692zm21.036-3.624a12 12 0 0 0-.088-.78l-.02-.124-.048-.28-.028-.148-.052-.256-.136-.548-.076-.256-.04-.136-.1-.3-.028-.084-.144-.384-.032-.08-.18-.424-.112-.244-.068-.14-.192-.368-.124-.224-.076-.136-.144-.24-.068-.112-.228-.344-.224-.312-.068-.088-.176-.232-.064-.084-.244-.292-.032-.036a12 12 0 0 0-.5-.544l-.068-.068-.268-.264-.056-.052-.228-.204-.088-.076-.232-.192-.064-.052-.296-.232-.076-.056a12 12 0 0 0-.6-.416l-.048-.032-.276-.172.072-.072.196-.196.312-.34.084-.1.212-.26.068-.088.2-.276q.628.092 1.264.092a8.64 8.64 0 0 0 4.036-.996 9.44 9.44 0 0 1 5.428 8.552v2.692z"/></svg>

          </div>
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
  updateTeamsStatCard();
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
  // fonte robusta: DS -> window -> global const -> localStorage
  let arr = [];
  if (Array.isArray(DS?.tarefas) && DS.tarefas.length) arr = DS.tarefas;
  else if (Array.isArray(window?.tarefas) && window.tarefas.length) arr = window.tarefas;
  else {
    try { if (typeof tarefas !== "undefined" && Array.isArray(tarefas) && tarefas.length) arr = tarefas; } catch {}
    if (!arr.length) {
      try {
        const ls = JSON.parse(localStorage.getItem("tarefas") || "[]");
        if (Array.isArray(ls)) arr = ls;
      } catch {}
    }
  }

  if (!arr.length) return `<p style="color:#9ca3af;">Nenhuma tarefa encontrada.</p>`;

  // ---- helpers de normalização
  const norm = (s) =>
    String(s || "")
      .normalize("NFD").replace(/\p{Diacritic}/gu, "") // remove acento
      .toLowerCase().trim();

  const isFinalizadaOuBloqueada = (status) => {
    const n = norm(status).replace(/[^a-z]/g, ""); // remove espaços/traços
    return n === "concluida" || n === "bloqueada";
  };

  // filtra: não exibir concluídas ou bloqueadas
  const ativas = arr.filter(t => !isFinalizadaOuBloqueada(t.status));

  if (!ativas.length)
    return `<p style="color:#9ca3af;">Nenhuma tarefa ativa encontrada.</p>`;

  // ordenar por prazo mais próximo (asc)
  const ord = ativas.slice().sort((a, b) => {
    const da = new Date(a.deadline || a.createdAt || 0);
    const db = new Date(b.deadline || b.createdAt || 0);
    return da - db;
  }).slice(0, 5);

  const S = typeof sanitizeHTML === "function" ? sanitizeHTML : (s)=>String(s);
  const { projMap, teamMap } = typeof maps === "function" ? maps() : { projMap: new Map(), teamMap: new Map() };

  function getPriorityStyleFallback(p) {
    const pr = norm(p);
    if (pr === "alta")  return "background:#fee2e2;color:#b91c1c;";
    if (pr === "media") return "background:#fef3c7;color:#92400e;";
    if (pr === "baixa") return "background:#dcfce7;color:#166534;";
    return "background:#f3f4f6;color:#111827;";
    }

  return ord.map((t) => {
    const projNome =
      (t.projetos && String(t.projetos)) ||
      (t.projetoId && projMap.get(Number(t.projetoId))?.name) ||
      "—";

    const equipeNome =
      (typeof resolveTeamNameById === "function" && resolveTeamNameById(t.teamId)) ||
      (t.teamId && teamMap.get(Number(t.teamId))?.name) ||
      t.equipe || "";

    const who = S(t.assignee || t.responsavel || "—");
    const prioridade = String(t.priority || "média");

    const prioStyle = (typeof getPriorityStyle === "function")
      ? getPriorityStyle(norm(prioridade))
      : getPriorityStyleFallback(prioridade);

    const extra = equipeNome ? ` • ${S(equipeNome)}` : "";

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem;">
        <div style="flex:1;">
          <h4 style="font-weight:500;color:#000;margin-bottom:0.25rem;">${S(t.title || "Sem título")}</h4>
          <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">${S(projNome)}${extra}</p>
          <p style="font-size:0.75rem;color:#9ca3af;">Atribuído a: ${who}</p>
        </div>
        <span style="padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:500;${prioStyle}">
          ${S(prioridade)}
        </span>
      </div>
    `;
  }).join("");
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

// Dashboard -> Próximos Eventos: use a mesma função da aba Calendário
function gerarEventosFuturos() {
  // se a função oficial já estiver carregada, reusa 1:1
  if (typeof gerarProximoEvento === "function") {
    return gerarProximoEvento(); // mesma UI da aba, mesmo sort, mesmo limite, etc.
  }

  // fallback (copia fiel) caso calendario.js ainda não tenha sido avaliado
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const eventosFuturos = (Array.isArray(window.eventos) ? window.eventos : [])
    .filter((event) => {
      const [ano, mes, dia] = (event.date || "").split("-");
      const dataEvento = new Date(+ano, +mes - 1, +dia); dataEvento.setHours(0,0,0,0);
      return dataEvento >= hoje;
    })
    .sort((a, b) => {
      const [ay, am, ad] = (a.date || "").split("-");
      const [by, bm, bd] = (b.date || "").split("-");
      return new Date(+ay, +am - 1, +ad) - new Date(+by, +bm - 1, +bd);
    })
    .slice(0, 5);

  const S = typeof sanitizeHTML === "function" ? sanitizeHTML : (s)=>String(s);

  return eventosFuturos.map((event) => {
    const [ano, mes, dia] = (event.date || "").split("-");
    const dataFormatada = new Date(+ano, +mes - 1, +dia).toLocaleDateString("pt-BR");
    const desc = (event.description || "").trim();
    const preview = desc.length > 160 ? desc.slice(0, 160) + "…" : desc;

    return `
      <div style="padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.375rem;margin-bottom:0.5rem;">
        <h4 style="font-weight:500;margin-bottom:0.25rem;">${S(event.title || "")}</h4>
        <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">
          ${dataFormatada} às ${event.time || "--:--"}
        </p>
        ${preview ? `<p style="font-size:0.75rem;color:#4b5563;margin-bottom:0.25rem;white-space:pre-wrap;overflow:hidden;">${S(preview)}</p>` : ``}
        <p style="font-size:0.75rem;color:#9ca3af;">${(event.participants?.length || 0)} participantes</p>
        <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:0.5rem;">
          <button type="button" class="btn btn-outline" onclick="typeof showEventParticipantsModal==='function' && showEventParticipantsModal(${event.id})">
            Ver participantes
          </button>
        </div>
      </div>`;
  }).join("");
}


function gerarCalendario() {
  // Fonte de eventos: DS.eventos -> window.eventos -> (global) eventos -> localStorage
  function getEventosArray() {
    if (Array.isArray(DS?.eventos)) return DS.eventos;
    if (Array.isArray(window?.eventos)) return window.eventos;
    try { if (typeof eventos !== "undefined" && Array.isArray(eventos)) return eventos; } catch {}
    try {
      const ls = JSON.parse(localStorage.getItem("eventos") || "[]");
      if (Array.isArray(ls)) return ls;
    } catch {}
    return [];
  }

  const baseData = (window.dataAtualCalendario instanceof Date) ? window.dataAtualCalendario : new Date();
  const anoAtual = baseData.getFullYear();
  const mesAtual = baseData.getMonth();
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const hoje = new Date();

  const monthNames = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  const evts = getEventosArray();
  const temEventoNoDia = (diaNum) => {
    const yy = anoAtual, mm = mesAtual + 1, dd = diaNum;
    const chave = `${yy}-${String(mm).padStart(2,"0")}-${String(dd).padStart(2,"0")}`;
    return evts.some(ev => ev?.date === chave);
  };

  let cal = `
    <div style="text-align:center;margin-bottom:1rem;">
      <h3 style="font-weight:600;color:#000;">${monthNames[mesAtual]} ${anoAtual}</h3>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.25rem;text-align:center;">
      ${["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(
        d => `<div style="font-weight:500;color:#666;padding:0.5rem;font-size:0.75rem;">${d}</div>`
      ).join("")}
  `;

  for (let i = 0; i < primeiroDia; i++) cal += `<div style="padding:0.5rem;"></div>`;

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const eHoje = (dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear());
    const temEvento = temEventoNoDia(dia);

    let style = `
      padding:0.5rem;
      ${eHoje ? "background:#000;color:#fff;" : "color:#000;cursor:pointer;"} 
      border-radius:0.25rem;
      font-weight:500;
      transition:background-color .2s ease;
      position:relative;`;

    // risco VERMELHO quando tem evento
    if (temEvento) style += `border-bottom:3px solid #ef4444;`;

    const hover = !eHoje ? `onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='transparent'"` : "";

    cal += `
      <div style="${style}" ${hover}
           onclick="typeof diaSelecionado==='function' && diaSelecionado(${dia}, ${mesAtual}, ${anoAtual})">
        ${dia}
      </div>`;
  }

  cal += `</div>`;
  return cal;
}


// // eventos customizados disparados pelas outras abas (projetos/backlogs/equipes/calendário)
// ["projetos", "tarefas", "equipes", "eventos"].forEach((k) => {
//   document.addEventListener(`data:${k}:changed`, _refreshDashboard);
// });

// sincroniza quando localStorage muda (outra aba/janela)
window.addEventListener("storage", (e) => {
  if (!e.key) return;
  if (["projetos", "tarefas", "equipes", "eventos"].includes(e.key)) {
    // Se você quer re-renderizar TUDO:
    // carregarConteudoDashboard();

    // Se quer só atualizar o que mudou:
    if (e.key === "equipes") updateTeamsStatCard();
    if (e.key === "tarefas") atualizarCardTarefasConcluidas();
    // adicione outros updates pontuais se necessário
  }
});


window.addEventListener("storage", (e) => {
  if (e.key === "equipes") updateTeamsStatCard();
});