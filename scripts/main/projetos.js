/* ===== API base ===== */
const API = window.API_BASE || "http://127.0.0.1:3333";

/* ===== Helpers gerais ===== */
const S_PROJ =
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

// ===== DATA: normaliza yyyy-mm-dd ou ISO para dd/mm/aaaa
function formatDateBR(input) {
  if (!input) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = String(input).split("-");
    return `${d}/${m}/${y}`;
  }
  // ISO/Date -> formata sem “estourar” fuso
  const dt = new Date(input);
  if (isNaN(dt)) return String(input);
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const yy = dt.getUTCFullYear();
  return `${dd}/${mm}/${yy}`;
}

function toInputDate(v) {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // dd/mm/aaaa -> yyyy-mm-dd
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(v));
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  // ISO/Date -> yyyy-mm-dd (sem estourar fuso)
  const d = new Date(v);
  if (!isNaN(d)) {
    const y = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  return "";
}

function getDisplayName(u) {
  if (!u) return "";
  // compatível com /users (nome+sobrenome) e /users/search (name)
  const nm = (u.name ?? `${u.nome ?? ""} ${u.sobrenome ?? ""}`.trim()).trim();
  return nm || u.email || `#${u.id}`;
}

/* ===== Mapeamentos UI <-> DB =====
   UI status (selects/cards) usa minúsculo+hífen.
   DB usa texto com acento/maiúsculas (CHECK/ENUM).
*/
const STATUS_UI_TO_DB = {
  planejamento: "Planejamento",
  "em-andamento": "Em Andamento",
  "em-desenvolvimento": "Em Desenvolvimento",
  "quase-concluido": "Quase Concluído",
  concluido: "Concluído",
};
const STATUS_DB_TO_UI = Object.fromEntries(
  Object.entries(STATUS_UI_TO_DB).map(([k, v]) => [v, k])
);

const PRIORITY_UI_TO_DB = { baixa: "Baixa", media: "Média", alta: "Alta" };
const PRIORITY_DB_TO_UI = { Baixa: "baixa", Média: "media", Alta: "alta" };

/* ===== Cache em memória ===== */
window.projetos = []; // lista renderizada
let _usersCache = []; // [{id,name,email,cargo}]
let _statusOptions = []; // ["Planejamento",...]
let _priorityOptions = []; // ["Baixa","Média","Alta"]

/* ===== Requests ===== */
async function apiGet(path, params) {
  const url = new URL(API + path, location.origin);
  if (params)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url, { credentials: "include" });
  if (!r.ok) throw new Error(await r.text().catch(() => r.statusText));
  return r.json();
}
async function apiJSON(path, method, body) {
  const r = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body || {}),
  });
  if (!r.ok) throw new Error(await r.text().catch(() => r.statusText));
  return r.json();
}

/* ===== Users (gestor/membros) ===== */
async function loadAllUsers() {
  // para selects iniciais
  _usersCache = await apiGet("/users");
  return _usersCache.map((u) => ({
    id: u.id,
    name: `${u.nome} ${u.sobrenome}`.trim(),
    email: u.email,
    cargo: u.cargo,
  }));
}
async function searchUsers(q = "", limit = 20) {
  // busca incremental para lista de membros
  const data = await apiGet("/users/search", { q, limit });
  return data.map((u) => ({
    id: u.id,
    name: u.name || `${u.nome || ""} ${u.sobrenome || ""}`.trim(),
    email: u.email,
    cargo: u.cargo,
  }));
}
function userNameById(id) {
  const u = _usersCache.find((x) => Number(x.id) === Number(id));
  return u ? `${u.nome} ${u.sobrenome}`.trim() : "—";
}

/* ===== Options (status/prioridade) ===== */
async function loadOptions() {
  try {
    _statusOptions = await apiGet("/options/status"); // ["Planejamento", ...]
    _priorityOptions = await apiGet("/options/priority"); // ["Baixa","Média","Alta"]
  } catch {
    _statusOptions = Object.values(STATUS_UI_TO_DB);
    _priorityOptions = Object.values(PRIORITY_UI_TO_DB);
  }
}

