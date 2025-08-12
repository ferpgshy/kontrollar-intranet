let dataAtualCalendario = new Date();

function getDataBrasiliaFormatada() {
  // Horário atual em UTC
  const agoraUTC = new Date();

  // Offset de Brasília (UTC-3). Calcula milissegundos de diferença
  const offsetBrasilia = -3 * 60; // minutos

  // Aplica o offset
  const horaBrasilia = new Date(
    agoraUTC.getTime() + offsetBrasilia * 60 * 1000
  );

  // Gera data no formato yyyy-mm-dd (usado no input date)
  const ano = horaBrasilia.getFullYear();
  const mes = String(horaBrasilia.getMonth() + 1).padStart(2, "0");
  const dia = String(horaBrasilia.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarDataPtBR(dataIso) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

  function configurarEventos() {
    // Barra Lateral toggle
    const controleSidebar = document.getElementById("controleSidebar");
    const celularcontroleSidebar = document.getElementById(
      "celularcontroleSidebar"
    );
    const sidebar = document.getElementById("sidebar");

    if (controleSidebar) {
      controleSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
      });
    }

    if (celularcontroleSidebar) {
      celularcontroleSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("celular-open");
      });
    }

    // Navegação entre páginas
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const page = this.getAttribute("data-page");
        if (page) {
          definirPaginaAtiva(page);
          carregarConteudoPagina(page);
        }
      });
    });

    // Header "Novo" botão
    configurarBotaoNovoCabecalho();

    // Notificações
    configurarNotificacao();

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        const confirmado = await confirmarModal({
          title: "Confirmação",
          message: "Tem certeza que deseja sair?",
        });

        if (confirmado) {
          localStorage.removeItem("user");
          window.location.href = "login.html";
        }
      });
    }

    // Fechar notificações ao clicar fora
    document.addEventListener("click", (e) => {
      const painelNotificacao = document.getElementById("painelNotificacao");
      const botaoNotificacao = document.getElementById("botaoNotificacao");
      if (painelNotificacao && botaoNotificacao) {
        if (
          !botaoNotificacao.contains(e.target) &&
          !painelNotificacao.contains(e.target)
        ) {
          painelNotificacao.style.display = "none";
        }
      }
    });
  }

function configurarBotaoNovoCabecalho() {
  // Criar o botão "Novo" no cabeçalho
  const cabecalhoDireita = document.querySelector(".header-right");
  if (cabecalhoDireita) {
    const botaoNovo = cabecalhoDireita.querySelector(".btn-primary");
    if (botaoNovo) {
      botaoNovo.addEventListener("click", (e) => {
        e.stopPropagation();
        exibirDropdownNovoItem(e.target);
      });
    }
  }
}

function exibirDropdownNovoItem(botao) {
  // Remover dropdown existente, se houver
  const dropdownExistente = document.getElementById("newItemDropdown");
  if (dropdownExistente) {
    dropdownExistente.remove();
  }

  // Cria dropdown
  const dropdown = document.createElement("div");
  dropdown.id = "newItemDropdown";
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    min-width: 200px;
    margin-top: 0.5rem;
  `;

  dropdown.innerHTML = `
    <div style="padding: 0.5rem;">
      <button class="dropdown-item" data-action="new-task">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        Nova Tarefa
      </button>
      <button class="dropdown-item" data-action="new-projetos">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
        </svg>
        Novo Projeto
      </button>
      <button class="dropdown-item" data-action="new-equipe">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
        Nova Equipe
      </button>
      <button class="dropdown-item" data-action="new-notice">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        Novo Aviso
      </button>
    </div>
    `;

  // CSS dos itens do dropdown
  const style = document.createElement("style");
  style.textContent = `
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 0.75rem;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
      font-size: 0.875rem;
    }
    .dropdown-item:hover {
      background-color: #f3f4f6;
    }
    .dropdown-item .icon {
      width: 1rem;
      height: 1rem;
    }
  `;
  document.head.appendChild(style);

  // Posicionamento do dropdown
  const retanguloBotao = botao.getBoundingClientRect();
  const cabecalhoDireita = botao.closest(".header-right");
  cabecalhoDireita.style.position = "relative";
  cabecalhoDireita.appendChild(dropdown);

  // Clique nos itens do dropdown
  dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const acao = e.currentTarget.getAttribute("data-action");
      lidarComAcaoNovoItem(acao);
      dropdown.remove();
    });
  });

  // Fechar ao clicar fora
  setTimeout(() => {
    document.addEventListener("click", function fecharDropdown(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener("click", fecharDropdown);
      }
    });
  }, 0);
}

function lidarComAcaoNovoItem(acao) {
  switch (acao) {
    case "new-task":
      definirPaginaAtiva("backlog");
      carregarConteudoPagina("backlog");
      break;
    case "new-projetos":
      definirPaginaAtiva("projetos");
      carregarConteudoPagina("projetos");
      break;
    case "new-equipe":
      definirPaginaAtiva("equipes");
      carregarConteudoPagina("equipes");
      break;
    case "new-notice":
      definirPaginaAtiva("avisos");
      carregarConteudoPagina("avisos");
      break;
  }
}

function configurarNotificacao() {
  const botaoNotificacao = document.getElementById("botaoNotificacao");
  const painelNotificacao = document.getElementById("painelNotificacao");
  const fecharNotificacao = document.getElementById("fecharNotificacao");

  if (botaoNotificacao) {
    botaoNotificacao.addEventListener("click", () => {
      painelNotificacao.style.display =
        painelNotificacao.style.display === "none" ? "block" : "none";
    });
  }

  if (fecharNotificacao) {
    fecharNotificacao.addEventListener("click", () => {
      painelNotificacao.style.display = "none";
    });
  }

  // Make notifications clickable
  const itensNotificacao =
    painelNotificacao.querySelectorAll(".notification-item");
  itensNotificacao.forEach((item, index) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      lidarComCliqueNotificacao(index);
      painelNotificacao.style.display = "none";
    });
  });
}

function lidarComCliqueNotificacao(index) {
  switch (index) {
    case 0: // Nova tarefa atribuída
      definirPaginaAtiva("backlog");
      carregarConteudoPagina("backlog");
      break;
    case 1: // Reunião em 30 minutos
      definirPaginaAtiva("calendarioio");
      carregarConteudoPagina("calendarioio");
      break;
    case 2: // Projeto atualizado
      definirPaginaAtiva("projetos");
      carregarConteudoPagina("projetos");
      break;
  }
}

function definirPaginaAtiva(page) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }
  });
}

function carregarConteudoPagina(page) {
  const conteudoPagina = document.getElementById("conteudoPagina");

  switch (page) {
    case "dashboard":
      carregarConteudoDashboard();
      break;
    case "projetos":
      carregarConteudoProjetos();
      break;
    case "backlog":
      carregarConteudoBacklog();
      break;
    case "calendarioio":
      carregarConteudoCalendario();
      break;
    case "chat":
      carregarConteudoChat();
      break;
    case "equipes":
      loadEquipesContent();
      break;
    case "avisos":
      loadAvisosContent();
      break;
    case "perfil":
      loadPerfilContent();
      break;
    case "configuracoes":
      loadConfiguracoesContent();
      break;
    default:
      carregarConteudoDashboard();
  }
}

// DASHBOARD ////////////////////////////////////////////////////////////
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

// PROJETOS ////////////////////////////////////////////////////////////
function carregarConteudoProjetos() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  conteudoPagina.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Projetos</h1>
                <p style="color: #666666;">Gerencie todos os seus projetos em um só lugar</p>
            </div>
            <button id="newProjectBtn" class="btn btn-primary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Novo Projeto
            </button>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <div style="position: relative; flex: 1;">
                    <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input id="projectSearch" type="text" placeholder="Buscar projetos..." style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                </div>
                <select id="projectStatusFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                    <option value="todos">Todos os Status</option>
                    <option value="planejamento">Planejamento</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="em-desenvolvimento">Em Desenvolvimento</option>
                    <option value="quase-concluido">Quase Concluído</option>
                    <option value="concluido">Concluído</option>
                </select>
            </div>
        </div>
        
        <div id="projetosGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
            ${gerarCardsProjetos()}
        </div>
    `;

  // Setup projetos functionality
  setupProjetosPage();
}

function setupProjetosPage() {
  // New projetos button
  const newProjectBtn = document.getElementById("newProjectBtn");
  if (newProjectBtn) {
    newProjectBtn.addEventListener("click", mostrarModalProjetoNovo);
  }

  // Search functionality
  const projectSearch = document.getElementById("projectSearch");
  if (projectSearch) {
    projectSearch.addEventListener("input", filterProjetos);
  }

  // Status filter
  const projectStatusFilter = document.getElementById("projectStatusFilter");
  if (projectStatusFilter) {
    projectStatusFilter.addEventListener("change", filterProjetos);
  }

  // projetos card actions
  configAcoesCardProjetos();
}

function filterProjetos() {
  const searchTerm =
    document.getElementById("projectSearch")?.value.toLowerCase() || "";
  const statusFilter =
    document.getElementById("projectStatusFilter")?.value || "todos";

  const filteredProjetos = projetos.filter((projetos) => {
    const matchesSearch =
      projetos.name.toLowerCase().includes(searchTerm) ||
      projetos.description.toLowerCase().includes(searchTerm);
    const matchesStatus =
      statusFilter === "todos" || projetos.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projetosGrid = document.getElementById("projetosGrid");
  if (projetosGrid) {
    projetosGrid.innerHTML = gerarArrayProjetosCards(filteredProjetos);
    configAcoesCardProjetos();
  }
}

function configAcoesCardProjetos() {
  // Botao de editar projetos
  document.querySelectorAll(".edit-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      editarProjetos(projectId);
    });
  });

  // View details buttons
  document.querySelectorAll(".view-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      viewProjectDetails(projectId);
    });
  });

  // Delete projetos buttons
  document.querySelectorAll(".delete-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      deletarProjeto(projectId);
    });
  });
}

function mostrarModalProjetoNovo() {
  const modal = createModal(
    "Criar Novo Projeto",
    `
    <form id="newProjectForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome do Projeto</label>
        <input type="text" id="projectName" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="projectDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="projectStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="planejamento">Planejamento</option>
            <option value="em-andamento">Em Andamento</option>
            <option value="em-desenvolvimento">Em Desenvolvimento</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="projectPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa">Baixa</option>
            <option value="media" selected>Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="projectDeadline" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Projeto</button>
      </div>
    </form>
  `
  );

  // Espera o próximo ciclo de renderização para garantir que o elemento está no DOM
  setTimeout(() => {
    const form = document.getElementById("newProjectForm");
    if (!form) {
      console.error("Formulário não encontrado no DOM.");
      return;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const novoProjeto = {
        id: Date.now(),
        name: document.getElementById("projectName").value,
        description: document.getElementById("projectDescription").value,
        status: document.getElementById("projectStatus").value,
        priority: document.getElementById("projectPriority").value,
        deadline: document.getElementById("projectDeadline").value,
        progress: 0,
        equipe: [],
        createdAt: getDataBrasiliaFormatada(),
      };

      projetos.push(novoProjeto);
      fecharModal();
      filterProjetos();
    });
  }, 0);
}

function editarProjetos(projectId) {
  const projeto = projetos.find((p) => p.id === projectId);
  if (!projeto) return;

  const modal = createModal(
    "Editar Projeto",
    `
    <form id="editProjectForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome do Projeto</label>
        <input type="text" id="editProjectName" value="${
          projeto.name
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="editProjectDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;">${
          projeto.description
        }</textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="editProjectStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="planejamento" ${
              projeto.status === "planejamento" ? "selected" : ""
            }>Planejamento</option>
            <option value="em-andamento" ${
              projeto.status === "em-andamento" ? "selected" : ""
            }>Em Andamento</option>
            <option value="em-desenvolvimento" ${
              projeto.status === "em-desenvolvimento" ? "selected" : ""
            }>Em Desenvolvimento</option>
            <option value="quase-concluido" ${
              projeto.status === "quase-concluido" ? "selected" : ""
            }>Quase Concluído</option>
            <option value="concluido" ${
              projeto.status === "concluido" ? "selected" : ""
            }>Concluído</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="editProjectPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa" ${
              projeto.priority === "baixa" ? "selected" : ""
            }>Baixa</option>
            <option value="media" ${
              projeto.priority === "media" ? "selected" : ""
            }>Média</option>
            <option value="alta" ${
              projeto.priority === "alta" ? "selected" : ""
            }>Alta</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Progresso (%)</label>
        <input type="number" id="editProjectProgress" value="${
          projeto.progress
        }" min="0" max="100" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="editProjectDeadline" value="${
          projeto.deadline
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  `
  );

  document.getElementById("editProjectForm").addEventListener("submit", (e) => {
    e.preventDefault();

    projeto.name = document.getElementById("editProjectName").value;
    projeto.description = document.getElementById(
      "editProjectDescription"
    ).value;
    projeto.status = document.getElementById("editProjectStatus").value;
    projeto.priority = document.getElementById("editProjectPriority").value;
    projeto.progress = Number.parseInt(
      document.getElementById("editProjectProgress").value
    );
    projeto.deadline = document.getElementById("editProjectDeadline").value;

    fecharModal();
    filterProjetos(); // Refresh the projetos display
  });
}

