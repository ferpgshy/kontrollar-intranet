const S_PROJ = typeof sanitizeHTML === "function"
  ? sanitizeHTML
  : (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));

function getPeopleOptions() {
  const set = new Set();
  const u = JSON.parse(localStorage.getItem("user") || "{}");
  if (u?.name) set.add(u.name);

  (window.equipes || []).forEach(e => {
    (e.members || []).forEach(m => {
      if (typeof m === "string" && m.trim()) set.add(m.trim());
      else if (m && typeof m === "object" && m.name) set.add(String(m.name).trim());
    });
  });

  (window.tarefas || []).forEach(t => {
    [t.assignee, t.responsavel, t.atribuidoA].forEach(m => {
      if (typeof m === "string" && m.trim()) set.add(m.trim());
      else if (m && typeof m === "object" && m.name) set.add(String(m.name).trim());
    });
  });

  (window.projetos || []).forEach(p => {
    (p.equipe || []).forEach(m => {
      if (typeof m === "string" && m.trim()) set.add(m.trim());
      else if (m && typeof m === "object" && m.name) set.add(String(m.name).trim());
    });
    if (p.gestor && typeof p.gestor === "string" && p.gestor.trim()) set.add(p.gestor.trim());
  });

  return Array.from(set).filter(Boolean).sort((a,b) => a.localeCompare(b, 'pt-BR'));
}

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

    <div id="projetosGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;">
      ${gerarCardsProjetos()}
    </div>
  `;

  setupProjetosPage();
}

function setupProjetosPage() {
  document.getElementById("newProjectBtn")?.addEventListener("click", mostrarModalProjetoNovo);
  document.getElementById("projectSearch")?.addEventListener("input", filterProjetos);
  document.getElementById("projectStatusFilter")?.addEventListener("change", filterProjetos);
  configAcoesCardProjetos();
}

function filterProjetos() {
  const searchTerm = (document.getElementById("projectSearch")?.value || "").toLowerCase();
  const statusFilter = document.getElementById("projectStatusFilter")?.value || "todos";

  const filtered = (window.projetos || []).filter(p => {
    const matchesSearch =
      String(p.name || "").toLowerCase().includes(searchTerm) ||
      String(p.description || "").toLowerCase().includes(searchTerm) ||
      String(p.gestor || "").toLowerCase().includes(searchTerm) ||
      (Array.isArray(p.equipe) && p.equipe.some(m => String(m).toLowerCase().includes(searchTerm)));
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
  document.querySelectorAll(".edit-projetos-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id"));
      editarProjetos(projectId);
    });
  });

  document.querySelectorAll(".view-projetos-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id"));
      viewProjectDetails(projectId);
    });
  });

  document.querySelectorAll(".delete-projetos-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const projectId = Number.parseInt(e.target.closest("[data-projetos-id]").getAttribute("data-projetos-id"));
      deletarProjeto(projectId);
    });
  });
}


function mostrarModalProjetoNovo() {
  const people = getPeopleOptions();

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
            <option value="planejamento">Planejamento</option>
            <option value="em-andamento">Em Andamento</option>
            <option value="em-desenvolvimento">Em Desenvolvimento</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prioridade</label>
          <select id="projectPriority" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="baixa">Baixa</option>
            <option value="media" selected>Média</option>
            <option value="alta">Alta</option>
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
            ${people.map(n => `<option value="${S_PROJ(n)}">${S_PROJ(n)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Buscar membros</label>
          <input type="text" id="projectMemberSearch" placeholder="Digite para filtrar..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <div id="projectMembersList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${people.length
            ? people.map(n => `
                <label data-row-member="${S_PROJ(n)}" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
                  <input type="checkbox" class="projectMemberChk" value="${S_PROJ(n)}"> ${S_PROJ(n)}
                </label>
              `).join("")
            : `<div style="color:#6b7280;">Sem nomes sugeridos. Adicione equipes/usuários primeiro.</div>`
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
      search.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll("#projectMembersList [data-row-member]").forEach(row => {
          const name = String(row.getAttribute("data-row-member")).toLowerCase();
          row.style.display = name.includes(q) ? "flex" : "none";
        });
      });
    }

    const form = document.getElementById("newProjectForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const gestor = document.getElementById("projectManager").value;
      const membros = Array.from(document.querySelectorAll(".projectMemberChk:checked")).map(c => c.value);

      const novoProjeto = {
        id: Date.now(),
        name: document.getElementById("projectName").value,
        description: document.getElementById("projectDescription").value,
        status: document.getElementById("projectStatus").value,
        priority: document.getElementById("projectPriority").value,
        deadline: document.getElementById("projectDeadline").value,
        progress: 0,
        equipe: membros,    
        gestor: gestor || "", 
        createdAt: typeof getDataBrasiliaFormatada === "function" ? getDataBrasiliaFormatada() : new Date().toISOString().slice(0,10),
      };

      (window.projetos ||= []).push(novoProjeto);
      try { localStorage.setItem("projetos", JSON.stringify(window.projetos)); } catch {}

      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const msg = `${novoProjeto.name} criado${novoProjeto.gestor ? ` • Gestor: ${novoProjeto.gestor}` : ""}`;
      if (window.Notifs && typeof Notifs.notify === "function") {
        Notifs.notify({
          title: "Novo projeto",
          message: msg,
          type: "success",
          payload: { page: "projetos", projectId: novoProjeto.id },
          onClick: () => { definirPaginaAtiva("projetos"); carregarConteudoPagina("projetos"); }
        });
      } else if (typeof showToast === "function") {
        showToast(msg);
      }

      fecharModal();
      filterProjetos();
    });
  }, 0);
}