/* ===== Projects ===== */
function dbProjectToUI(row) {
  // row: { id, name, description, status, priority, progress_pct, deadline, manager_id, created_at, updated_at, manager_name? }
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    status: STATUS_DB_TO_UI[row.status] || row.status, // para selects/cards
    priority:
      PRIORITY_DB_TO_UI[row.priority] || (row.priority || "").toLowerCase(),
    progress: Number(row.progress_pct || 0),
    deadline: row.deadline, // yyyy-mm-dd
    gestor_id: row.manager_id, // id
    gestor: row.manager_name || userNameById(row.manager_id),
    equipe: [], // será preenchida quando abrir detalhes (members)
    createdAt: row.created_at?.slice?.(0, 10) || "",
  };
}
function uiToDbPayload(p) {
  return {
    name: p.name,
    description: p.description || null,
    status: STATUS_UI_TO_DB[p.status] || "Planejamento",
    priority: PRIORITY_UI_TO_DB[p.priority] || "Média",
    progress_pct: Number(p.progress || 0),
    deadline: p.deadline || null,
    manager_id: Number(p.gestor_id),
  };
}

async function fetchProjects() {
  const rows = await apiGet("/projects", { limit: 200, offset: 0 });
  window.projetos = rows.map(dbProjectToUI);
  renderProjetosGrid();
}
async function fetchProjectWithMembers(id) {
  const data = await apiGet(`/projects/${id}`);
  const ui = dbProjectToUI(data);
  ui.equipe = Array.isArray(data.members)
    ? data.members.map((m) => m.name || `${m.id}`) // para chips; abaixo também teremos ids
    : [];
  ui.member_ids = Array.isArray(data.members)
    ? data.members.map((m) => Number(m.id))
    : [];
  return ui;
}
async function createProjectAndMembers(uiProject, memberIds) {
  const created = await apiJSON("/projects", "POST", uiToDbPayload(uiProject));
  if (Array.isArray(memberIds) && memberIds.length) {
    await apiJSON(`/projects/${created.id}/members`, "PUT", {
      user_ids: memberIds,
    });
  }
  return created.id;
}
async function updateProjectAndMembers(id, uiProject, memberIds) {
  await apiJSON(`/projects/${id}`, "PUT", uiToDbPayload(uiProject));
  await apiJSON(`/projects/${id}/members`, "PUT", {
    user_ids: memberIds || [],
  });
}

