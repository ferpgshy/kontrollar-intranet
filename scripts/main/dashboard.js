function carregarConteudoDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const conteudoPagina = document.getElementById("conteudoPagina");

  const totalProjetos = projetos.length;

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const projetosEsteMes = projetos.filter(
    (p) => new Date(p.createdAt) >= inicioMes
  ).length;

  const prazoProximos7Dias = projetos.filter((p) => {
    const prazo = new Date(p.deadline);
    return (
      prazo >= hoje &&
      prazo <= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7)
    );
  }).length;

  conteudoPagina.innerHTML = `
    <div class="welcome-section">
        <h1 class="welcome-title">Bem-vindo de volta, ${user.name}! 👋</h1>
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
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v5h5M3 21l6-6M21 3a9 9 0 11-9 9"/>
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

      <!-- Stat: Equipes & Parceiros -->
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

        <!-- Breakdown por equipe -->
        <div id="teamPartnerBreakdown" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.75rem">
          <!-- chips injetados via JS -->
        </div>
      </div>


      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-info">
            <h3>Prazo Próximo</h3>
            <div class="stat-value">${prazoProximos7Dias}</div>
            <div class="stat-change">próximos 7 dias</div>
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
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v5h5M3 21l6-6M21 3a9 9 0 11-9 9"/>
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

  // 🔁 Atualiza os dados do card de tarefas com dados reais
  atualizarCardTarefasConcluidas();
  requestAnimationFrame(updateTeamsStatCard);
}

// Util: usa seu sanitizeHTML se existir (mantém igual)
const _sanitize = typeof sanitizeHTML === "function"
  ? sanitizeHTML
  : (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

/**
 * Retorna estatísticas de equipes/parceiros.
 * Tenta ler de window.equipes; se não tiver, usa o 'equipes' global (let/const).
 */
function getTeamsPartnersStats(equipesArr) {
  // resolve fonte de dados
  if (!Array.isArray(equipesArr)) {
    const fromWindow = Array.isArray(window.equipes) ? window.equipes : null;
    const fromGlobal = (typeof equipes !== "undefined" && Array.isArray(equipes)) ? equipes : null;
    equipesArr = fromWindow || fromGlobal || [];
  }

  let totalTeams = 0;
  let totalPartners = 0;
  const byTeam = [];

  for (const eq of equipesArr) {
    const count = Array.isArray(eq?.members) ? eq.members.filter(Boolean).length : 0;
    byTeam.push({ id: eq?.id, name: eq?.name ?? "Sem nome", count });
    totalTeams += 1;
    totalPartners += count;
  }

  byTeam.sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name, "pt-BR"));
  return { totalTeams, totalPartners, byTeam };
}

/**
 * Atualiza o card "Equipes & Parceiros"
 */
function updateTeamsStatCard() {
  const totalsEl = document.getElementById("totalTeams");
  const partnersEl = document.getElementById("totalPartners");
  const listEl = document.getElementById("teamPartnerBreakdown");
  if (!totalsEl || !partnersEl || !listEl) return;

  const { totalTeams, totalPartners, byTeam } = getTeamsPartnersStats();

  totalsEl.textContent = totalTeams;
  partnersEl.textContent = totalPartners;

  if (!byTeam.length) {
    listEl.innerHTML = `<div style="font-size:0.85rem;color:#6b7280;">Nenhuma equipe cadastrada.</div>`;
    return;
  }

  listEl.innerHTML = byTeam.map(t => `
    <span title="${_sanitize(t.name)}"
          style="display:inline-flex;align-items:center;gap:0.35rem;background:#f3f4f6;color:#374151;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.75rem;">
      <span style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_sanitize(t.name)}</span>
      <strong style="color:#111827;">${t.count}</strong>
    </span>
  `).join("");
}


function gerarProjetosRecentes() {
  const recentes = projetos
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3); // pega os 3 mais recentes

  return recentes
    .map(
      (projeto) => `
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-weight: 600; color: #000000;">${
                  projeto.name
                }</h3>
                <span style="padding: 0.25rem 0.5rem; background-color: #f3f4f6; color: #374151; border-radius: 0.25rem; font-size: 0.75rem;">
                    ${projeto.status}
                </span>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.875rem; color: #666666;">
                <span>${projeto.equipe.length} membros</span>
                <span>${formatarDataPtBR(projeto.deadline)}</span>
            </div>
            <div style="margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                    <span>Progresso</span>
                    <span>${projeto.progress}%</span>
                </div>
                <div style="width: 100%; background-color: #e5e7eb; border-radius: 0.25rem; height: 0.5rem;">
                    <div style="background-color: #000000; height: 100%; border-radius: 0.25rem; width: ${
                      projeto.progress
                    }%;"></div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function gerarTarefasRecentes() {
  // Se o array global tarefas não existir ou estiver vazio, retorna mensagem
  if (!tarefas || tarefas.length === 0) {
    return `<p style="color: #9ca3af;">Nenhuma tarefa encontrada.</p>`;
  }

  // Ordena por deadline mais próxima (ou pelo ID como fallback)
  const tarefasOrdenadas = [...tarefas]
    .sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA - dateB;
    })
    .slice(0, 5); // Mostra as 5 mais recentes

  return tarefasOrdenadas
    .map(
      (task) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h4 style="font-weight: 500; color: #000000; margin-bottom: 0.25rem;">${
            task.title
          }</h4>
          <p style="font-size: 0.875rem; color: #666666; margin-bottom: 0.25rem;">${
            task.projetos
          }</p>
          <p style="font-size: 0.75rem; color: #9ca3af;">Atribuído a: ${
            task.assignee
          }</p>
        </div>
        <span style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; ${getPriorityStyle(
          task.priority
        )}">${task.priority}</span>
      </div>
    `
    )
    .join("");
}

function atualizarCardTarefasConcluidas() {
  const concluidas = tarefas.filter((t) => t.status === "concluida");

  const concluidasSemana = concluidas.filter((t) => {
    const data = new Date(t.updatedAt || t.createdAt || t.deadline);
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);
    return data >= seteDiasAtras && data <= hoje;
  });

  const card = document.querySelector("#card-tarefas-concluidas");
  if (!card) return;

  card.querySelector(".stat-value").textContent = concluidas.length;
  card.querySelector(
    ".stat-change"
  ).textContent = `+${concluidasSemana.length} esta semana`;
}

function gerarEventosFuturos() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximosEventos = eventos
    .map((evento) => {
      const [ano, mes, dia] = evento.date.split("-").map(Number);
      const data = new Date(ano, mes - 1, dia);
      data.setHours(0, 0, 0, 0);

      const diff = Math.floor((data - hoje) / (1000 * 60 * 60 * 24));
      let dataLabel = "";

      if (diff === 0) dataLabel = "Hoje";
      else if (diff === 1) dataLabel = "Amanhã";
      else
        dataLabel = data.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        });

      return {
        ...evento,
        dataLabel,
        dataObj: data,
      };
    })
    .filter((e) => e.dataObj >= hoje)
    .sort((a, b) => a.dataObj - b.dataObj)
    .slice(0, 5); // Máximo de 5 eventos

  if (proximosEventos.length === 0) {
    return `<p style="color: #666;">Nenhum evento futuro agendado.</p>`;
  }

  return proximosEventos
    .map(
      (event) => `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem;">
            <div style="width: 0.5rem; height: 0.5rem; background-color: #3b82f6; border-radius: 50%;"></div>
            <div style="flex: 1;">
                <h4 style="font-weight: 500; color: #000000; margin-bottom: 0.25rem;">${sanitizeHTML(event.title)}</h4>
                <p style="font-size: 0.875rem; color: #666666;">${event.dataLabel} às ${event.time}</p>
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

  let calendario = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <h3 style="font-weight: 600; color: #000000;">${monthNames[mesAtual]} ${anoAtual}</h3>
    </div>
    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; text-align: center;">
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Dom</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Seg</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Ter</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Qua</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Qui</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Sex</div>
      <div style="font-weight: 500; color: #666666; padding: 0.5rem; font-size: 0.75rem;">Sáb</div>
  `;

  // Preenche os dias vazios antes do primeiro dia do mês
  for (let i = 0; i < primeiroDia; i++) {
    calendario += '<div style="padding: 0.5rem;"></div>';
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const eHoje = dia === hoje.getDate();
    const temEvento = eventos.some((event) => {
      const [ano, mes, d] = event.date.split("-").map(Number);
      return d === dia && mes === mesAtual + 1 && ano === anoAtual;
    });

    let style = `
      padding: 0.5rem; 
      ${
        eHoje
          ? "background-color: #000000; color: #ffffff;"
          : "color: #000000; cursor: pointer;"
      } 
      border-radius: 0.25rem; 
      font-weight: 500;
      transition: background-color 0.2s ease;
      position: relative;
    `;

    if (temEvento) {
      style += `
        border-bottom: 3px solid #2563eb; /* azul */
      `;
    }

    calendario += `
      <div style="${style}" 
        onclick="diaSelecionado(${dia}, ${mesAtual}, ${anoAtual})"
        ${
          !eHoje
            ? "onmouseover=\"this.style.backgroundColor='#f3f4f6'\" onmouseout=\"this.style.backgroundColor='transparent'\""
            : ""
        }
      >
        ${dia}
      </div>
    `;
  }

  calendario += "</div>";
  return calendario;
}