function editarProjetos(projectId) {
  const projeto = (window.projetos || []).find(p => p.id === projectId);
  if (!projeto) return;

  const people = getPeopleOptions();
  const selected = new Set((projeto.equipe || []).map(String));

  createModal(
    "Editar Projeto",
    `
    <form id="editProjectForm">
      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Nome do Projeto</label>
        <input type="text" id="editProjectName" value="${S_PROJ(projeto.name)}" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Descrição</label>
        <textarea id="editProjectDescription" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;">${S_PROJ(projeto.description || "")}</textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Status</label>
          <select id="editProjectStatus" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="planejamento" ${projeto.status==="planejamento"?"selected":""}>Planejamento</option>
            <option value="em-andamento" ${projeto.status==="em-andamento"?"selected":""}>Em Andamento</option>
            <option value="em-desenvolvimento" ${projeto.status==="em-desenvolvimento"?"selected":""}>Em Desenvolvimento</option>
            <option value="quase-concluido" ${projeto.status==="quase-concluido"?"selected":""}>Quase Concluído</option>
            <option value="concluido" ${projeto.status==="concluido"?"selected":""}>Concluído</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prioridade</label>
          <select id="editProjectPriority" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="baixa" ${projeto.priority==="baixa"?"selected":""}>Baixa</option>
            <option value="media" ${projeto.priority==="media"?"selected":""}>Média</option>
            <option value="alta"  ${projeto.priority==="alta" ?"selected":""}>Alta</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Progresso (%)</label>
        <input type="number" id="editProjectProgress" value="${Number(projeto.progress||0)}" min="0" max="100" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Prazo</label>
        <input type="date" id="editProjectDeadline" value="${S_PROJ(projeto.deadline || "")}" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Gestor</label>
          <select id="editProjectManager" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            <option value="">Selecione</option>
            ${people.map(n => `<option value="${S_PROJ(n)}" ${projeto.gestor===n?"selected":""}>${S_PROJ(n)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Buscar membros</label>
          <input type="text" id="editProjectMemberSearch" placeholder="Digite para filtrar..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <div id="editProjectMembersList" style="max-height:180px;overflow:auto;border:1px solid #e5e7eb;border-radius:0.375rem;padding:0.5rem;">
          ${
            people.length
              ? people.map(n => `
                <label data-row-member="${S_PROJ(n)}" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
                  <input type="checkbox" class="editProjectMemberChk" value="${S_PROJ(n)}" ${selected.has(n) ? "checked" : ""}>
                  ${S_PROJ(n)}
                </label>`).join("")
              : `<div style="color:#6b7280;">Sem nomes sugeridos.</div>`
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
    document.getElementById("editProjectMemberSearch")?.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll("#editProjectMembersList [data-row-member]").forEach(row => {
        const name = String(row.getAttribute("data-row-member")).toLowerCase();
        row.style.display = name.includes(q) ? "flex" : "none";
      });
    });

    document.getElementById("editProjectForm")?.addEventListener("submit", (e) => {
      e.preventDefault();

      projeto.name = document.getElementById("editProjectName").value;
      projeto.description = document.getElementById("editProjectDescription").value;
      projeto.status = document.getElementById("editProjectStatus").value;
      projeto.priority = document.getElementById("editProjectPriority").value;
      projeto.progress = Number(document.getElementById("editProjectProgress").value || 0);
      projeto.deadline = document.getElementById("editProjectDeadline").value;
      projeto.gestor = document.getElementById("editProjectManager").value || "";

      projeto.equipe = Array.from(document.querySelectorAll(".editProjectMemberChk:checked")).map(c => c.value);

      try { localStorage.setItem("projetos", JSON.stringify(window.projetos)); } catch {}
      fecharModal();
      filterProjetos();
    });
  }, 0);
}