function viewProjectDetails(projectId) {
  const projeto = projetos.find((p) => p.id === projectId);
  if (!projeto) return;

  const projectTasks = tarefas.filter((t) => t.projetos === projeto.name);

  const modal = createModal(
    `Detalhes do Projeto: ${projeto.name}`,
    `
    <div style="max-height: 400px; overflow-y: auto;">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Informações Gerais</h3>
        <p style="margin-bottom: 0.5rem;"><strong>Descrição:</strong> ${
          projeto.description
        }</p>
        <p style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${getStatusLabel(
          projeto.status
        )}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Prioridade:</strong> ${
          projeto.priority.charAt(0).toUpperCase() + projeto.priority.slice(1)
        }</p>
        <p style="margin-bottom: 0.5rem;"><strong>Progresso:</strong> ${
          projeto.progress
        }%</p>
        <p style="margin-bottom: 0.5rem;"><strong>Prazo:</strong> ${formatarDataPtBR(
          projeto.deadline
        )}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Equipe:</strong> ${
          projeto.equipe.length
        } membros</p>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Progresso</h3>
        <div style="width: 100%; background-color: #e5e7eb; border-radius: 0.25rem; height: 0.75rem;">
          <div style="background-color: #000000; height: 100%; border-radius: 0.25rem; width: ${
            projeto.progress
          }%;"></div>
        </div>
      </div>

      <div>
        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Tarefas Relacionadas (${
          projectTasks.length
        })</h3>
        ${
          projectTasks.length > 0
            ? projectTasks
                .map(
                  (task) => `
          <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-weight: 500; margin-bottom: 0.25rem;">${
                task.title
              }</h4>
              <span style="padding: 0.25rem 0.5rem; background-color: ${getTaskStatusBgColor(
                task.status
              )}; color: ${getTaskStatusTextColor(
                    task.status
                  )}; border-radius: 0.25rem; font-size: 0.75rem;">
                ${getTaskStatusLabel(task.status)}
              </span>
            </div>
            <p style="font-size: 0.875rem; color: #666666; margin-bottom: 0.25rem;">${
              task.description
            }</p>
            <p style="font-size: 0.75rem; color: #9ca3af;">Responsável: ${
              task.assignee
            }</p>
          </div>
        `
                )
                .join("")
            : '<p style="color: #666666; text-align: center; padding: 1rem;">Nenhuma tarefa encontrada</p>'
        }
      </div>
    </div>
    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
      <button type="button" onclick="editarProjetos(${
        projeto.id
      })" class="btn btn-outline">Editar</button>
      <button type="button" onclick="fecharModal()" class="btn btn-primary">Fechar</button>
    </div>
  `
  );
}

function deletarProjeto(projectId) {
  projetos = projetos.filter((p) => p.id !== projectId);
  filterProjetos();
  showToast("Projeto excluído com sucesso!");
}

function gerarArrayProjetosCards(projetosArray) {
  return projetosArray
    .map(
      (projetos) => `
    <div data-projetos-id="${
      projetos.id
    }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid ${getPriorityBorderColor(
        projetos.priority
      )}; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.boxShadow='0 1px 3px 0 rgba(0, 0, 0, 0.1)'">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: #000000; margin-bottom: 0.5rem;">${
            projetos.name
          }</h3>
          <span style="padding: 0.25rem 0.5rem; background-color: ${getStatusBgColor(
            getStatusLabel(projetos.status)
          )}; color: ${getStatusTextColor(
        getStatusLabel(projetos.status)
      )}; border-radius: 0.25rem; font-size: 0.75rem;">${getStatusLabel(
        projetos.status
      )}</span>
        </div>
        <div class="projetos-menu" style="position: relative;">
          <button onclick="abrirMenuProjeto(${
            projetos.id
          })" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: #666666;">
            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>
      
      <p style="color: #666666; font-size: 0.875rem; margin-bottom: 1rem;">${
        projetos.description
      }</p>
      
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
          <span>Progresso</span>
          <span>${projetos.progress}%</span>
        </div>
        <div style="width: 100%; background-color: #e5e7eb; border-radius: 0.25rem; height: 0.5rem;">
          <div style="background-color: #000000; height: 100%; border-radius: 0.25rem; width: ${
            projetos.progress
          }%;"></div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: #666666; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>${projetos.equipe.length} membros</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${formatarDataPtBR(projetos.deadline)}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 0.5rem;">
        <button class="edit-projetos-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">
          <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </button>
        <button class="view-projetos-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">Ver Detalhes</button>
      </div>
    </div>
  `
    )
    .join("");
}

function getStatusLabel(status) {
  const labels = {
    planejamento: "Planejamento",
    "em-andamento": "Em Andamento",
    "em-desenvolvimento": "Em Desenvolvimento",
    "quase-concluido": "Quase Concluído",
    concluido: "Concluído",
    pausado: "Pausado",
  };
  return labels[status] || status;
}
// FIM PROJETOS ///////////////////////////////////////////////////////////////////////////////////////////////

// BACKLOG ///////////////////////////////////////////////////////////////////////////////////////////////
function carregarConteudoBacklog() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  conteudoPagina.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Backlog</h1>
                <p style="color: #666666;">Gerencie todas as tarefas dos seus projetos</p>
            </div>
            <button id="newTaskBtn" class="btn btn-primary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Nova Tarefa
            </button>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
            <div style="position: relative; flex: 1;">
                <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input id="taskSearch" type="text" placeholder="Buscar tarefas..." style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            </div>
            <select id="taskStatusFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                <option value="todas">Todos os Status</option>
                <option value="todo">A Fazer</option>
                <option value="em-progresso">Em Progresso</option>
                <option value="em-revisao">Em Revisão</option>
                <option value="concluida">Concluída</option>
                <option value="bloqueada">Bloqueada</option>
            </select>
            <select id="taskPriorityFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                <option value="todas">Todas as Prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
            </select>
        </div>
        
        <div id="tarefasContainer" style="display: flex; flex-direction: column; gap: 1rem;">
            ${gerarCardsTarefas()}
        </div>
    `;

  // Setup backlog functionality
  configPaginaBacklog();
}

function configPaginaBacklog() {
  // New task button
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", showNewTaskModal);
  }

  // Search functionality
  const taskSearch = document.getElementById("taskSearch");
  if (taskSearch) {
    taskSearch.addEventListener("input", filterTasks);
  }

  // Status filter
  const taskStatusFilter = document.getElementById("taskStatusFilter");
  if (taskStatusFilter) {
    taskStatusFilter.addEventListener("change", filterTasks);
  }

  // Priority filter
  const taskPriorityFilter = document.getElementById("taskPriorityFilter");
  if (taskPriorityFilter) {
    taskPriorityFilter.addEventListener("change", filterTasks);
  }

  // Task status change functionality
  setupTaskStatusChanges();
}

function filterTasks() {
  const searchTerm =
    document.getElementById("taskSearch")?.value.toLowerCase() || "";
  const statusFilter =
    document.getElementById("taskStatusFilter")?.value || "todas";
  const priorityFilter =
    document.getElementById("taskPriorityFilter")?.value || "todas";

  const filteredTasks = tarefas.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.projetos.toLowerCase().includes(searchTerm);
    const matchesStatus =
      statusFilter === "todas" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "todas" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tarefasContainer = document.getElementById("tarefasContainer");
  if (tarefasContainer) {
    tarefasContainer.innerHTML = gerarArrayCardsTarefas(filteredTasks);
    setupTaskStatusChanges();
  }
}

function setupTaskStatusChanges() {
  document.querySelectorAll(".task-status-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const taskId = Number.parseInt(e.target.getAttribute("data-task-id"));
      const newStatus = e.target.value;
      updateTaskStatus(taskId, newStatus);
    });
  });

  // Edit task buttons
  document.querySelectorAll(".edit-task-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = Number.parseInt(
        e.target.closest("[data-task-id]").getAttribute("data-task-id")
      );
      editTask(taskId);
    });
  });

  // Delete task buttons
  document.querySelectorAll(".delete-task-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const taskId = Number.parseInt(
        e.target.closest("[data-task-id]").getAttribute("data-task-id")
      );
      deleteTask(taskId);
    });
  });
}

function updateTaskStatus(taskId, newStatus) {
  const task = tarefas.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
    if (newStatus === "concluida") {
      updateProjectProgress(task.projetos);
    }
  }
  filterTasks();
}

function updateProjectProgress(projectName) {
  const projeto = projetos.find((p) => p.name === projectName);
  if (projeto) {
    const projectTasks = tarefas.filter((t) => t.projetos === projectName);
    const completedTasks = projectTasks.filter((t) => t.status === "concluida");
    const progress =
      projectTasks.length > 0
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0;
    projeto.progress = progress;
  }
}

function showNewTaskModal() {
  const projectOptions = projetos
    .map((p) => `<option value="${p.name}">${p.name}</option>`)
    .join("");

  const modal = createModal(
    "Criar Nova Tarefa",
    `
    <form id="newTaskForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título da Tarefa</label>
        <input type="text" id="taskTitle" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="taskDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;"></textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="taskPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa">Baixa</option>
            <option value="media" selected>Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="taskStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="todo" selected>A Fazer</option>
            <option value="em-progresso">Em Progresso</option>
            <option value="em-revisao">Em Revisão</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Projeto</label>
        <select id="taskProject" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="">Selecione um projeto</option>
          ${projectOptions}
        </select>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Responsável</label>
        <input type="text" id="taskAssignee" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;" placeholder="Nome do responsável">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="taskDeadline" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Tarefa</button>
      </div>
    </form>
  `
  );

  document.getElementById("newTaskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDescription").value,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      projetos: document.getElementById("taskProject").value,
      assignee: document.getElementById("taskAssignee").value,
      deadline:
        document.getElementById("taskDeadline").value ||
        getDataBrasiliaFormatada(),
      createdAt: getDataBrasiliaFormatada(),
    };

    tarefas.push(newTask);
    fecharModal();
    filterTasks(); // Refresh the tarefas display
  });
}

function editTask(taskId) {
  const task = tarefas.find((t) => t.id === taskId);
  if (!task) return;

  const projectOptions = projetos
    .map(
      (p) =>
        `<option value="${p.name}" ${
          p.name === task.projetos ? "selected" : ""
        }>${p.name}</option>`
    )
    .join("");

  const modal = createModal(
    "Editar Tarefa",
    `
    <form id="editTaskForm">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Título da Tarefa</label>
        <input type="text" id="editTaskTitle" value="${
          task.title
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descrição</label>
        <textarea id="editTaskDescription" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; min-height: 80px; resize: vertical;">${
          task.description
        }</textarea>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prioridade</label>
          <select id="editTaskPriority" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="baixa" ${
              task.priority === "baixa" ? "selected" : ""
            }>Baixa</option>
            <option value="media" ${
              task.priority === "media" ? "selected" : ""
            }>Média</option>
            <option value="alta" ${
              task.priority === "alta" ? "selected" : ""
            }>Alta</option>
          </select>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Status</label>
          <select id="editTaskStatus" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
            <option value="todo" ${
              task.status === "todo" ? "selected" : ""
            }>A Fazer</option>
            <option value="em-progresso" ${
              task.status === "em-progresso" ? "selected" : ""
            }>Em Progresso</option>
            <option value="em-revisao" ${
              task.status === "em-revisao" ? "selected" : ""
            }>Em Revisão</option>
            <option value="concluida" ${
              task.status === "concluida" ? "selected" : ""
            }>Concluída</option>
            <option value="bloqueada" ${
              task.status === "bloqueada" ? "selected" : ""
            }>Bloqueada</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Projeto</label>
        <select id="editTaskProject" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          ${projectOptions}
        </select>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Responsável</label>
        <input type="text" id="editTaskAssignee" value="${
          task.assignee
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Prazo</label>
        <input type="date" id="editTaskDeadline" value="${
          task.deadline
        }" required style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  `
  );

  document.getElementById("editTaskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    task.title = document.getElementById("editTaskTitle").value;
    task.description = document.getElementById("editTaskDescription").value;
    task.priority = document.getElementById("editTaskPriority").value;
    task.status = document.getElementById("editTaskStatus").value;
    task.projetos = document.getElementById("editTaskProject").value;
    task.assignee = document.getElementById("editTaskAssignee").value;
    task.deadline =
      document.getElementById("editTaskDeadline").value ||
      getDataBrasiliaFormatada();
    fecharModal();
    filterTasks(); // Atualiza a lista de tarefas
  });
}