/* ===== UI ===== */
function carregarConteudoProjetos() {
  const conteudoPagina = document.getElementById("conteudoPagina");
  conteudoPagina.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
      <div>
        <h1 style="font-size:2rem;font-weight:bold;color:#000;margin-bottom:0.5rem;">Projetos</h1>
        <p style="color:#666;">Gerencie todos os seus projetos em um só lugar</p>
      </div>
      <button id="newProjectBtn" class="btn btn-primary">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>
        Novo Projeto
      </button>
    </div>

    <div style="margin-bottom:2rem;">
      <div style="display:flex;gap:1rem;margin-bottom:1rem;">
        <div style="position:relative;flex:1;">
          <svg style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);width:1rem;height:1rem;color:#9ca3af;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input id="projectSearch" type="text" placeholder="Buscar projetos..." style="width:100%;padding:0.5rem 0.75rem 0.5rem 2.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
        <select id="projectStatusFilter" style="padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
          <option value="todos">Todos os Status</option>
          <option value="planejamento">Planejamento</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="em-desenvolvimento">Em Desenvolvimento</option>
          <option value="quase-concluido">Quase Concluído</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>
    </div>

    <div id="projetosGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;"></div>
  `;

  setupProjetosPage();
  // boot: carrega opções + usuários + projetos
  (async () => {
    try {
      await loadOptions();
      await loadAllUsers();
      await fetchProjects();
    } catch (e) {
      console.error(e);
      if (typeof showToast === "function")
        showToast("Falha ao carregar projetos.");
    }
  })();
}

function setupProjetosPage() {
  document
    .getElementById("newProjectBtn")
    ?.addEventListener("click", mostrarModalProjetoNovo);
  document
    .getElementById("projectSearch")
    ?.addEventListener("input", filterProjetos);
  document
    .getElementById("projectStatusFilter")
    ?.addEventListener("change", filterProjetos);
}

function renderProjetosGrid() {
  const grid = document.getElementById("projetosGrid");
  if (!grid) return;
  grid.innerHTML = gerarArrayProjetosCards(window.projetos || []);
  configAcoesCardProjetos();
}

function filterProjetos() {
  const searchTerm = (
    document.getElementById("projectSearch")?.value || ""
  ).toLowerCase();
  const statusFilter =
    document.getElementById("projectStatusFilter")?.value || "todos";

  const filtered = (window.projetos || []).filter((p) => {
    const matchesSearch =
      String(p.name || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(p.description || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(p.gestor || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (Array.isArray(p.equipe) &&
        p.equipe.some((m) => String(m).toLowerCase().includes(searchTerm)));
    const matchesStatus = statusFilter === "todos" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const grid = document.getElementById("projetosGrid");
  if (grid) {
    grid.innerHTML = gerarArrayProjetosCards(filtered);
    configAcoesCardProjetos();
  }
}

function configAcoesCardProjetos() {
  document.querySelectorAll(".edit-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      await editarProjetos(projectId);
    });
  });

  document.querySelectorAll(".view-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      await viewProjectDetails(projectId);
    });
  });

  document.querySelectorAll(".delete-projetos-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const projectId = Number.parseInt(
        e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id")
      );
      await deletarProjeto(projectId);
    });
  });
}

/* ===== Modais ===== */
async function mostrarModalProjetoNovo() {
  const users = await loadAllUsers();

  createModal(
    "Criar Novo Projeto",
    `
    <form id="newProjectForm">
      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome do Projeto</label>
        <input type="text" id="projectName" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
        <textarea id="projectDescription" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Status</label>
          <select id="projectStatus" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            ${Object.entries(STATUS_UI_TO_DB)
              .slice(0, 3)
              .map(
                ([ui, label]) =>
                  `<option value="${ui}">${S_PROJ(label)}</option>`
              )
              .join("")}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prioridade</label>
          <select id="projectPriority" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            ${_priorityOptions
              .map(
                (p) =>
                  `<option value="${PRIORITY_DB_TO_UI[p]}">${S_PROJ(
                    p
                  )}</option>`
              )
              .join("")}
          </select>
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prazo</label>
        <input type="date" id="projectDeadline" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Gestor</label>
          <select id="projectManager" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="">Selecione</option>
            ${users
              .map(
                (u) =>
                  `<option value="${u.id}">${S_PROJ(
                    `${u.nome} ${u.sobrenome}`
                  )}</option>`
              )
              .join("")}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Buscar membros</label>
          <input type="text" id="projectMemberSearch" placeholder="Digite para filtrar..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <div id="projectMembersList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${
            users.length
              ? users
                  .map(
                    (u) => `
                <label data-row-member="${S_PROJ(
                  `${u.nome} ${u.sobrenome}`
                )}" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
                  <input type="checkbox" class="projectMemberChk" value="${
                    u.id
                  }"> ${S_PROJ(`${u.nome} ${u.sobrenome}`)}
                </label>
              `
                  )
                  .join("")
              : `<div style="color:#6b7280;">Sem usuários cadastrados.</div>`
          }
        </div>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Criar Projeto</button>
      </div>
    </form>
  `
  );

  setTimeout(() => {
    const search = document.getElementById("projectMemberSearch");
    if (search) {
      let last = 0;
      search.addEventListener("input", async (e) => {
        const now = Date.now();
        if (now - last < 200) return; // debounce leve
        last = now;
        const q = e.target.value.trim();
        const list = document.getElementById("projectMembersList");
        const results = await searchUsers(q);
        list.innerHTML = results
          .map(
            (u) => `
          <label data-row-member="${S_PROJ(
            u.name
          )}" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
            <input type="checkbox" class="projectMemberChk" value="${
              u.id
            }"> ${S_PROJ(u.name)}
          </label>`
          )
          .join("");
      });
    }

    const form = document.getElementById("newProjectForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("projectName").value;
      const description = document.getElementById("projectDescription").value;
      const status = document.getElementById("projectStatus").value; // ui
      const priority = document.getElementById("projectPriority").value; // ui
      const deadline = document.getElementById("projectDeadline").value;
      const gestor_id = Number(document.getElementById("projectManager").value);
      const memberIds = Array.from(
        document.querySelectorAll(".projectMemberChk:checked")
      ).map((c) => Number(c.value));

      if (!gestor_id) {
        if (typeof showToast === "function") showToast("Selecione um gestor.");
        return;
      }

      try {
        const uiProj = {
          name,
          description,
          status,
          priority,
          deadline,
          progress: 0,
          gestor_id,
        };
        const newId = await createProjectAndMembers(uiProj, memberIds);

        if (typeof Notifs?.notify === "function") {
          Notifs.notify({
            title: "Novo projeto",
            message: `${name} criado`,
            type: "success",
            payload: { page: "projetos", projectId: newId },
            onClick: () => {
              definirPaginaAtiva("projetos");
              carregarConteudoPagina("projetos");
            },
          });
        } else if (typeof showToast === "function")
          showToast("Projeto criado!");

        fecharModal();
        await fetchProjects();
      } catch (err) {
        console.error(err);
        if (typeof showToast === "function")
          showToast("Erro ao criar projeto.");
      }
    });
  }, 0);
}

async function editarProjetos(projectId) {
  // busca projeto completo (com membros)
  const p = await fetchProjectWithMembers(projectId);

  const users = await loadAllUsers();
  const selectedIds = new Set(p.member_ids || []);

  createModal(
    "Editar Projeto",
    `
    <form id="editProjectForm">
      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome do Projeto</label>
        <input type="text" id="editProjectName" value="${S_PROJ(
          p.name
        )}" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
        <textarea id="editProjectDescription" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;">${S_PROJ(
          p.description || ""
        )}</textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Status</label>
          <select id="editProjectStatus" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            ${Object.entries(STATUS_UI_TO_DB)
              .map(
                ([ui, label]) =>
                  `<option value="${ui}" ${
                    p.status === ui ? "selected" : ""
                  }>${S_PROJ(label)}</option>`
              )
              .join("")}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prioridade</label>
          <select id="editProjectPriority" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            ${_priorityOptions
              .map((opt) => {
                const ui = PRIORITY_DB_TO_UI[opt];
                return `<option value="${ui}" ${
                  p.priority === ui ? "selected" : ""
                }>${S_PROJ(opt)}</option>`;
              })
              .join("")}
          </select>
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Progresso (%)</label>
        <input type="number" id="editProjectProgress" value="${Number(
          p.progress || 0
        )}" min="0" max="100" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="margin-bottom:1rem%;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prazo</label>
        <input type="date" id="editProjectDeadline" value="${toInputDate(
          p.deadline
        )}" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Gestor</label>
          <select id="editProjectManager" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="">Selecione</option>
            ${users
              .map(
                (u) =>
                  `<option value="${u.id}" ${
                    Number(p.gestor_id) === Number(u.id) ? "selected" : ""
                  }>${S_PROJ(getDisplayName(u))}</option>`
              )
              .join("")}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Buscar membros</label>
          <input type="text" id="editProjectMemberSearch" placeholder="Digite para filtrar..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <div id="editProjectMembersList" style="max-height:200px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
