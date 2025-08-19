const S_NOTICE = typeof sanitizeHTML === "function"
  ? sanitizeHTML
  : (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

window.equipes  = window.equipes  || JSON.parse(localStorage.getItem("equipes")  || "[]");
window.projetos = window.projetos || JSON.parse(localStorage.getItem("projetos") || "[]");
window.avisos   = window.avisos   || JSON.parse(localStorage.getItem("avisos")   || "[]");

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
  document.querySelectorAll(".edit-notice-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noticeId = Number.parseInt(
        e.target.closest("[data-notice-id]").getAttribute("data-notice-id")
      );
      editNotice(noticeId);
    });
  });

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
      publishedAt: getDataBrasiliaFormatada(),
      expiresAt: document.getElementById("noticeExpires").value,
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
    loadAvisosContent();
  } else {
    console.warn("loadAvisosContent() não encontrado.");
  }
}