function deleteTask(taskId) {
  tarefas = tarefas.filter((t) => t.id !== taskId);
  filterTasks(); // Atualiza a exibição
  showToast("Tarefa excluída com sucesso!", "success");
}

window.abrirMenuTarefas = (taskId) => {
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!card) return;

  let menu = card.querySelector(".tarefas-menu-dropdown");

  // Fecha outros menus abertos (com limpeza de listeners)
  document.querySelectorAll(".tarefas-menu-dropdown").forEach((el) => {
    if (el !== menu) {
      if (typeof el._close === "function") el._close();
      else el.remove();
    }
  });

  // Se já existe esse menu aberto, fecha e sai
  if (menu) {
    if (typeof menu._close === "function") menu._close();
    else menu.remove();
    return;
  }

  // Contêiner onde o menu vai ficar
  const menuContainer = card.querySelector(".task-menu") || card;
  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  // Cria o menu
  menu = document.createElement("div");
  menu.className = "tarefas-menu-dropdown";
  menu.style.position = "absolute";
  menu.style.top = "30px";
  menu.style.right = "0";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #e5e7eb";
  menu.style.borderRadius = "0.375rem";
  menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  menu.style.zIndex = "999";

  // Helpers de fechar
  const onClickOutside = (ev) => {
    if (!menu) return;
    if (!menu.contains(ev.target)) closeMenu();
  };
  const onEsc = (ev) => {
    if (ev.key === "Escape") closeMenu();
  };
  function closeMenu() {
    if (!menu) return;
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    menu = null;
  }
  menu._close = closeMenu;

  // Evita propagar clique dentro do menu
  menu.addEventListener("click", (e) => e.stopPropagation());

  // Ação: Apagar
  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">
      🗑 <span>Apagar</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    closeMenu(); // fecha antes de abrir o modal
    const confirmar = await confirmarModal({
      title: "Excluir tarefa?",
      message: "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      if (typeof deleteTask === "function") deleteTask(taskId);
      else console.warn("deleteTask(taskId) não encontrado.");
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);

  // Listeners globais (adicionados após o clique atual)
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};


function gerarArrayCardsTarefas(tarefasArray) {
  return tarefasArray
    .map(
      (task) => `
    <div data-task-id="${
      task.id
    }" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid ${getTaskPriorityColor(
        task.priority
      )}; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.boxShadow='0 1px 3px 0 rgba(0, 0, 0, 0.1)'">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #000000;">${
              task.title
            }</h3>
            <span style="display: flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; background-color: ${getTaskStatusBgColor(
              task.status
            )}; color: ${getTaskStatusTextColor(
        task.status
      )}; border-radius: 0.25rem; font-size: 0.75rem;">
              ${getPriorityBorderColor(task.status)}
              ${getTaskStatusLabel(task.status)}
            </span>
            <span style="padding: 0.25rem 0.5rem; background-color: ${getTaskPriorityBgColor(
              task.priority
            )}; color: ${getTaskPriorityTextColor(
        task.priority
      )}; border-radius: 0.25rem; font-size: 0.75rem;">
              ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <p style="color: #666666; margin-bottom: 0.75rem;">${
            task.description
          }</p>
          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: #9ca3af;">
            <span style="font-weight: 500; color: #3b82f6;">${
              task.projetos
            }</span>
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
              <span>${task.assignee}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${formatarDataPtBR(task.deadline)}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <select class="task-status-select" data-task-id="${
            task.id
          }" style="padding: 0.375rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
            <option value="todo" ${
              task.status === "todo" ? "selected" : ""
            }>A Fazer</option>
            <option value="em-progresso" ${
              task.status === "em-progresso" ? "selected" : ""
            }>Em Progresso</option>
            <option value="em-revisao" ${
              task.status === "em-revisao" ? "selected" : ""
            }>Em Revisão</option>
            <option value="concluida" ${
              task.status === "concluida" ? "selected" : ""
            }>Concluída</option>
            <option value="bloqueada" ${
              task.status === "bloqueada" ? "selected" : ""
            }>Bloqueada</option>
          </select>
          <div class="task-menu" style="position: relative;">
            <button onclick="abrirMenuTarefas(${
              task.id
            })" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: #666666;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// FIM BACKLOG /////////////////////////////////////////////////////////////////////////////////////////////////////////

window.fecharModal = fecharModal;

window.editarProjetos = editarProjetos;

window.abrirMenuProjeto = (projectId) => {
  const card = document.querySelector(`[data-projetos-id="${projectId}"]`);
  if (!card) return;

  let menu = card.querySelector(".projetos-menu-dropdown");

  // Fecha outros menus abertos com limpeza de listeners
  document.querySelectorAll(".projetos-menu-dropdown").forEach((el) => {
    if (el !== menu) {
      if (typeof el._close === "function") el._close();
      else el.remove();
    }
  });

  // Se já está aberto, fecha e sai
  if (menu) {
    if (typeof menu._close === "function") menu._close();
    else menu.remove();
    return;
  }

  // Container do menu (o card tem .projetos-menu envolvendo o botão)
  const menuContainer = card.querySelector(".projetos-menu") || card;
  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  // Cria menu
  menu = document.createElement("div");
  menu.className = "projetos-menu-dropdown";
  menu.style.position = "absolute";
  menu.style.top = "30px";
  menu.style.right = "0";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #e5e7eb";
  menu.style.borderRadius = "0.375rem";
  menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  menu.style.zIndex = "999";

  // Helpers de fechar
  const onClickOutside = (ev) => {
    if (!menu.contains(ev.target)) closeMenu();
  };
  const onEsc = (ev) => {
    if (ev.key === "Escape") closeMenu();
  };
  function closeMenu() {
    if (!menu) return;
    // remove listeners globais
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    menu = null;
  }
  // expõe para terceiros/fechamento programático
  menu._close = closeMenu;

  // Evita que cliques dentro do menu disparem o "fora"
  menu.addEventListener("click", (e) => e.stopPropagation());

  // Botão Apagar
  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">
      🗑 <span>Apagar</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    closeMenu(); // fecha antes do modal
    const confirmar = await confirmarModal({
      title: "Excluir projeto?",
      message: "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      if (typeof deletarProjeto === "function") deletarProjeto(projectId);
      else console.warn("deletarProjeto(projectId) não encontrado.");
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);

  // listeners globais (adicionados após o clique atual)
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};


// CALENDARIO /////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper global para montar a lista de usuários conhecida pelo app
if (typeof window.getKnownUsersForEvents !== "function") {
  window.getKnownUsersForEvents = function () {
    try {
      // Reaproveita do chat, se existir
      const base = typeof window.getAllKnownUsers === "function" ? window.getAllKnownUsers() : [];

      // users do localStorage (string[] ou {name:string}[])
      const fromLocalRaw = JSON.parse(localStorage.getItem("users") || "[]");
      const fromLocal = Array.isArray(fromLocalRaw)
        ? fromLocalRaw.map(u => (typeof u === "string" ? u : u?.name)).filter(Boolean)
        : [];

      // usuário atual
      const currentName = (JSON.parse(localStorage.getItem("user") || "{}") || {}).name;

      // membros conhecidos de chats e equipes
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

  // Empty cells for days before the first dia of the mes
  for (let i = 0; i < primeiroDia; i++) {
    calendarioHTML +=
      '<div style="background-color: #ffffff; padding: 0.75rem; min-height: 80px;"></div>';
  }

  // Days of the mes
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
  const selected = new Map(); // name -> { included: boolean }

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

  // popular lista
  for (const u of knownUsers) {
    if (!selected.has(u)) selected.set(u, { included: false });
    upsertRow(u);
  }

  // busca
  document.getElementById("eventUserSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#eventUserList [data-row]").forEach((r) => {
      const name = r.getAttribute("data-row") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  // adicionar manualmente
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

  // submit
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
  const selected = new Map(); // name -> { included: boolean }
  (Array.isArray(ev.participants) ? ev.participants : []).forEach(p => {
    selected.set(p, { included: true });
  });
  // garante que todos os conhecidos existam no map
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

// CHAT /////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  const posting = chat?.policies?.posting || "all"; // "all" | "admins"
  if (posting === "admins") {
    return Array.isArray(chat.admins) && chat.admins.includes(userName);
  }
  return true;
}

function showToast(msg) {
  // troque por seu sistema de toast/snackbar, se tiver
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

  // Busca de conversas
  document.getElementById("chatSearch")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll(".chat-room-item").forEach((item) => {
      const name = item.querySelector("h4").textContent.toLowerCase();
      item.style.display = name.includes(term) ? "block" : "none";
    });
  });

  // Delegação de eventos para lista de conversas
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

      // Calcular mensagens não lidas
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

  // Salvar último chat aberto
  localStorage.setItem("ultimoChat", roomId);

  // Marcar mensagens como lidas
  room.messages.forEach((msg) => {
    if (msg.sender !== user.name) msg.read = true;
  });

  document.getElementById("currentChatName").textContent = room.name;
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = generateChatMessages(room.messages);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  document.getElementById("chatInput").style.display = "block";

  // Mostrar botão de sair
  const leaveBtn = document.getElementById("leaveChatBtn");
  leaveBtn.style.display = "block";
  leaveBtn.onclick = () => sairDaConversa(roomId);

  setupMessageSending(roomId);

  // Atualizar lista de chats
  atualizarListaChats();
}

function sairDaConversa(roomId) {
  const roomIndex = chatGrupos.findIndex((r) => r.id === roomId);
  if (roomIndex === -1) return;

  // Remover a conversa
  chatGrupos.splice(roomIndex, 1);

  // Resetar a interface do chat
  document.getElementById("currentChatName").textContent =
    "Selecione uma conversa";
  document.getElementById("chatMessages").innerHTML = `
    <div style="text-align: center; color: #666666; margin-top: 2rem;">
      Selecione uma conversa para começar
    </div>
  `;
  document.getElementById("chatInput").style.display = "none";
  document.getElementById("leaveChatBtn").style.display = "none";

  // Limpar último chat salvo
  localStorage.removeItem("ultimoChat");

  // Atualizar a lista de conversas
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

// Prevenção contra XSS
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

  // Função para limpar o campo
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

    // Atualizar apenas as mensagens
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = generateChatMessages(room.messages);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Atualizar lista de chats
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

  // estado interno
  const selected = new Map(); // name -> { included, admin, locked? }

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
      type: chatType, // "public" | "private"
      members,        // array de strings
      admins,         // array de strings
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

// Função para atualizar apenas a lista de chats
function atualizarListaChats() {
  const container = document.getElementById("chatGruposList");
  if (container) {
    container.innerHTML = gerarListaChats();
  }
}
// FIM CHAT /////////////////////////////////////////////////////////////////////////////////////////////////////////

// EQUIPES /////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadEquipesContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Equipes</h1>
          <p style="color: #666666;">Gerencie grupos e permissões</p>
        </div>
        <button id="newTeamBtn" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nova Equipe
        </button>
      </div>
  
      <div id="equipesStats" class="stat-card" style="margin-bottom:1rem;">
        <div class="stat-header" style="display:flex;justify-content:space-between;align-items:center;">
          <div class="stat-info">
            <h3>Membros da Equipe</h3>
            <div class="stat-value">–</div>
            <div class="stat-change">–</div>
          </div>
          <div class="stat-icon purple">
            <!-- seu ícone -->
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:1.5rem;">
        ${generateTeamCards()}
      </div>
    `;

  setupTeamsFunctionality();
  renderEquipesStats();
}

/* ===================== Helpers de fallback (usados pelos pickers) ===================== */
if (typeof window.sanitizeHTML !== "function") {
  window.sanitizeHTML = function (str) {
    const div = document.createElement("div");
    div.textContent = String(str ?? "");
    return div.innerHTML;
  };
}

if (typeof window.getKnownUsersForEvents !== "function") {
  window.getKnownUsersForEvents = function () {
    try {
      const me = (JSON.parse(localStorage.getItem("user") || "{}") || {}).name;
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]")
        .map(u => typeof u === "string" ? u : u?.name).filter(Boolean);
      const chatUsers = Array.isArray(window.chatGrupos)
        ? window.chatGrupos.flatMap(g => [...(g.members||[]), ...(g.admins||[])])
        : [];
      const teamUsers = Array.isArray(window.equipes)
        ? window.equipes.flatMap(e => e.members || [])
        : [];
      const all = [me, ...localUsers, ...chatUsers, ...teamUsers].filter(Boolean);
      return Array.from(new Set(all)).sort((a,b)=>a.localeCompare(b));
    } catch { return []; }
  };
}