${
  users.length
    ? users
        .map((u) => {
          const dn = getDisplayName(u);
          return `
       <label data-row-member="${S_PROJ(
         dn
       )}" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
         <input type="checkbox" class="editProjectMemberChk" value="${u.id}" ${
            selectedIds.has(Number(u.id)) ? "checked" : ""
          }>
          ${S_PROJ(dn)}
        </label>`;
        })
        .join("")
    : `<div style="color:#6b7280;">Sem usuários cadastrados.</div>`
}
        </div>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;">
        <button type="button" onclick="fecharModal()" class="btn btn-outline">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
    `
  );

  setTimeout(() => {
    document
      .getElementById("editProjectMemberSearch")
      ?.addEventListener("input", async (e) => {
        const q = e.target.value.trim();
        const list = document.getElementById("editProjectMembersList");
        const results = await searchUsers(q);
        list.innerHTML = results
          .map(
            (u) => `
        <label data-row-member="${S_PROJ(
          u.name
        )}" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
          <input type="checkbox" class="editProjectMemberChk" value="${u.id}" ${
              selectedIds.has(Number(u.id)) ? "checked" : ""
            }>
          ${S_PROJ(u.name)}
        </label>`
          )
          .join("");
      });

    document
      .getElementById("editProjectForm")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const up = {
          name: document.getElementById("editProjectName").value,
          description: document.getElementById("editProjectDescription").value,
          status: document.getElementById("editProjectStatus").value,
          priority: document.getElementById("editProjectPriority").value,
          progress: Number(
            document.getElementById("editProjectProgress").value || 0
          ),
          deadline: document.getElementById("editProjectDeadline").value,
          gestor_id: Number(
            document.getElementById("editProjectManager").value
          ),
        };
        const memberIds = Array.from(
          document.querySelectorAll(".editProjectMemberChk:checked")
        ).map((c) => Number(c.value));

        if (!up.gestor_id) {
          if (typeof showToast === "function")
            showToast("Selecione um gestor.");
          return;
        }

        try {
          await updateProjectAndMembers(projectId, up, memberIds);
          fecharModal();
          await fetchProjects();
          if (typeof showToast === "function") showToast("Projeto atualizado!");
        } catch (err) {
          console.error(err);
          if (typeof showToast === "function")
            showToast("Erro ao salvar projeto.");
        }
      });
  }, 0);
}

async function viewProjectDetails(projectId) {
  const projeto = await fetchProjectWithMembers(projectId);

  const projectTasks = (window.tarefas || []).filter(
    (t) => t.projetos === projeto.name
  );
  const chips = (projeto.equipe || [])
    .map(
      (n) =>
        `<span style="background:#eef2ff;color:#3730a3;padding:0.125rem 0.5rem;border-radius:999px;font-size:0.75rem;margin-right:0.25rem;display:inline-block">${S_PROJ(
          n
        )}</span>`
    )
    .join("");

  createModal(
    `Detalhes do Projeto: ${S_PROJ(projeto.name)}`,
    `
    <div style="max-height:400px;overflow-y:auto;">
      <div style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:0.5rem;">Informações Gerais</h3>
        <p style="margin-bottom:0.5rem;"><strong>Descrição:</strong> ${S_PROJ(
          projeto.description || ""
        )}</p>
        <p style="margin-bottom:0.5rem;"><strong>Status:</strong> ${getStatusLabel(
          projeto.status
        )}</p>
        <p style="margin-bottom:0.5rem;"><strong>Prioridade:</strong> ${S_PROJ(
          projeto.priority || ""
        )}</p>
        <p style="margin-bottom:0.5rem;"><strong>Progresso:</strong> ${Number(
          projeto.progress || 0
        )}%</p>
        <p style="margin-bottom:0.5rem;"><strong>Prazo:</strong> ${formatDateBR(
          projeto.deadline
        )}</p>
        <p style="margin-bottom:0.5rem;"><strong>Gestor:</strong> ${S_PROJ(
          projeto.gestor || userNameById(projeto.gestor_id) || "—"
        )}</p>
        <div style="margin-bottom:0.5rem;"><strong>Membros:</strong> ${
          (projeto.equipe || []).length
        }</div>
        <div>${
          chips || "<span style='color:#6b7280;'>Nenhum membro</span>"
        }</div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:0.5rem;">Progresso</h3>
        <div style="width:100%;background:#e5e7eb;border-radius:0.25rem;height:0.75rem;">
          <div style="background:#000;height:100%;border-radius:0.25rem;width:${Number(
            projeto.progress || 0
          )}%;"></div>
        </div>
      </div>

      <div>
        <h3 style="font-weight:600;margin-bottom:0.5rem;">Tarefas Relacionadas (${
          projectTasks.length
        })</h3>
        ${
          projectTasks.length
            ? projectTasks
                .map(
                  (task) => `
              <div style="padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.375rem;margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <h4 style="font-weight:500;margin-bottom:0.25rem;">${S_PROJ(
                    task.title
                  )}</h4>
                  <span style="padding:0.25rem 0.5rem;background:${getTaskStatusBgColor(
                    task.status
                  )};color:${getTaskStatusTextColor(
                    task.status
                  )};border-radius:0.25rem;font-size:0.75rem;">
                    ${getTaskStatusLabel(task.status)}
                  </span>
                </div>
                <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">${S_PROJ(
                  task.description || ""
                )}</p>
                <p style="font-size:0.75rem;color:#9ca3af;">Responsável: ${S_PROJ(
                  task.assignee || task.responsavel || "—"
                )}</p>
              </div>
            `
                )
                .join("")
            : `<p style="color:#666;text-align:center;padding:1rem;">Nenhuma tarefa encontrada</p>`
        }
      </div>
    </div>

    <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem;padding-top:1rem;border-top:1px solid #e5e7eb;">
      <button type="button" onclick="editarProjetos(${projectId})" class="btn btn-outline">Editar</button>
      <button type="button" onclick="fecharModal()" class="btn btn-primary">Fechar</button>
    </div>
    `
  );
}

async function deletarProjeto(projectId) {
  try {
    await apiJSON(`/projects/${projectId}`, "DELETE");
    if (typeof showToast === "function")
      showToast("Projeto excluído com sucesso!");
    await fetchProjects();
  } catch (e) {
    console.error(e);
    if (typeof showToast === "function") showToast("Erro ao excluir projeto.");
  }
}

/* ===== Cards / Helpers visuais ===== */
function gerarArrayProjetosCards(arr) {
  return (arr || [])
    .map(
      (p) => `
    <div data-projetos-id="${
      p.id
    }" style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid ${getPriorityBorderColor(
        p.priority
      )};border-radius:0.5rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.1);transition:box-shadow .2s ease;"
         onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,.1)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.1)'">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1rem;">
        <div style="flex:1;">
          <h3 style="font-size:1.125rem;font-weight:600;color:#000;margin-bottom:0.25rem;">${S_PROJ(
            p.name
          )}</h3>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <span style="padding:0.25rem 0.5rem;background:${getStatusBgColor(
              getStatusLabel(p.status)
            )};color:${getStatusTextColor(
        getStatusLabel(p.status)
      )};border-radius:0.25rem;font-size:0.75rem;">${getStatusLabel(
        p.status
      )}</span>
            <span style="font-size:0.8rem;color:#6b7280;">Gestor: ${S_PROJ(
              p.gestor || userNameById(p.gestor_id) || "—"
            )}</span>
          </div>
        </div>
        <div class="projetos-menu" style="position:relative;">
          <button onclick="abrirMenuProjeto(${
            p.id
          })" style="background:none;border:none;cursor:pointer;padding:0.25rem;color:#666;">
            <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </div>

      <p style="color:#666;font-size:0.875rem;margin-bottom:0.75rem;">${S_PROJ(
        p.description || ""
      )}</p>

      ${
        Array.isArray(p.equipe) && p.equipe.length
          ? `
        <div style="margin-bottom:0.75rem;">
          ${p.equipe
            .slice(0, 6)
            .map(
              (n) =>
                `<span style="display:inline-block;margin:0 0.25rem 0.25rem 0;background:#eef2ff;color:#3730a3;padding:0.125rem 0.5rem;border-radius:999px;font-size:0.7rem;">${S_PROJ(
                  n
                )}</span>`
            )
            .join("")}
          ${
            p.equipe.length > 6
              ? `<span style="font-size:0.75rem;color:#6b7280;">+${
                  p.equipe.length - 6
                }</span>`
              : ""
          }
        </div>`
          : ""
      }

      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.875rem;color:#666;margin-bottom:1rem;">
        <div style="display:flex;align-items:center;gap:0.25rem;">
          <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          <span>${(p.equipe || []).length} membros</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.25rem;">
          <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>${formatDateBR(p.deadline)}</span>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <span style="font-size:0.875rem;">Progresso</span>
        <span style="font-size:0.875rem;">${Number(p.progress || 0)}%</span>
      </div>
      <div style="width:100%;background:#e5e7eb;border-radius:0.25rem;height:0.5rem;margin-bottom:0.75rem;">
        <div style="background:#000;height:100%;border-radius:0.25rem;width:${Number(
          p.progress || 0
        )}%;"></div>
      </div>

      <div style="display:flex;gap:0.5rem;">
        <button class="edit-projetos-btn btn btn-outline" style="flex:1;font-size:0.875rem;">
          <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar
        </button>
        <button class="view-projetos-btn btn btn-outline" style="flex:1;font-size:0.875rem;">Ver Detalhes</button>
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