function viewProjectDetails(projectId) {
  const projeto = (window.projetos || []).find(p => p.id === projectId);
  if (!projeto) return;

  const projectTasks = (window.tarefas || []).filter(t => t.projetos === projeto.name);
  const chips = (projeto.equipe || []).map(n => `<span style="background:#eef2ff;color:#3730a3;padding:0.125rem 0.5rem;border-radius:999px;font-size:0.75rem;margin-right:0.25rem;display:inline-block">${S_PROJ(n)}</span>`).join("");

  createModal(
    `Detalhes do Projeto: ${S_PROJ(projeto.name)}`,
    `
    <div style="max-height:400px;overflow-y:auto;">
      <div style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:0.5rem;">Informações Gerais</h3>
        <p style="margin-bottom:0.5rem;"><strong>Descrição:</strong> ${S_PROJ(projeto.description || "")}</p>
        <p style="margin-bottom:0.5rem;"><strong>Status:</strong> ${getStatusLabel(projeto.status)}</p>
        <p style="margin-bottom:0.5rem;"><strong>Prioridade:</strong> ${S_PROJ(projeto.priority || "")}</p>
        <p style="margin-bottom:0.5rem;"><strong>Progresso:</strong> ${Number(projeto.progress || 0)}%</p>
        <p style="margin-bottom:0.5rem;"><strong>Prazo:</strong> ${typeof formatarDataPtBR === "function" ? formatarDataPtBR(projeto.deadline) : S_PROJ(projeto.deadline || "")}</p>
        <p style="margin-bottom:0.5rem;"><strong>Gestor:</strong> ${S_PROJ(projeto.gestor || "—")}</p>
        <div style="margin-bottom:0.5rem;"><strong>Membros:</strong> ${(projeto.equipe || []).length}</div>
        <div>${chips || "<span style='color:#6b7280;'>Nenhum membro</span>"}</div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-weight:600;margin-bottom:0.5rem;">Progresso</h3>
        <div style="width:100%;background:#e5e7eb;border-radius:0.25rem;height:0.75rem;">
          <div style="background:#000;height:100%;border-radius:0.25rem;width:${Number(projeto.progress || 0)}%;"></div>
        </div>
      </div>

      <div>
        <h3 style="font-weight:600;margin-bottom:0.5rem;">Tarefas Relacionadas (${projectTasks.length})</h3>
        ${
          projectTasks.length
            ? projectTasks.map(task => `
              <div style="padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.375rem;margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <h4 style="font-weight:500;margin-bottom:0.25rem;">${S_PROJ(task.title)}</h4>
                  <span style="padding:0.25rem 0.5rem;background:${getTaskStatusBgColor(task.status)};color:${getTaskStatusTextColor(task.status)};border-radius:0.25rem;font-size:0.75rem;">
                    ${getTaskStatusLabel(task.status)}
                  </span>
                </div>
                <p style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">${S_PROJ(task.description || "")}</p>
                <p style="font-size:0.75rem;color:#9ca3af;">Responsável: ${S_PROJ(task.assignee || task.responsavel || "—")}</p>
              </div>
            `).join("")
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


function deletarProjeto(projectId) {
  window.projetos = (window.projetos || []).filter(p => p.id !== projectId);
  try { localStorage.setItem("projetos", JSON.stringify(window.projetos)); } catch {}
  filterProjetos();
  if (typeof showToast === "function") showToast("Projeto excluído com sucesso!");
}


function gerarArrayProjetosCards(arr) {
  return (arr || []).map(p => `
    <div data-projetos-id="${p.id}" style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid ${getPriorityBorderColor(p.priority)};border-radius:0.5rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.1);transition:box-shadow .2s ease;"
         onmouseover="this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,.1)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.1)'">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1rem;">
        <div style="flex:1;">
          <h3 style="font-size:1.125rem;font-weight:600;color:#000;margin-bottom:0.25rem;">${S_PROJ(p.name)}</h3>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <span style="padding:0.25rem 0.5rem;background:${getStatusBgColor(getStatusLabel(p.status))};color:${getStatusTextColor(getStatusLabel(p.status))};border-radius:0.25rem;font-size:0.75rem;">${getStatusLabel(p.status)}</span>
            <span style="font-size:0.8rem;color:#6b7280;">Gestor: ${S_PROJ(p.gestor || "—")}</span>
          </div>
        </div>
        <div class="projetos-menu" style="position:relative;">
          <button onclick="abrirMenuProjeto(${p.id})" style="background:none;border:none;cursor:pointer;padding:0.25rem;color:#666;">
            <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </div>

      <p style="color:#666;font-size:0.875rem;margin-bottom:0.75rem;">${S_PROJ(p.description || "")}</p>

      ${Array.isArray(p.equipe) && p.equipe.length ? `
        <div style="margin-bottom:0.75rem;">
          ${(p.equipe).slice(0,6).map(n => `<span style="display:inline-block;margin:0 0.25rem 0.25rem 0;background:#eef2ff;color:#3730a3;padding:0.125rem 0.5rem;border-radius:999px;font-size:0.7rem;">${S_PROJ(n)}</span>`).join("")}
          ${p.equipe.length > 6 ? `<span style="font-size:0.75rem;color:#6b7280;">+${p.equipe.length - 6}</span>` : ""}
        </div>` : ""
      }

      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.875rem;color:#666;margin-bottom:1rem;">
        <div style="display:flex;align-items:center;gap:0.25rem;">
          <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          <span>${(p.equipe || []).length} membros</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.25rem;">
          <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>${typeof formatarDataPtBR === "function" ? formatarDataPtBR(p.deadline) : S_PROJ(p.deadline || "")}</span>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <span style="font-size:0.875rem;">Progresso</span>
        <span style="font-size:0.875rem;">${Number(p.progress||0)}%</span>
      </div>
      <div style="width:100%;background:#e5e7eb;border-radius:0.25rem;height:0.5rem;margin-bottom:0.75rem;">
        <div style="background:#000;height:100%;border-radius:0.25rem;width:${Number(p.progress||0)}%;"></div>
      </div>

      <div style="display:flex;gap:0.5rem;">
        <button class="edit-projetos-btn btn btn-outline" style="flex:1;font-size:0.875rem;">
          <svg style="width:1rem;height:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar
        </button>
        <button class="view-projetos-btn btn btn-outline" style="flex:1;font-size:0.875rem;">Ver Detalhes</button>
      </div>
    </div>
  `).join("");
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

window.abrirMenuProjeto = (projectId) => {
  const card = document.querySelector(`[data-projetos-id="${projectId}"]`);
  if (!card) return;

  let menu = card.querySelector(".projetos-menu-dropdown");
  document.querySelectorAll(".projetos-menu-dropdown").forEach(el => {
    if (el !== menu) { if (typeof el._close === "function") el._close(); else el.remove(); }
  });
  if (menu) { if (typeof menu._close === "function") menu._close(); else menu.remove(); return; }

  const menuContainer = card.querySelector(".projetos-menu") || card;
  const cs = getComputedStyle(menuContainer);
  if (cs.position === "static") menuContainer.style.position = "relative";

  menu = document.createElement("div");
  menu.className = "projetos-menu-dropdown";
  Object.assign(menu.style, { position:"absolute", top:"30px", right:"0", background:"#fff", border:"1px solid #e5e7eb", borderRadius:"0.375rem", boxShadow:"0 2px 8px rgba(0,0,0,.1)", zIndex:"999" });

  const onClickOutside = (ev) => { if (!menu.contains(ev.target)) closeMenu(); };
  const onEsc = (ev) => { if (ev.key === "Escape") closeMenu(); };
  function closeMenu() {
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEsc);
    menu.remove();
  }
  menu._close = closeMenu;
  menu.addEventListener("click", e => e.stopPropagation());

  const apagarBtn = document.createElement("div");
  apagarBtn.innerHTML = `<span style="display:flex;align-items:center;gap:0.4rem;font-size:0.875rem;">🗑 <span>Apagar</span></span>`;
  Object.assign(apagarBtn.style, { padding:"0.5rem", cursor:"pointer", color:"#b91c1c" });

  apagarBtn.addEventListener("click", async () => {
    closeMenu();
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
  setTimeout(() => {
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
  }, 0);
};

function gerarCardsProjetos() {
  return gerarArrayProjetosCards(window.projetos || []);
}