if (typeof window.getKnownProjects !== "function") {
  window.getKnownProjects = function () {
    try {
      // garante que pega global mesmo se não estiver em window
      const globProjetos = Array.isArray(window.projetos)
        ? window.projetos
        : (typeof projetos !== "undefined" && Array.isArray(projetos) ? projetos : []);

      const fromProjetos = globProjetos.map(p => p?.name).filter(Boolean);
      const fromTeams = Array.isArray(window.equipes)
        ? window.equipes.flatMap(e => Array.isArray(e.projetos) ? e.projetos : [])
        : [];
      const fromTasks = Array.isArray(window.tarefas)
        ? window.tarefas.map(t => t?.projetos).filter(Boolean)
        : [];
      const fromLocal = JSON.parse(localStorage.getItem("projects") || "[]");

      const all = [
        ...fromProjetos,
        ...fromTeams,
        ...fromTasks,
        ...(Array.isArray(fromLocal) ? fromLocal : [])
      ].map(s => String(s).trim()).filter(Boolean);

      return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
    } catch {
      return [];
    }
  };
}

function renderEquipesStats() {
  const totalEquipes = Array.isArray(equipes) ? equipes.length : 0;
  const totalMembros = Array.isArray(equipes)
    ? equipes.reduce((acc, e) => acc + ((e.members && e.members.length) || 0), 0)
    : 0;

  const wrap = document.getElementById('equipesStats');
  if (!wrap) return;
  const valueEl = wrap.querySelector('.stat-value');
  const changeEl = wrap.querySelector('.stat-change');

  if (valueEl) valueEl.textContent = `${totalMembros}`;
  if (changeEl) changeEl.textContent = `${totalEquipes} equipe(s)`;
}

/* ===================================================================================== */

function setupTeamsFunctionality() {
  const newTeamBtn = document.getElementById("newTeamBtn");
  if (newTeamBtn) {
    newTeamBtn.addEventListener("click", showNewTeamModal);
  }
  setupTeamCardActions();
}

function generateTeamCards() {
  return equipes
    .map(
      (equipe) => `
      <div data-equipe-id="${equipe.id}" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); transition: box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.boxShadow='0 1px 3px 0 rgba(0, 0, 0, 0.1)'">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div style="flex: 1;">
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #000000; margin-bottom: 0.5rem;">${sanitizeHTML(equipe.name)}</h3>
            <p style="color: #666666; font-size: 0.875rem; margin-bottom: 0.75rem;">${sanitizeHTML(equipe.description)}</p>
          </div>
          <button onclick="toggleTeamMenu(${equipe.id})" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: #666666;">
            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 500; font-size: 0.875rem;">Líder:</span>
            <span style="color: #3b82f6; font-weight: 500;">${sanitizeHTML(equipe.leader)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 500; font-size: 0.875rem;">Membros:</span>
            <span>${equipe.members.length}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 500; font-size: 0.875rem;">Projetos:</span>
            <span>${equipe.projetos.length}</span>
          </div>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Membros da Equipe:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${(equipe.members || []).map(member => `
              <span style="background-color: #f3f4f6; color: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                ${sanitizeHTML(member)}
              </span>
            `).join("")}
          </div>
        </div>
  
        <div style="margin-bottom: 1rem;">
          <h4 style="font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Projetos:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${(equipe.projetos || []).map(p => `
              <span style="background-color: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                ${sanitizeHTML(p)}
              </span>
            `).join("")}
          </div>
        </div>
  
        <div style="display: flex; gap: 0.5rem;">
          <button class="edit-equipe-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">
            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="view-equipe-btn btn btn-outline" style="flex: 1; font-size: 0.875rem;">Ver Detalhes</button>
        </div>
      </div>
    `
    )
    .join("");
}

function setupTeamCardActions() {
  document.querySelectorAll(".edit-equipe-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const teamId = Number.parseInt(
        e.target.closest("[data-equipe-id]").getAttribute("data-equipe-id")
      );
      editTeam(teamId);
    });
  });

  document.querySelectorAll(".view-equipe-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const teamId = Number.parseInt(
        e.target.closest("[data-equipe-id]").getAttribute("data-equipe-id")
      );
      viewTeamDetails(teamId);
    });
  });
}

/* ===================== MODAL: NOVA EQUIPE (com pickers) ===================== */
function showNewTeamModal() {
  const knownUsers = getKnownUsersForEvents();
  const knownProjects = getKnownProjects();

  const selectedMembers = new Map(); // name -> boolean
  let selectedLeader = "";           // string (um só)
  const selectedProjects = new Set();

  createModal(
    "Criar Nova Equipe",
    `
      <form id="newTeamForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome da Equipe</label>
          <input type="text" id="teamName" required
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
          <textarea id="teamDescription" required
            style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
        </div>

        <div style="margin:0.5rem 0;font-weight:600;">Membros e Líder</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="teamUserSearch" placeholder="Buscar usuários..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="teamManualUser" placeholder="Adicionar manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="teamAddManualBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="teamUserList"
             style="max-height:240px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Projetos</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="teamProjectSearch" placeholder="Buscar projetos..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="teamManualProject" placeholder="Adicionar projeto manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="teamAddManualProjectBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="teamProjectList"
             style="max-height:200px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Criar Equipe</button>
        </div>
      </form>
    `
  );

  // ----- Membros/Líder -----
  function upsertUserRow(name) {
    const list = document.getElementById("teamUserList");
    if (!list || list.querySelector(`[data-row-user="${CSS.escape(name)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row-user", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(name)}">
        ${sanitizeHTML(name)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tmIncChk" data-user="${sanitizeHTML(name)}">
        <span>Membro</span>
      </label>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="radio" name="tmLeader" class="tmLeaderRadio" data-user="${sanitizeHTML(name)}">
        <span>Líder</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tmIncChk");
    const radio = row.querySelector(".tmLeaderRadio");

    chk.checked = !!selectedMembers.get(name);
    radio.checked = selectedLeader === name;

    chk.addEventListener("change", () => {
      selectedMembers.set(name, chk.checked);
      if (!chk.checked && selectedLeader === name) {
        selectedLeader = "";
        radio.checked = false;
      }
    });

    radio.addEventListener("change", () => {
      if (radio.checked) {
        selectedLeader = name;
        selectedMembers.set(name, true);
        chk.checked = true;
        document.querySelectorAll('#teamUserList .tmLeaderRadio').forEach((r) => {
          if (r !== radio) r.checked = false;
        });
      }
    });
  }

  for (const u of knownUsers) {
    selectedMembers.set(u, false);
    upsertUserRow(u);
  }

  document.getElementById("teamUserSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#teamUserList [data-row-user]").forEach((r) => {
      const name = r.getAttribute("data-row-user") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("teamAddManualBtn").addEventListener("click", () => {
    const input = document.getElementById("teamManualUser");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selectedMembers.has(name)) {
      selectedMembers.set(name, true);
      upsertUserRow(name);
      const row = document.querySelector(`#teamUserList [data-row-user="${CSS.escape(name)}"]`);
      row?.querySelector(".tmIncChk")?.setAttribute("checked", "checked");
      row?.querySelector(".tmIncChk")?.dispatchEvent(new Event("change"));
    }
    input.value = "";
    input.focus();
  });

  // ----- Projetos -----
  function upsertProjectRow(p) {
    const list = document.getElementById("teamProjectList");
    if (!list || list.querySelector(`[data-row-project="${CSS.escape(p)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row-project", p);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(p)}">
        ${sanitizeHTML(p)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tpChk" data-project="${sanitizeHTML(p)}">
        <span>Selecionar</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tpChk");
    chk.checked = selectedProjects.has(p);
    chk.addEventListener("change", () => {
      if (chk.checked) selectedProjects.add(p);
      else selectedProjects.delete(p);
    });
  }

  for (const p of getKnownProjects()) upsertProjectRow(p);

  document.getElementById("teamProjectSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#teamProjectList [data-row-project]").forEach((r) => {
      const name = r.getAttribute("data-row-project") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("teamAddManualProjectBtn").addEventListener("click", () => {
    const input = document.getElementById("teamManualProject");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selectedProjects.has(name)) selectedProjects.add(name);
    upsertProjectRow(name);
    const row = document.querySelector(`#teamProjectList [data-row-project="${CSS.escape(name)}"]`);
    row?.querySelector(".tpChk")?.setAttribute("checked", "checked");
    row?.querySelector(".tpChk")?.dispatchEvent(new Event("change"));
    input.value = "";
    input.focus();
  });

  // ----- submit -----
  document.getElementById("newTeamForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("teamName").value.trim();
    const description = document.getElementById("teamDescription").value.trim();

    const members = Array.from(selectedMembers.entries())
      .filter(([, inc]) => inc)
      .map(([n]) => n);

    let leader = selectedLeader;
    if (!leader && members.length) leader = members[0];

    const newTeam = {
      id: Date.now(),
      name,
      description,
      leader: leader || "",
      members: leader ? Array.from(new Set([leader, ...members])) : members,
      projetos: Array.from(selectedProjects),
      // armazena "YYYY-MM-DD" — compatível com seu helper e evita o bug do UTC ao exibir:
      createdAt: getDataBrasiliaFormatada(),
    };

    equipes.push(newTeam);
    fecharModal();
    loadEquipesContent();
  });
}
/* ========================================================================== */