/* menu apagar (usa DELETE /projects/:id) */
window.abrirMenuProjeto = (projectId) => {
  const card = document.querySelector(`[data-projetos-id="${projectId}"]`);
  if (!card) return;

  let menu = card.querySelector(".projetos-menu-dropdown");
  document.querySelectorAll(".projetos-menu-dropdown").forEach((el) => {
    if (el !== menu) {
      if (typeof el._close === "function") el._close();
      else el.remove();
    }
  });
  if (menu) {
    if (typeof menu._close === "function") menu._close();
    else menu.remove();
    return;
  }

  const menuContainer = card.querySelector(".projetos-menu") || card;
  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  menu = document.createElement("div");
  menu.className = "projetos-menu-dropdown";
  Object.assign(menu.style, {
    position: "absolute",
    top: "30px",
    right: "0",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
    zIndex: "999",
  });

  const onClickOutside = (ev) => {
    if (!menu.contains(ev.target)) closeMenu();
  };
  const onEsc = (ev) => {
    if (ev.key === "Escape") closeMenu();
  };
  function closeMenu() {
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    menu.remove();
  }
  menu._close = closeMenu;
  menu.addEventListener("click", (e) => e.stopPropagation());

  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `<span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">🗑 <span>Apagar</span></span>`;
  Object.assign(apagarBtn.style, {
    padding: "0.5rem",
    cursor: "pointer",
    color: "#b91c1c",
  });

  apagarBtn.addEventListener("click", async () => {
    closeMenu();
    const confirmar = await confirmarModal({
      title: "Excluir projeto?",
      message:
        "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.",
    });
    if (confirmar) {
      await deletarProjeto(projectId);
    }
  });

  menu.appendChild(apagarBtn);
  menuContainer.appendChild(menu);
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};

/* ===== Exports de página ===== */
function gerarCardsProjetos() {
  return gerarArrayProjetosCards(window.projetos || []);
}

/* ======= Utils de cor (mantidos do teu front) ======= */
function getPriorityBorderColor(priorityUi) {
  const map = { baixa: "#34d399", media: "#fbbf24", alta: "#ef4444" };
  return map[String(priorityUi || "").toLowerCase()] || "#9ca3af";
}
/* status colors utilitários que tua UI já tinha */
function getStatusBgColor(label) {
  return "#eef2ff";
}
function getStatusTextColor(label) {
  return "#3730a3";
}

/* Tarefas (placeholders existentes no teu projeto) */
function getTaskStatusBgColor(s) {
  return "#e5e7eb";
}
function getTaskStatusTextColor(s) {
  return "#111827";
}
function getTaskStatusLabel(s) {
  return s || "—";
}

/* ===== Boot público ===== */
window.carregarConteudoProjetos = carregarConteudoProjetos;