/* ===================== MODAL: EDITAR EQUIPE (com pickers) ===================== */
function editTeam(teamId) {
  const equipe = equipes.find((t) => t.id === teamId);
  if (!equipe) return;

  const knownUsers = getKnownUsersForEvents();
  const knownProjects = getKnownProjects();

  const selectedMembers = new Map();
  let selectedLeader = equipe.leader || "";
  const selectedProjects = new Set(equipe.projetos || []);

  (equipe.members || []).forEach(m => selectedMembers.set(m, true));
  knownUsers.forEach(u => { if (!selectedMembers.has(u)) selectedMembers.set(u, false); });

  createModal(
    "Editar Equipe",
    `
      <form id="editTeamForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome da Equipe</label>
          <input type="text" id="editTeamName" required
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
          <textarea id="editTeamDescription" required
            style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
        </div>

        <div style="margin:0.5rem 0;font-weight:600;">Membros e Líder</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="editTeamUserSearch" placeholder="Buscar usuários..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="editTeamManualUser" placeholder="Adicionar manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="editTeamAddManualBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="editTeamUserList"
             style="max-height:240px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Projetos</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
          <input type="text" id="editTeamProjectSearch" placeholder="Buscar projetos..."
                 style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <input type="text" id="editTeamManualProject" placeholder="Adicionar projeto manualmente"
                 style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <button type="button" id="editTeamAddManualProjectBtn" class="btn btn-outline">Adicionar</button>
        </div>
        <div id="editTeamProjectList"
             style="max-height:200px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;"></div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `
  );

  // set valores simples
  document.getElementById("editTeamName").value = equipe.name || "";
  document.getElementById("editTeamDescription").value = equipe.description || "";

  // ----- Membros/Líder -----
  function upsertUserRow(name, listId) {
    const list = document.getElementById(listId);
    if (!list || list.querySelector(`[data-row-user="${CSS.escape(name)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row-user", name);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(name)}">
        ${sanitizeHTML(name)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tmIncChk" data-user="${sanitizeHTML(name)}">
        <span>Membro</span>
      </label>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="radio" name="tmLeaderEdit" class="tmLeaderRadio" data-user="${sanitizeHTML(name)}">
        <span>Líder</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tmIncChk");
    const radio = row.querySelector(".tmLeaderRadio");

    chk.checked = !!selectedMembers.get(name);
    radio.checked = selectedLeader === name;

    chk.addEventListener("change", () => {
      selectedMembers.set(name, chk.checked);
      if (!chk.checked && selectedLeader === name) {
        selectedLeader = "";
        radio.checked = false;
      }
    });

    radio.addEventListener("change", () => {
      if (radio.checked) {
        selectedLeader = name;
        selectedMembers.set(name, true);
        chk.checked = true;
        document.querySelectorAll('#editTeamUserList .tmLeaderRadio').forEach((r) => {
          if (r !== radio) r.checked = false;
        });
      }
    });
  }

  // popula lista
  for (const u of selectedMembers.keys()) upsertUserRow(u, "editTeamUserList");
  for (const u of knownUsers) if (!selectedMembers.has(u)) {
    selectedMembers.set(u, false);
    upsertUserRow(u, "editTeamUserList");
  }

  document.getElementById("editTeamUserSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#editTeamUserList [data-row-user]").forEach((r) => {
      const name = r.getAttribute("data-row-user") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("editTeamAddManualBtn").addEventListener("click", () => {
    const input = document.getElementById("editTeamManualUser");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selectedMembers.has(name)) {
      selectedMembers.set(name, true);
      upsertUserRow(name, "editTeamUserList");
      const row = document.querySelector(`#editTeamUserList [data-row-user="${CSS.escape(name)}"]`);
      row?.querySelector(".tmIncChk")?.setAttribute("checked", "checked");
      row?.querySelector(".tmIncChk")?.dispatchEvent(new Event("change"));
    }
    input.value = "";
    input.focus();
  });

  // ----- Projetos -----
  function upsertProjectRow(p, listId) {
    const list = document.getElementById(listId);
    if (!list || list.querySelector(`[data-row-project="${CSS.escape(p)}"]`)) return;

    const row = document.createElement("div");
    row.setAttribute("data-row-project", p);
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr auto";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.padding = "0.4rem 0.25rem";
    row.style.borderBottom = "1px dashed #eee";
    row.innerHTML = `
      <div style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${sanitizeHTML(p)}">
        ${sanitizeHTML(p)}
      </div>
      <label style="display:flex;align-items:center;gap:0.35rem;justify-self:end;">
        <input type="checkbox" class="tpChk" data-project="${sanitizeHTML(p)}">
        <span>Selecionar</span>
      </label>
    `;
    list.appendChild(row);

    const chk = row.querySelector(".tpChk");
    chk.checked = selectedProjects.has(p);
    chk.addEventListener("change", () => {
      if (chk.checked) selectedProjects.add(p);
      else selectedProjects.delete(p);
    });
  }

  const projListId = "editTeamProjectList";
  getKnownProjects().forEach(p => upsertProjectRow(p, projListId));
  (equipe.projetos || []).forEach(p => upsertProjectRow(p, projListId)); // garante presença

  document.getElementById("editTeamProjectSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(`#${projListId} [data-row-project]`).forEach((r) => {
      const name = r.getAttribute("data-row-project") || "";
      r.style.display = name.toLowerCase().includes(q) ? "grid" : "none";
    });
  });

  document.getElementById("editTeamAddManualProjectBtn").addEventListener("click", () => {
    const input = document.getElementById("editTeamManualProject");
    const name = (input.value || "").trim();
    if (!name) return;
    if (!selectedProjects.has(name)) selectedProjects.add(name);
    upsertProjectRow(name, projListId);
    const row = document.querySelector(`#${projListId} [data-row-project="${CSS.escape(name)}"]`);
    row?.querySelector(".tpChk")?.setAttribute("checked", "checked");
    row?.querySelector(".tpChk")?.dispatchEvent(new Event("change"));
    input.value = "";
    input.focus();
  });

  // ----- submit -----
  document.getElementById("editTeamForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("editTeamName").value.trim();
    const description = document.getElementById("editTeamDescription").value.trim();

    const members = Array.from(selectedMembers.entries())
      .filter(([, inc]) => inc)
      .map(([n]) => n);

    let leader = selectedLeader;
    if (!leader && members.length) leader = members[0];

    equipe.name = name;
    equipe.description = description;
    equipe.leader = leader || "";
    equipe.members = leader ? Array.from(new Set([leader, ...members])) : members;
    equipe.projetos = Array.from(selectedProjects);

    fecharModal();
    loadEquipesContent();
  });
}
/* =========================================================================== */

function viewTeamDetails(teamId) {
  const equipe = equipes.find((t) => t.id === teamId);
  if (!equipe) return;

  // Corrige exibição da data (sem "voltar um dia")
  const criadaEm = typeof equipe.createdAt === "string"
    ? formatarDataPtBR(equipe.createdAt) // "YYYY-MM-DD" -> dd/mm/yyyy
    : new Date(equipe.createdAt).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  createModal(
    `Detalhes da Equipe: ${sanitizeHTML(equipe.name)}`,
    `
      <div style="max-height: 400px; overflow-y: auto;">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Informações Gerais</h3>
          <p style="margin-bottom: 0.5rem;"><strong>Descrição:</strong> ${sanitizeHTML(equipe.description)}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Líder:</strong> ${sanitizeHTML(equipe.leader)}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Total de Membros:</strong> ${equipe.members.length}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Projetos Ativos:</strong> ${equipe.projetos.length}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Criada em:</strong> ${criadaEm}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Membros da Equipe</h3>
          <div style="display: grid; gap: 0.5rem;">
            ${equipe.members
              .map((member) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background-color: #f9fafb; border-radius: 0.375rem;">
                <span>${sanitizeHTML(member)}</span>
                ${member === equipe.leader
                    ? '<span style="background-color: #3b82f6; color: white; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Líder</span>'
                    : ""
                }
              </div>
            `)
              .join("")}
          </div>
        </div>
  
        <div>
          <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Projetos</h3>
          ${
            equipe.projetos.length > 0
              ? equipe.projetos
                  .map((p) => `
              <div style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; margin-bottom: 0.5rem;">
                <h4 style="font-weight: 500;">${sanitizeHTML(p)}</h4>
              </div>
            `)
                  .join("")
              : '<p style="color: #666666; text-align: center; padding: 1rem;">Nenhum projeto atribuído</p>'
          }
        </div>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <button type="button" onclick="editTeam(${equipe.id})" class="btn btn-outline">Editar</button>
        <button type="button" onclick="fecharModal()" class="btn btn-primary">Fechar</button>
      </div>
    `
  );
}

// Remove equipe por ID, atualiza UI e dashboard
function deleteTeam(teamId) {
  const id = Number(teamId);
  if (!Array.isArray(equipes)) {
    console.warn("Array 'equipes' não está definido.");
    return;
  }

  const idx = equipes.findIndex(e => Number(e?.id) === id);
  if (idx === -1) {
    console.warn("Equipe não encontrada:", id);
    if (typeof showToast === "function") showToast("Equipe não encontrada.");
    return;
  }

  const [removida] = equipes.splice(idx, 1);

  // Atualiza a tela se estiver na página de equipes
  if (typeof loadEquipesContent === "function") {
    // Se quiser manter o filtro/scroll, pode chamar algo mais fino aqui
    loadEquipesContent();
  }

  // Atualiza card do dashboard (se estiver visível)
  if (typeof updateTeamsStatCard === "function" && document.getElementById("teamsStatCard")) {
    updateTeamsStatCard();
  }

  if (typeof showToast === "function") {
    showToast(`Equipe "${removida?.name || id}" excluída com sucesso!`);
  }
}

// (Opcional) compatibilidade se você tinha outra função com nome diferente
if (typeof window.deletarEquipe === "function" && typeof window.deleteTeam !== "function") {
  window.deleteTeam = window.deletarEquipe;
}

window.toggleTeamMenu = (teamId) => {
  const card =
    document.querySelector(`[data-team-id="${teamId}"]`) ||
    document.querySelector(`[data-equipe-id="${teamId}"]`);
  if (!card) return;

  let menu = card.querySelector(".team-menu-dropdown");

  // Fecha outros menus (chamando o _close se existir)
  document.querySelectorAll(".team-menu-dropdown").forEach((el) => {
    if (el !== menu) {
      if (typeof el._close === "function") el._close();
      else el.remove();
    }
  });

  // Se já existe esse menu aberto, fecha e sai
  if (menu) {
    if (typeof menu._close === "function") menu._close();
    else menu.remove();
    return;
  }

  // Contêiner onde o menu vai ficar
  const menuContainer =
    card.querySelector(".team-menu") ||
    card.querySelector(".task-menu") || // fallback
    card;

  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  // Cria o menu
  menu = document.createElement("div");
  menu.className = "team-menu-dropdown";
  menu.style.position = "absolute";
  menu.style.top = "30px";
  menu.style.right = "0";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #e5e7eb";
  menu.style.borderRadius = "0.375rem";
  menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  menu.style.zIndex = "999";

  // --- helpers: fechar + listeners de fora/ESC ---
  const onClickOutside = (ev) => {
    if (!menu) return;
    if (!menu.contains(ev.target)) closeMenu();
  };
  const onEsc = (ev) => {
    if (ev.key === "Escape") closeMenu();
  };
  function closeMenu() {
    if (!menu) return;
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    menu = null;
  }
  // expõe para que outros fechamentos consigam limpar os listeners
  menu._close = closeMenu;

  // Evita que cliques dentro do menu disparem o "click fora"
  menu.addEventListener("click", (e) => e.stopPropagation());

  // Botão "Apagar equipe"
  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `
    <span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">
      🗑 <span>Apagar equipe</span>
    </span>`;
  apagarBtn.style.padding = "0.5rem";
  apagarBtn.style.cursor = "pointer";
  apagarBtn.style.color = "#b91c1c";

  apagarBtn.addEventListener("click", async () => {
    closeMenu(); // fecha antes de abrir modal
    const confirmar = await confirmarModal({
      title: "Excluir equipe?",
      message: "Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      if (typeof deleteTeam === "function") deleteTeam(teamId);
      else console.warn("deleteTeam(teamId) não encontrado.");
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);

  // Adiciona listeners globais *após* o click atual concluir
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};
// FIM EQUIPES /////////////////////////////////////////////////////////////////////////////////////////////////////

// AVISOS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const S_NOTICE = typeof sanitizeHTML === "function"
  ? sanitizeHTML
  : (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

window.equipes  = window.equipes  || JSON.parse(localStorage.getItem("equipes")  || "[]");
window.projetos = window.projetos || JSON.parse(localStorage.getItem("projetos") || "[]");
window.avisos   = window.avisos   || JSON.parse(localStorage.getItem("avisos")   || "[]");

// Equipes e Projetos do estado global
function getTeamOptions() {
  const src = (Array.isArray(window.equipes) && window.equipes.length)
    ? window.equipes
    : (typeof equipes !== "undefined" ? equipes : JSON.parse(localStorage.getItem("equipes") || "[]"));
  return src.map(e => ({ id: Number(e.id), name: e.name || "Sem nome" }));
}

function getProjectOptions() {
  const src = (Array.isArray(window.projetos) && window.projetos.length)
    ? window.projetos
    : (typeof projetos !== "undefined" ? projetos : JSON.parse(localStorage.getItem("projetos") || "[]"));
  return src.map(p => ({ id: Number(p.id), name: p.name || "Sem nome" }));
}


function resolveTeamNamesFromIds(ids=[]) {
  const map = new Map(getTeamOptions().map(t => [t.id, t.name]));
  return ids.map(id => map.get(Number(id))).filter(Boolean);
}
function resolveProjectNamesFromIds(ids=[]) {
  const map = new Map(getProjectOptions().map(p => [p.id, p.name]));
  return ids.map(id => map.get(Number(id))).filter(Boolean);
}


function loadAvisosContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");

  conteudoPagina.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; font-weight: bold; color: #000000; margin-bottom: 0.5rem;">Avisos</h1>
          <p style="color: #666666;">Comunicados e notificações importantes</p>
        </div>
        <button id="newNoticeBtn" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Novo Aviso
        </button>
      </div>
  
      <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
        <select id="noticePriorityFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="todas">Todas as Prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <select id="noticeTypeFilter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="todos">Todos os Tipos</option>
          <option value="policy">Política</option>
          <option value="maintenance">Manutenção</option>
          <option value="announcement">Anúncio</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>
  
      <div id="avisosContainer" style="display: flex; flex-direction: column; gap: 1rem;">
        ${generateNoticeCards()}
      </div>
    `;

  setupNoticesFunctionality();
}

function setupNoticesFunctionality() {
  const newNoticeBtn = document.getElementById("newNoticeBtn");
  if (newNoticeBtn) {
    newNoticeBtn.addEventListener("click", showNewNoticeModal);
  }

  // Filters
  const priorityFilter = document.getElementById("noticePriorityFilter");
  const typeFilter = document.getElementById("noticeTypeFilter");

  if (priorityFilter) {
    priorityFilter.addEventListener("change", filterNotices);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterNotices);
  }

  setupNoticeActions();
}

function renderNoticeCard(notice) {
  const teamNames = resolveTeamNamesFromIds(notice.teamIds || []);
  const projectNames = resolveProjectNamesFromIds(notice.projectIds || []);

  const teamsChips = teamNames.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-top:0.5rem;">
         ${teamNames.map(n => `<span style="background:#eef2ff;color:#3730a3;padding:0.125rem 0.5rem;border-radius:999px;font-size:0.7rem;">${S_NOTICE(n)}</span>`).join("")}
       </div>`
    : "";

  const projectsChips = projectNames.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-top:0.25rem;">
         ${projectNames.map(n => `<span style="background:#ecfeff;color:#155e75;padding:0.125rem 0.5rem;border-radius:999px;font-size:0.7rem;">${S_NOTICE(n)}</span>`).join("")}
       </div>`
    : "";

  return `
    <div data-notice-id="${notice.id}"
         style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid ${getNoticePriorityColor(notice.priority)};border-radius:0.5rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.1);">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1rem;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
            <h3 style="font-size:1.25rem;font-weight:600;color:#000;">${S_NOTICE(notice.title)}</h3>
            <span style="padding:0.25rem 0.5rem;background:${getNoticePriorityBgColor(notice.priority)};color:${getNoticePriorityTextColor(notice.priority)};border-radius:0.25rem;font-size:0.75rem;font-weight:500;">
              ${notice.priority.toUpperCase()}
            </span>
            <span style="padding:0.25rem 0.5rem;background:${getNoticeTypeBgColor(notice.type)};color:${getNoticeTypeTextColor(notice.type)};border-radius:0.25rem;font-size:0.75rem;">
              ${getNoticeTypeLabel(notice.type)}
            </span>
          </div>

          <p style="color:#666;margin-bottom:0.75rem;line-height:1.5;">${S_NOTICE(notice.content)}</p>

          ${teamNames.length || projectNames.length ? `
            <div style="margin:0.25rem 0 0.5rem;color:#6b7280;font-size:0.85rem;">
              ${teamNames.length ? `<div><strong>Equipes:</strong> ${teamNames.length}</div>` : ``}
              ${teamsChips}
              ${projectNames.length ? `<div style="margin-top:0.35rem;"><strong>Projetos:</strong> ${projectNames.length}</div>` : ``}
              ${projectsChips}
            </div>` : ``}

          <div style="display:flex;align-items:center;gap:1rem;font-size:0.875rem;color:#9ca3af;margin-top:0.5rem;">
            <div style="display:flex;align-items:center;gap:0.25rem;">
              <svg style="width:1rem;height:1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
              <span>Por: ${S_NOTICE(notice.author)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.25rem;">
              <svg style="width:1rem;height:1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Publicado: ${formatarDataPtBR(notice.publishedAt)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.25rem;">
              <svg style="width:1rem;height:1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>Expira: ${formatarDataPtBR(notice.expiresAt)}</span>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:0.5rem;">
          <button class="edit-notice-btn btn btn-outline" style="font-size:0.875rem;">Editar</button>
          <button class="delete-notice-btn btn btn-outline" style="font-size:0.875rem;color:#dc2626;border-color:#dc2626;">Excluir</button>
        </div>
      </div>
    </div>
  `;
}

function generateNoticeCards() {
  return (window.avisos || []).map(renderNoticeCard).join("");
}
function generateNoticeCardsFromArray(arr) {
  return (arr || []).map(renderNoticeCard).join("");
}


function setupNoticeActions() {
  // Edit notice buttons
  document.querySelectorAll(".edit-notice-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noticeId = Number.parseInt(
        e.target.closest("[data-notice-id]").getAttribute("data-notice-id")
      );
      editNotice(noticeId);
    });
  });

  // Delete notice buttons
  document.querySelectorAll(".delete-notice-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noticeId = Number.parseInt(
        e.target.closest("[data-notice-id]").getAttribute("data-notice-id")
      );
      deleteNotice(noticeId);
    });
  });
}

function filterNotices() {
  const priorityFilter =
    document.getElementById("noticePriorityFilter")?.value || "todas";
  const typeFilter =
    document.getElementById("noticeTypeFilter")?.value || "todos";

  const filteredNotices = (window.avisos || []).filter((notice) => {
    const matchesPriority =
      priorityFilter === "todas" || notice.priority === priorityFilter;
    const matchesType = typeFilter === "todos" || notice.type === typeFilter;
    return matchesPriority && matchesType;
  });

  const avisosContainer = document.getElementById("avisosContainer");
  if (avisosContainer) {
    avisosContainer.innerHTML = generateNoticeCardsFromArray(filteredNotices);
    setupNoticeActions();
  }
}

function showNewNoticeModal() {
  const teams = getTeamOptions();
  const projects = getProjectOptions();

  const teamsList = teams.length
    ? teams.map(t => `
        <label data-row-team="${t.id}" style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" class="noticeTeamChk" value="${t.id}"> ${S_NOTICE(t.name)}
        </label>`).join("")
    : `<div style="color:#6b7280;">Nenhuma equipe cadastrada.</div>`;

  const projectsList = projects.length
    ? projects.map(p => `
        <label data-row-project="${p.id}" style="display:flex;align-items:center;gap:0.5rem;">
          <input type="checkbox" class="noticeProjectChk" value="${p.id}"> ${S_NOTICE(p.name)}
        </label>`).join("")
    : `<div style="color:#6b7280;">Nenhum projeto cadastrado.</div>`;

  createModal(
    "Criar Novo Aviso",
    `
      <form id="newNoticeForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Título do Aviso</label>
          <input type="text" id="noticeTitle" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Conteúdo</label>
          <textarea id="noticeContent" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:120px;resize:vertical;"></textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prioridade</label>
            <select id="noticePriority" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="baixa">Baixa</option>
              <option value="media" selected>Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tipo</label>
            <select id="noticeType" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="announcement">Anúncio</option>
              <option value="policy">Política</option>
              <option value="maintenance">Manutenção</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Data de Expiração</label>
          <input type="date" id="noticeExpires" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Equipes</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
          <input type="text" id="noticeTeamSearch" placeholder="Buscar equipes..." style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
        <div id="noticeTeamList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${teamsList}
        </div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Projetos</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
          <input type="text" id="noticeProjectSearch" placeholder="Buscar projetos..." style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
        <div id="noticeProjectList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${projectsList}
        </div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Publicar Aviso</button>
        </div>
      </form>
    `
  );

  // busca equipes
  const teamSearch = document.getElementById("noticeTeamSearch");
  if (teamSearch) {
    teamSearch.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll("#noticeTeamList [data-row-team]").forEach(row => {
        const id = Number(row.getAttribute("data-row-team"));
        const name = (teams.find(t => t.id === id)?.name || "").toLowerCase();
        row.style.display = name.includes(q) ? "flex" : "none";
      });
    });
  }

  // busca projetos
  const projSearch = document.getElementById("noticeProjectSearch");
  if (projSearch) {
    projSearch.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll("#noticeProjectList [data-row-project]").forEach(row => {
        const id = Number(row.getAttribute("data-row-project"));
        const name = (projects.find(p => p.id === id)?.name || "").toLowerCase();
        row.style.display = name.includes(q) ? "flex" : "none";
      });
    });
  }

  // submit
  document.getElementById("newNoticeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")) || { name: "Sistema" };
    const teamIds = Array.from(document.querySelectorAll(".noticeTeamChk:checked")).map(c => Number(c.value));
    const projectIds = Array.from(document.querySelectorAll(".noticeProjectChk:checked")).map(c => Number(c.value));

    const newNotice = {
      id: Date.now(),
      title: document.getElementById("noticeTitle").value,
      content: document.getElementById("noticeContent").value,
      priority: document.getElementById("noticePriority").value,
      type: document.getElementById("noticeType").value,
      author: user.name,
      // ✅ usa horário de Brasília (yyyy-mm-dd)
      publishedAt: getDataBrasiliaFormatada(),
      // vem de <input type="date">, já está yyyy-mm-dd
      expiresAt: document.getElementById("noticeExpires").value,
      // vínculos
      teamIds,
      projectIds,
    };

    (window.avisos ||= []);
    window.avisos.push(newNotice);
    localStorage.setItem("avisos", JSON.stringify(window.avisos));

    fecharModal();
    loadAvisosContent();

  });
}


function editNotice(noticeId) {
  const notice = (window.avisos || []).find((n) => n.id === noticeId);
  if (!notice) return;

  const teams = getTeamOptions();
  const projects = getProjectOptions();
  const selTeams = new Set((notice.teamIds || []).map(Number));
  const selProjects = new Set((notice.projectIds || []).map(Number));

  createModal(
    "Editar Aviso",
    `
      <form id="editNoticeForm">
        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Título do Aviso</label>
          <input type="text" id="editNoticeTitle" value="${S_NOTICE(notice.title)}" required
                 style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Conteúdo</label>
          <textarea id="editNoticeContent" required
            style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:120px;resize:vertical;">${S_NOTICE(notice.content)}</textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prioridade</label>
            <select id="editNoticePriority" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="baixa" ${notice.priority==="baixa"?"selected":""}>Baixa</option>
              <option value="media" ${notice.priority==="media"?"selected":""}>Média</option>
              <option value="alta"  ${notice.priority==="alta" ?"selected":""}>Alta</option>
            </select>
          </div>
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tipo</label>
            <select id="editNoticeType" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="announcement" ${notice.type==="announcement"?"selected":""}>Anúncio</option>
              <option value="policy" ${notice.type==="policy"?"selected":""}>Política</option>
              <option value="maintenance" ${notice.type==="maintenance"?"selected":""}>Manutenção</option>
              <option value="urgent" ${notice.type==="urgent"?"selected":""}>Urgente</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Data de Expiração</label>
          <input type="date" id="editNoticeExpires" value="${notice.expiresAt}"
                 required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Equipes</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
          <input type="text" id="editNoticeTeamSearch" placeholder="Buscar equipes..." style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
        <div id="editNoticeTeamList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${
            teams.length
              ? teams.map(t => `
                  <label data-row-team="${t.id}" style="display:flex;align-items:center;gap:0.5rem;">
                    <input type="checkbox" class="editNoticeTeamChk" value="${t.id}" ${selTeams.has(t.id) ? "checked":""}>
                    ${S_NOTICE(t.name)}
                  </label>`).join("")
              : `<div style="color:#6b7280;">Nenhuma equipe cadastrada.</div>`
          }
        </div>

        <div style="margin:1rem 0 0.5rem;font-weight:600;">Projetos</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
          <input type="text" id="editNoticeProjectSearch" placeholder="Buscar projetos..." style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
        <div id="editNoticeProjectList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${
            projects.length
              ? projects.map(p => `
                  <label data-row-project="${p.id}" style="display:flex;align-items:center;gap:0.5rem;">
                    <input type="checkbox" class="editNoticeProjectChk" value="${p.id}" ${selProjects.has(p.id) ? "checked":""}>
                    ${S_NOTICE(p.name)}
                  </label>`).join("")
              : `<div style="color:#6b7280;">Nenhum projeto cadastrado.</div>`
          }
        </div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `
  );

  // buscas
  document.getElementById("editNoticeTeamSearch")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#editNoticeTeamList [data-row-team]").forEach(row => {
      const id = Number(row.getAttribute("data-row-team"));
      const name = (teams.find(t => t.id === id)?.name || "").toLowerCase();
      row.style.display = name.includes(q) ? "flex" : "none";
    });
  });

  document.getElementById("editNoticeProjectSearch")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#editNoticeProjectList [data-row-project]").forEach(row => {
      const id = Number(row.getAttribute("data-row-project"));
      const name = (projects.find(p => p.id === id)?.name || "").toLowerCase();
      row.style.display = name.includes(q) ? "flex" : "none";
    });
  });

  // submit
  document.getElementById("editNoticeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    notice.title = document.getElementById("editNoticeTitle").value;
    notice.content = document.getElementById("editNoticeContent").value;
    notice.priority = document.getElementById("editNoticePriority").value;
    notice.type = document.getElementById("editNoticeType").value;
    notice.expiresAt = document.getElementById("editNoticeExpires").value;

    notice.teamIds = Array.from(document.querySelectorAll(".editNoticeTeamChk:checked")).map(c => Number(c.value));
    notice.projectIds = Array.from(document.querySelectorAll(".editNoticeProjectChk:checked")).map(c => Number(c.value));

    fecharModal();
    loadAvisosContent();
  });
}


// Substitua sua função deleteNotice por esta
async function deleteNotice(noticeId) {
  const confirmar = (typeof confirmarModal === "function")
    ? await confirmarModal({
        title: "Excluir aviso?",
        message: "Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.",
      })
    : window.confirm("Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.");

  if (!confirmar) return;

  const lista = Array.isArray(window.avisos) ? window.avisos : [];
  window.avisos = lista.filter(n => Number(n.id) !== Number(noticeId));
  localStorage.setItem("avisos", JSON.stringify(window.avisos));

  if (typeof loadAvisosContent === "function") {
    loadAvisosContent(); // Refresh avisos
  } else {
    console.warn("loadAvisosContent() não encontrado.");
  }
}


// FIM AVISOS //////////////////////////////////////////////////////////////////////////////////////////////////////

// PERFIL //////////////////////////////////////////////////////////////////////////////////////////////////////////
function getSafeUser() {
  let u = JSON.parse(localStorage.getItem("user") || "{}");
  if (!u || !u.name) {
    // fallback básico caso não exista usuário logado
    u = { name: "Usuário", email: "usuario@example.com", role: "user" };
  }
  // garante campos
  if (!u.createdAt) {
    // guarda "membro desde" (yyyy-mm-dd em São Paulo)
    if (typeof getDataBrasiliaFormatada === "function") {
      u.createdAt = getDataBrasiliaFormatada();
    } else {
      u.createdAt = new Date().toISOString().split("T")[0];
    }
    localStorage.setItem("user", JSON.stringify(u));
  }
  if (!u.settings) u.settings = {};
  if (!u.settings.theme) u.settings.theme = "system"; // system|light|dark
  if (!u.settings.timezone) u.settings.timezone = "America/Sao_Paulo";
  if (typeof u.settings.notifyEmail !== "boolean") u.settings.notifyEmail = true;
  if (typeof u.settings.notifyDesktop !== "boolean") u.settings.notifyDesktop = false;
  return u;
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.removeAttribute("data-theme");
  if (theme === "light" || theme === "dark") {
    root.setAttribute("data-theme", theme);
  }
}

function splitName(fullName="") {
  const parts = String(fullName).trim().split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.length > 1 ? parts.slice(1).join(" ") : ""
  };
}

function joinName(first, last) {
  return [first || "", last || ""].filter(Boolean).join(" ").trim();
}

function getInitials(name="") {
  return String(name).trim().split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase()||"").join("") || "U";
}

function maskPhone(v="") {
  // máscara rapidinha pt-BR (11) 99999-9999
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function pwdStrengthScore(p="") {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 5);
}

function computeUserStats(userOrName) {
  const user = typeof userOrName === "object" ? userOrName : { name: userOrName };
  const name = String(user.name || "").trim().toLowerCase();
  const email = String(user.email || "").trim().toLowerCase();

  const matches = (m) => {
    if (!m) return false;
    if (typeof m === "string") {
      const s = m.trim().toLowerCase();
      return s && (s === name || (email && s === email));
    }
    if (typeof m === "object") {
      const n = String(m.name || "").trim().toLowerCase();
      const e = String(m.email || "").trim().toLowerCase();
      return (n && n === name) || (email && e === email);
    }
    return false;
  };

  const eqs = Array.isArray(window.equipes) ? window.equipes : [];
  const projs = Array.isArray(window.projetos) ? window.projetos : [];
  const tasks = Array.isArray(window.tarefas) ? window.tarefas : [];

  const equipesDoUsuario = eqs.filter(e => Array.isArray(e.members) && e.members.some(matches));

  const projetosDoUsuario = projs.filter(p =>
    (Array.isArray(p.members) && p.members.some(matches)) ||
    (Array.isArray(p.equipe)  && p.equipe.some(matches))  ||
    (matches(p.responsavel)) ||
    (matches(p.owner))
  );

  const tarefasUsuario = tasks.filter(t => matches(t.assignee || t.responsavel || t.atribuidoA));
  const concluidas = tarefasUsuario.filter(t => String(t.status || "").toLowerCase().includes("concl")).length;
  const pendentes = tarefasUsuario.length - concluidas;

  return {
    equipesCount: equipesDoUsuario.length,
    projetosCount: projetosDoUsuario.length,
    tarefasConcluidas: concluidas,
    tarefasPendentes: pendentes,
    equipesDoUsuario,
    projetosDoUsuario
  };
}


function formatarDataPtBR(dataIso="") {
  const [ano, mes, dia] = String(dataIso).split("-");
  if (!ano || !mes || !dia) return dataIso || "";
  return `${dia}/${mes}/${ano}`;
}

function loadPerfilContent() {
  const user = getSafeUser();
  const conteudoPagina = document.getElementById("conteudoPagina");
  const { first, last } = splitName(user.name);
  const stats = computeUserStats(user);

  // aplica tema salvo
  applyTheme(user.settings?.theme || "system");

  const avatarStyle = user.avatarDataUrl
    ? `background-image:url('${user.avatarDataUrl}'); background-size:cover; background-position:center; color:transparent;`
    : "";

  conteudoPagina.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
      <div>
        <h1 style="font-size:2rem;font-weight:bold;color:#000;margin-bottom:0.5rem;">Perfil</h1>
        <p style="color:#666;">Gerencie suas informações pessoais</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns: 1fr 2fr; gap: 2rem; align-items:start;">
      <!-- Coluna Esquerda -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <div style="text-align:center;margin-bottom:1rem;">
          <div id="avatarPreview"
               style="width:6rem;height:6rem;background:#111827;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:2rem;margin:0 auto 1rem;${avatarStyle}">
            ${user.avatarDataUrl ? "" : getInitials(user.name)}
          </div>
          <label class="btn btn-outline" style="cursor:pointer;display:inline-block;">
            Alterar foto
            <input id="avatarInput" type="file" accept="image/*" style="display:none">
          </label>
          ${user.avatarDataUrl ? `<button id="removeAvatarBtn" class="btn btn-outline" style="margin-left:0.5rem;">Remover</button>` : ""}
        </div>

        <h2 style="font-size:1.25rem;font-weight:600;color:#000;margin-bottom:0.25rem;text-align:center;">${user.name}</h2>
        <p style="color:#666;text-align:center;margin-bottom:0.25rem;">${user.email}</p>
        <p style="color:#666;text-align:center;font-size:0.875rem;margin-bottom:1rem;">${typeof cargosLabel === "function" ? cargosLabel(user.role) : (user.role || "Usuário")}</p>

        <div style="display:grid;gap:0.5rem;">
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Status:</span>
            <span style="color:#10b981;">Ativo</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Membro desde:</span>
            <span>${formatarDataPtBR(user.createdAt)}</span>
          </div>
          ${user.lastLoginAt ? `
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Último acesso:</span>
            <span>${formatarDataPtBR(user.lastLoginAt)}</span>
          </div>` : ""}
        </div>

        <!-- Stats Pessoais -->
        <div style="margin-top:1.25rem;">
          <h3 style="font-weight:600;margin-bottom:0.5rem;">Seu resumo</h3>

          <!-- KPIs -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem;">
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Equipes</div>
              <div style="font-weight:700;font-size:1.2rem;">${stats.equipesCount}</div>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Projetos</div>
              <div style="font-weight:700;font-size:1.2rem;">${stats.projetosCount}</div>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Tarefas concl.</div>
              <div style="font-weight:700;font-size:1.2rem;">${stats.tarefasConcluidas}</div>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
              <div style="font-size:0.8rem;color:#6b7280;">Tarefas pend.</div>
              <div style="font-weight:700;font-size:1.2rem;">${stats.tarefasPendentes}</div>
            </div>
          </div>

          <!-- Detalhes do perfil (puxa dos campos) -->
          <div style="border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
            <div style="display:grid;row-gap:0.35rem;font-size:0.9rem;color:#374151;">
              <div><strong>Departamento:</strong> ${user.department || "—"}</div>
              <div><strong>Cargo:</strong> ${user.role || "—"}</div>
              <div><strong>Telefone:</strong> ${user.phone || "—"}</div>
              <div><strong>Fuso horário:</strong> ${(user.settings && user.settings.timezone) || "America/Sao_Paulo"}</div>
              <div><strong>Notificações:</strong>
                ${
                  (user.settings?.notifyEmail ? "E-mail" : "")
                  + (user.settings?.notifyDesktop ? (user.settings?.notifyEmail ? " + Push" : "Push") : "")
                  || "—"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna Direita -->
      <div style="display:grid;gap:1.5rem;">
        <!-- Informações Pessoais -->
        <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
          <h3 style="font-weight:600;margin-bottom:1rem;">Informações Pessoais</h3>
          <form id="profileForm">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome</label>
                <input type="text" id="profileName" value="${first}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Sobrenome</label>
                <input type="text" id="profileLastName" value="${last}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">E-mail</label>
                <input type="email" id="profileEmail" value="${user.email}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Telefone</label>
                <input type="tel" id="profilePhone" value="${user.phone || ""}" placeholder="(11) 99999-9999" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Departamento</label>
                <select id="profileDepartment" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                  <option value="">Selecione</option>
                  ${["desenvolvimento","design","marketing","vendas","rh","financeiro"]
                    .map(dep => `<option value="${dep}" ${user.department===dep?"selected":""}>${dep[0].toUpperCase()+dep.slice(1)}</option>`).join("")}
                </select>
              </div>
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Cargo</label>
                <input type="text" id="profileRole" value="${user.role || ""}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
            </div>

            <div style="margin-bottom:1rem;">
              <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Bio</label>
              <textarea id="profileBio" placeholder="Conte um pouco sobre você..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;">${user.bio || ""}</textarea>
            </div>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:1rem 0;">

            <!-- Segurança -->
            <h4 style="font-weight:600;margin-bottom:0.75rem;">Segurança</h4>
            <div style="display:grid;gap:1rem;margin-bottom:1rem;">
              <div>
                <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Senha Atual</label>
                <input type="password" id="currentPassword" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                  <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nova Senha</label>
                  <div style="display:flex;gap:0.5rem;">
                    <input type="password" id="newPassword" style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                    <button type="button" id="togglePwd" class="btn btn-outline">Mostrar</button>
                  </div>
                  <div style="height:6px;background:#e5e7eb;border-radius:999px;margin-top:0.5rem;overflow:hidden;">
                    <div id="pwdBar" style="height:100%;width:0%;background:#ef4444;"></div>
                  </div>
                  <div id="pwdTip" style="font-size:0.8rem;color:#6b7280;margin-top:0.25rem;"></div>
                </div>
                <div>
                  <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Confirmar Nova Senha</label>
                  <input type="password" id="confirmNewPassword" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                </div>
              </div>
            </div>

            <div style="display:flex;gap:1rem;justify-content:flex-end;">
              <button type="button" id="cancelProfileBtn" class="btn btn-outline">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  setupProfileFunctionality();
}

function setupProfileFunctionality() {
  const user = getSafeUser();

  // avatar upload
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");
  if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        user.avatarDataUrl = reader.result;
        localStorage.setItem("user", JSON.stringify(user));
        loadPerfilContent();
      };
      reader.readAsDataURL(f);
    });
  }
  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener("click", () => {
      delete user.avatarDataUrl;
      localStorage.setItem("user", JSON.stringify(user));
      loadPerfilContent();
    });
  }

  // máscara telefone
  const phoneEl = document.getElementById("profilePhone");
  if (phoneEl) {
    phoneEl.addEventListener("input", () => {
      phoneEl.value = maskPhone(phoneEl.value);
    });
  }

  // força da senha
  const newPwdEl = document.getElementById("newPassword");
  const bar = document.getElementById("pwdBar");
  const tip = document.getElementById("pwdTip");
  const togglePwd = document.getElementById("togglePwd");
  if (togglePwd && newPwdEl) {
    togglePwd.addEventListener("click", () => {
      const t = newPwdEl.getAttribute("type") === "password" ? "text" : "password";
      newPwdEl.setAttribute("type", t);
      togglePwd.textContent = t === "password" ? "Mostrar" : "Ocultar";
    });
  }
  if (newPwdEl && bar && tip) {
    const updateStrength = () => {
      const s = pwdStrengthScore(newPwdEl.value);
      const pct = (s / 5) * 100;
      bar.style.width = pct + "%";
      bar.style.background = s >= 4 ? "#10b981" : s >= 3 ? "#f59e0b" : "#ef4444";
      tip.textContent = s >= 4 ? "Senha forte" : s >= 3 ? "Senha média" : "Use 8+ caracteres, maiúsculas, números e símbolos";
    };
    newPwdEl.addEventListener("input", updateStrength);
    updateStrength();
  }

  // cancelar
  document.getElementById("cancelProfileBtn")?.addEventListener("click", () => {
    loadPerfilContent();
  });

  // submit
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const first = document.getElementById("profileName").value.trim();
      const last  = document.getElementById("profileLastName").value.trim();
      const name = joinName(first, last);

      const email = document.getElementById("profileEmail").value.trim();
      const phone = document.getElementById("profilePhone").value.trim();
      const department = document.getElementById("profileDepartment").value;
      const role = document.getElementById("profileRole").value.trim();
      const bio = document.getElementById("profileBio").value.trim();
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword = document.getElementById("confirmNewPassword").value;

      // valida senha (opcional)
      if (newPassword || confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          alert("As senhas não coincidem");
          return;
        }
        if (newPassword.length < 8) {
          alert("A nova senha deve ter pelo menos 8 caracteres");
          return;
        }
        // aqui você faria a chamada de API para trocar senha; localmente só ignoramos.
      }

      // atualiza usuário
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone;
      user.department = department || "";
      user.role = role || user.role;
      user.bio = bio;

      localStorage.setItem("user", JSON.stringify(user));
      applyTheme(user.settings?.theme || "system");

      alert("Perfil atualizado com sucesso!");
      loadPerfilContent();
    });
  }
}

// FIM PERFIL //////////////////////////////////////////////////////////////////////////////////////////////////////

// CONFIGURAÇÕES ///////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers (usam os já existentes se houver)
const _getUser = typeof getSafeUser === "function"
  ? getSafeUser
  : () => {
      let u = JSON.parse(localStorage.getItem("user") || "{}");
      if (!u || !u.name) u = { name: "Usuário", email: "usuario@example.com", role: "user" };
      if (!u.settings) u.settings = {};
      if (!u.settings.theme) u.settings.theme = "system";
      if (!u.settings.fontSize) u.settings.fontSize = "medium";
      if (!u.settings.timezone) u.settings.timezone = "America/Sao_Paulo";
      if (typeof u.settings.notifyEmail !== "boolean") u.settings.notifyEmail = true;
      if (typeof u.settings.notifyDesktop !== "boolean") u.settings.notifyDesktop = false;
      if (typeof u.settings.sound !== "boolean") u.settings.sound = false;
      if (typeof u.settings.publicProfile !== "boolean") u.settings.publicProfile = true;
      if (typeof u.settings.onlineStatus !== "boolean") u.settings.onlineStatus = true;
      localStorage.setItem("user", JSON.stringify(u));
      return u;
    };

const _applyTheme = typeof applyTheme === "function"
  ? applyTheme
  : (theme) => {
      const root = document.documentElement;
      root.removeAttribute("data-theme");
      if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
    };

function applyFontSize(size) {
  // small 93.75% (15px), medium 100% (16px), large 112.5% (18px) — ajuste à vontade
  const map = { small: "93.75%", medium: "100%", large: "112.5%" };
  document.documentElement.style.fontSize = map[size] || "100%";
}

// Beep simples para testar som
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    o.start();
    setTimeout(() => { g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02); o.stop(ctx.currentTime + 0.04); }, 180);
  } catch {}
}

function loadConfiguracoesContent() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  const user = _getUser();
  // aplica preferências atuais
  _applyTheme(user.settings.theme);
  applyFontSize(user.settings.fontSize);

  conteudoPagina.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
      <div>
        <h1 style="font-size:2rem;font-weight:bold;color:#000;margin-bottom:0.5rem;">Configurações</h1>
        <p style="color:#666;">Personalize sua experiência no Kontrollar</p>
      </div>
    </div>

    <div style="display:grid;gap:1.5rem;">
      <!-- Aparência -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Aparência</h3>
        <div style="display:grid;gap:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tema</label>
            <select id="themeSelect" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="system" ${user.settings.theme==="system"?"selected":""}>Seguir o sistema</option>
              <option value="light"  ${user.settings.theme==="light" ?"selected":""}>Claro</option>
              <option value="dark"   ${user.settings.theme==="dark"  ?"selected":""}>Escuro</option>
            </select>
          </div>
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Tamanho da Fonte</label>
            <select id="fontSizeSelect" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="small"  ${user.settings.fontSize==="small" ?"selected":""}>Pequena</option>
              <option value="medium" ${user.settings.fontSize==="medium"?"selected":""}>Média</option>
              <option value="large"  ${user.settings.fontSize==="large" ?"selected":""}>Grande</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notificações -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Notificações</h3>
        <div style="display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Notificações por E-mail</h4>
              <p style="color:#666;font-size:0.875rem;">Receba notificações importantes por e-mail</p>
            </div>
            <input type="checkbox" id="emailNotifications" ${user.settings.notifyEmail ? "checked": ""}>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Notificações Push</h4>
              <p style="color:#666;font-size:0.875rem;">Receba notificações no navegador</p>
            </div>
            <input type="checkbox" id="pushNotifications" ${user.settings.notifyDesktop ? "checked": ""}>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Sons de Notificação</h4>
              <p style="color:#666;font-size:0.875rem;">Reproduzir som quando chegar algo novo</p>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <button id="testSoundBtn" class="btn btn-outline">Testar som</button>
              <input type="checkbox" id="soundNotifications" ${user.settings.sound ? "checked": ""}>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacidade -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Privacidade</h3>
        <div style="display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Perfil Público</h4>
              <p style="color:#666;font-size:0.875rem;">Permitir que outros usuários vejam seu perfil</p>
            </div>
            <input type="checkbox" id="publicProfile" ${user.settings.publicProfile ? "checked": ""}>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Status Online</h4>
              <p style="color:#666;font-size:0.875rem;">Mostrar quando você está online</p>
            </div>
            <input type="checkbox" id="onlineStatus" ${user.settings.onlineStatus ? "checked": ""}>
          </div>
        </div>
      </div>

      <!-- Sistema -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Sistema</h3>
        <div style="display:grid;gap:1rem;">
          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Idioma</label>
            <select id="languageSelect" style="width:100%;max-width:220px;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <option value="pt-BR" selected>Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div>
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Fuso Horário</label>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <input type="text" id="timezoneSelect" value="${user.settings.timezone}" placeholder="Ex.: America/Sao_Paulo" style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
              <button id="detectTZ" class="btn btn-outline">Detectar</button>
            </div>
            <p style="color:#6b7280;font-size:0.8rem;margin-top:0.25rem;">Use um ID IANA (ex.: America/Sao_Paulo). Isso ajuda nas datas.</p>
          </div>
        </div>
      </div>

      <!-- Dados -->
      <div style="background:#fff;border-radius:0.5rem;border:1px solid #e5e7eb;padding:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:1rem;">Gerenciamento de Dados</h3>
        <div style="display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Exportar Dados</h4>
              <p style="color:#666;font-size:0.875rem;">Baixar uma cópia (JSON) de usuário, equipes, projetos, tarefas e avisos</p>
            </div>
            <button id="exportBtn" class="btn btn-outline">Exportar</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;">Limpar Cache</h4>
              <p style="color:#666;font-size:0.875rem;">Zerar dados selecionados do armazenamento local</p>
              <div style="display:flex;gap:0.75rem;margin-top:0.5rem;flex-wrap:wrap;">
                <label><input type="checkbox" class="cc" value="equipes"> Equipes</label>
                <label><input type="checkbox" class="cc" value="projetos"> Projetos</label>
                <label><input type="checkbox" class="cc" value="tarefas"> Tarefas</label>
                <label><input type="checkbox" class="cc" value="avisos"> Avisos</label>
                <label><input type="checkbox" class="cc" value="settings"> Configurações</label>
              </div>
            </div>
            <button id="clearBtn" class="btn btn-outline">Limpar</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid #e5e7eb;">
            <div>
              <h4 style="font-weight:500;margin-bottom:0.25rem;color:#dc2626;">Excluir Conta</h4>
              <p style="color:#666;font-size:0.875rem;">Remove todos os dados e sai do app</p>
            </div>
            <button class="btn btn-outline" style="color:#dc2626;border-color:#dc2626;" onclick="confirmDeleteAccount()">Excluir</button>
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;">
        <button id="saveSettings" class="btn btn-primary">Salvar Configurações</button>
      </div>
    </div>
  `;

  setupSettingsFunctionality();
}

function setupSettingsFunctionality() {
  const user = _getUser();

  // Live-preview de tema e fonte
  document.getElementById("themeSelect")?.addEventListener("change", (e) => {
    _applyTheme(e.target.value);
  });
  document.getElementById("fontSizeSelect")?.addEventListener("change", (e) => {
    applyFontSize(e.target.value);
  });

  // Detectar fuso horário
  document.getElementById("detectTZ")?.addEventListener("click", () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
    const tzEl = document.getElementById("timezoneSelect");
    if (tzEl) tzEl.value = tz;
  });

  // Testar som
  document.getElementById("testSoundBtn")?.addEventListener("click", playBeep);

  // Solicitar permissão de push quando marcar
  const pushEl = document.getElementById("pushNotifications");
  if (pushEl) {
    pushEl.addEventListener("change", async (e) => {
      if (e.target.checked && "Notification" in window) {
        try {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") {
            alert("Permissão de notificação negada pelo navegador.");
            e.target.checked = false;
          }
        } catch {
          e.target.checked = false;
        }
      }
    });
  }

  // Salvar
  document.getElementById("saveSettings")?.addEventListener("click", () => {
    const theme = document.getElementById("themeSelect").value;
    const fontSize = document.getElementById("fontSizeSelect").value;
    const notifyEmail = document.getElementById("emailNotifications").checked;
    const notifyDesktop = document.getElementById("pushNotifications").checked;
    const sound = document.getElementById("soundNotifications").checked;
    const publicProfile = document.getElementById("publicProfile").checked;
    const onlineStatus = document.getElementById("onlineStatus").checked;
    const language = document.getElementById("languageSelect").value;
    const timezone = document.getElementById("timezoneSelect").value.trim() || "America/Sao_Paulo";

    user.settings = {
      ...user.settings,
      theme,
      fontSize,
      notifyEmail,
      notifyDesktop,
      sound,
      publicProfile,
      onlineStatus,
      language,
      timezone,
    };

    localStorage.setItem("user", JSON.stringify(user));

    // aplica imediatamente
    applyTheme(user.settings?.theme || "system");
    applyFontSize(fontSize);

    alert("Configurações salvas com sucesso!");
  });

  // Exportar
  document.getElementById("exportBtn")?.addEventListener("click", () => {
    const payload = {
      savedAt: new Date().toISOString(),
      user: _getUser(),
      equipes: window.equipes || JSON.parse(localStorage.getItem("equipes") || "[]"),
      projetos: window.projetos || JSON.parse(localStorage.getItem("projetos") || "[]"),
      tarefas: window.tarefas || JSON.parse(localStorage.getItem("tarefas") || "[]"),
      avisos: window.avisos || JSON.parse(localStorage.getItem("avisos") || "[]"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const y = new Date();
    const ymd = `${y.getFullYear()}${String(y.getMonth()+1).padStart(2,"0")}${String(y.getDate()).padStart(2,"0")}`;
    a.href = url;
    a.download = `kontrollar-backup-${ymd}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Limpar cache seletivo
  document.getElementById("clearBtn")?.addEventListener("click", () => {
    const checks = Array.from(document.querySelectorAll(".cc:checked")).map(c => c.value);
    if (!checks.length) {
      alert("Selecione pelo menos um item para limpar.");
      return;
    }
    if (!confirm("Tem certeza que deseja limpar os dados selecionados?")) return;

    if (checks.includes("equipes")) { localStorage.removeItem("equipes"); window.equipes = []; }
    if (checks.includes("projetos")) { localStorage.removeItem("projetos"); window.projetos = []; }
    if (checks.includes("tarefas")) { localStorage.removeItem("tarefas"); window.tarefas = []; }
    if (checks.includes("avisos")) { localStorage.removeItem("avisos"); window.avisos = []; }
    if (checks.includes("settings")) {
      // só reseta settings, mantém user básico
      const u = _getUser();
      u.settings = {}; // será reidratado com defaults
      localStorage.setItem("user", JSON.stringify(u));
    }

    alert("Dados limpos.");
  });
}

function confirmDeleteAccount() {
  if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) return;
  if (!confirm("Última confirmação: deseja mesmo excluir TUDO?")) return;

  // Limpa tudo e volta pra index
  localStorage.clear();
  alert("Conta excluída com sucesso.");
  window.location.href = "index.html";
}

// FIM CONFIGURAÇÕES //////////////////////////////////////////////////////////////////////////////////////////////////

function gerarCardsProjetos() {
  return gerarArrayProjetosCards(projetos);
}

function gerarCardsTarefas() {
  return gerarArrayCardsTarefas(tarefas);
}
