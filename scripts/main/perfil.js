/* ===================== CONFIG & STATE ===================== */
const API_BASE = (window.API_BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  ""
);
const API_USERS = `${API_BASE}/users`;

const CARGOS_VALIDOS = [
  "Administrador",
  "Gestor",
  "Desenvolvedor",
  "Cliente",
  "Usuário",
];

// Estado em memória da página de perfil
let PROFILE_STATE = {
  loading: false,
  user: null, // sempre os dados do BD usados para render
};

/* ===================== HELPERS ===================== */
async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}
function qs(id) {
  return document.getElementById(id);
}
function splitName(fullName = "") {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}
function joinName(first, last) {
  return [first || "", last || ""].filter(Boolean).join(" ").trim();
}
function getInitials(name = "") {
  return (
    String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || "")
      .join("") || "U"
  );
}
function maskPhone(v = "") {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}
function pwdStrengthScore(p = "") {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 5);
}
function toDateOnlyYYYYMMDD(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  } catch {
    return "";
  }
}
function formatarDataPtBR(dataIso = "") {
  const [ano, mes, dia] = String(dataIso).split("-");
  if (!ano || !mes || !dia) return dataIso || "";
  return `${dia}/${mes}/${ano}`;
}
function showAlert({ title = "Aviso", message = "" } = {}) {
  if (typeof alertModal === "function") {
    alertModal({ title, message });
  } else {
    alert(`${title}\n\n${message}`);
  }
}
function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}
function updateSessionUserPartial(partial) {
  // Só para manter header/menu funcionando — não usamos isso para render do perfil
  const cur = getSessionUser();
  const next = { ...cur, ...partial };
  localStorage.setItem("user", JSON.stringify(next));
  return next;
}

function resolveUserId() {
  const lsId    = getSessionUser()?.id;
  const bodyId  = document.body?.dataset?.userId; // setado pelo inicializador
  const metaId  = document.querySelector('meta[name="user-id"]')?.content;
  const urlId   = new URLSearchParams(location.search).get('uid');
  return lsId || bodyId || metaId || urlId || null;
}
/* ===================== API ===================== */
async function apiGetUserById(id) {
  const res = await fetch(`${API_USERS}/${id}`, { cache: "no-store" });
  const data = await readJsonSafe(res);
  if (!res.ok)
    throw new Error(data?.error || `Erro ao buscar usuário (${res.status})`);
  return data;
}
async function apiUpdateUser(id, payload) {
  const res = await fetch(`${API_USERS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await readJsonSafe(res);
  if (!res.ok)
    throw new Error(data?.error || `Erro ao atualizar (${res.status})`);
  return data;
}

/* ===================== RENDER ===================== */
function renderProfile(user) {
  const root = qs("conteudoPagina");
  if (!root) return;

  const nome = user?.nome || "";
  const sobrenome = user?.sobrenome || "";
  const fullName =
    [nome, sobrenome].filter(Boolean).join(" ").trim() || "Usuário";

  const { first, last } = splitName(fullName);
  const avatarStyle = user?.avatar_base64
    ? `background-image:url('${user.avatar_base64}'); background-size:cover; background-position:center; color:transparent;`
    : "";

  const created = toDateOnlyYYYYMMDD(user?.created_at);

  root.innerHTML = `
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
            ${user?.avatar_base64 ? "" : getInitials(fullName)}
          </div>
          <label class="btn btn-outline" style="cursor:pointer;display:inline-block;">
            Alterar foto
            <input id="avatarInput" type="file" accept="image/*" style="display:none">
          </label>
          ${
            user?.avatar_base64
              ? `<button id="removeAvatarBtn" class="btn btn-outline" style="margin-left:0.5rem;">Remover</button>`
              : ""
          }
        </div>

        <h2 style="font-size:1.25rem;font-weight:600;color:#000;margin-bottom:0.25rem;text-align:center;">${fullName}</h2>
        <p style="color:#666;text-align:center;margin-bottom:0.25rem;">${
          user?.email || ""
        }</p>
        <p style="color:#666;text-align:center;font-size:0.875rem;margin-bottom:1rem;">${
          user?.cargo || "Cliente"
        }</p>

        <div style="display:grid;gap:0.5rem;">
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Status:</span>
            <span style="color:#10b981;">Ativo</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-weight:500;">Membro desde:</span>
            <span>${formatarDataPtBR(created)}</span>
          </div>
        </div>

        <div style="margin-top:1.25rem;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
          <div style="display:grid;row-gap:0.35rem;font-size:0.9rem;color:#374151;">
            <div><strong>Departamento:</strong> ${
              user?.departamento
                ? user.departamento[0].toUpperCase() +
                  user.departamento.slice(1)
                : "—"
            }</div>
            <div><strong>Cargo:</strong> ${user?.cargo || "—"}</div>
            <div><strong>Telefone:</strong> ${user?.telefone || "—"}</div>
          </div>
        </div>
      </div>

      <!-- Coluna Direita -->
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
              <input type="email" id="profileEmail" value="${
                user?.email || ""
              }" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            </div>
            <div>
              <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Telefone</label>
              <input type="tel" id="profilePhone" value="${
                user?.telefone || ""
              }" placeholder="(11) 99999-9999" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Departamento</label>
              <select id="profileDepartment" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
                <option value="">Selecione</option>
                ${[
                  "desenvolvimento",
                  "design",
                  "marketing",
                  "vendas",
                  "rh",
                  "financeiro",
                ]
                  .map(
                    (dep) =>
                      `<option value="${dep}" ${
                        user?.departamento === dep ? "selected" : ""
                      }>${dep[0].toUpperCase() + dep.slice(1)}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div>
              <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Cargo</label>
              <input type="text" id="profileRole" value="${
                user?.cargo || ""
              }" placeholder="Administrador, Gestor, Desenvolvedor, Cliente ou Usuário" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;">
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Bio</label>
            <textarea id="profileBio" placeholder="Conte um pouco sobre você..." style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem;min-height:80px;resize:vertical;">${
              user?.bio || ""
            }</textarea>
          </div>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:1rem 0;">

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
  `;

  attachProfileHandlers(user);
}

/* ===================== HANDLERS ===================== */
function attachProfileHandlers(currentUser) {
  const avatarInput = qs("avatarInput");
  const removeAvatarBtn = qs("removeAvatarBtn");
  const phoneEl = qs("profilePhone");
  const togglePwd = qs("togglePwd");
  const newPwdEl = qs("newPassword");
  const bar = qs("pwdBar");
  const tip = qs("pwdTip");
  const cancelBtn = qs("cancelProfileBtn");
  const form = qs("profileForm");

  if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result;
          const updated = await apiUpdateUser(currentUser.id, {
            avatar_base64: dataUrl,
          });
          PROFILE_STATE.user = updated; // fonte única: BD
          renderProfile(PROFILE_STATE.user);
          // opcional: atualizar header/atualizações globais
          updateSessionUserPartial({
            name: [updated.nome, updated.sobrenome].filter(Boolean).join(" "),
            email: updated.email,
          });
        } catch (err) {
          console.error(err);
          showAlert({
            title: "Erro",
            message: "Não foi possível atualizar a foto.",
          });
        }
      };
      reader.readAsDataURL(f);
    });
  }

  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener("click", async () => {
      try {
        const updated = await apiUpdateUser(currentUser.id, {
          avatar_base64: null,
        });
        PROFILE_STATE.user = updated;
        renderProfile(PROFILE_STATE.user);
        updateSessionUserPartial({
          name: [updated.nome, updated.sobrenome].filter(Boolean).join(" "),
          email: updated.email,
        });
      } catch (err) {
        console.error(err);
        showAlert({
          title: "Erro",
          message: "Não foi possível remover a foto.",
        });
      }
    });
  }

  if (phoneEl)
    phoneEl.addEventListener("input", () => {
      phoneEl.value = maskPhone(phoneEl.value);
    });

  if (togglePwd && newPwdEl) {
    togglePwd.addEventListener("click", () => {
      const t =
        newPwdEl.getAttribute("type") === "password" ? "text" : "password";
      newPwdEl.setAttribute("type", t);
      togglePwd.textContent = t === "password" ? "Mostrar" : "Ocultar";
    });
  }
  if (newPwdEl && bar && tip) {
    const updateStrength = () => {
      const s = pwdStrengthScore(newPwdEl.value);
      const pct = (s / 5) * 100;
      bar.style.width = pct + "%";
      bar.style.background =
        s >= 4 ? "#10b981" : s >= 3 ? "#f59e0b" : "#ef4444";
      tip.textContent =
        s >= 4
          ? "Senha forte"
          : s >= 3
          ? "Senha média"
          : "Use 8+ caracteres, maiúsculas, números e símbolos";
    };
    newPwdEl.addEventListener("input", updateStrength);
    updateStrength();
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // simplesmente re-renderiza com o estado atual do BD
      renderProfile(PROFILE_STATE.user);
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // ID do usuário logado vem do próprio PROFILE_STATE.user
      const userId = PROFILE_STATE.user?.id || getSessionUser()?.id;
      if (!userId)
        return showAlert({
          title: "Erro",
          message: "Sessão inválida. Faça login novamente.",
        });

      const first = qs("profileName").value.trim();
      const last = qs("profileLastName").value.trim();
      const email = qs("profileEmail").value.trim();
      const phone = qs("profilePhone").value.trim();
      const department = qs("profileDepartment").value;
      let role = qs("profileRole").value.trim();
      const bio = qs("profileBio").value.trim();

      // Normaliza cargo (Title Case + acentos)
      if (role) {
        role = role[0].toUpperCase() + role.slice(1).toLowerCase();
        const m = {
          Administrador: "Administrador",
          Gestor: "Gestor",
          Desenvolvedor: "Desenvolvedor",
          Cliente: "Cliente",
          Usuario: "Usuário",
          Usuário: "Usuário",
        };
        role = m[role] || role;
        if (!CARGOS_VALIDOS.includes(role)) {
          showAlert({
            title: "Cargo inválido",
            message: `Use um dos valores: ${CARGOS_VALIDOS.join(", ")}`,
          });
          return;
        }
      }

      // Senha (aqui só validação de UI; troca real depende do endpoint do back)
      const currentPassword = qs("currentPassword").value;
      const newPassword = qs("newPassword").value;
      const confirmNew = qs("confirmNewPassword").value;

      if (newPassword || confirmNew) {
        if (newPassword !== confirmNew) {
          showAlert({ title: "Erro", message: "As senhas não coincidem" });
          return;
        }
        if (newPassword.length < 8) {
          showAlert({
            title: "Atenção",
            message: "A nova senha deve ter pelo menos 8 caracteres",
          });
          return;
        }
        // TODO: integrar com /auth/change-password quando exposto no backend
      }

      const payload = {
        nome: first,
        sobrenome: last,
        email,
        telefone: phone || null,
        departamento: department || null,
        cargo: role || PROFILE_STATE.user?.cargo || "Cliente",
        bio: bio || null,
      };

      try {
        const updated = await apiUpdateUser(userId, payload);
        PROFILE_STATE.user = updated; // **sempre** usa BD para render
        renderProfile(PROFILE_STATE.user);

        // opcional — manter header/menu atualizado
        updateSessionUserPartial({
          name: [updated.nome, updated.sobrenome].filter(Boolean).join(" "),
          email: updated.email,
        });

        showAlert({
          title: "Sucesso",
          message: "Perfil atualizado com sucesso!",
        });

        // (quando houver endpoint de senha, chame aqui e mostre outro alerta)
      } catch (err) {
        console.error(err);
        showAlert({
          title: "Erro",
          message: err.message || "Falha ao atualizar perfil.",
        });
      }
    });
  }
}

/* ===================== INIT ===================== */
async function initProfile() {
  // só renderiza se a aba Perfil estiver ativa
  const isPerfil =
    document.body?.dataset?.activeTab === 'perfil' ||
    location.hash === '#perfil';
  if (!isPerfil) return;

  // pega o container ANTES de usar
  const container = qs('conteudoPagina');
  if (!container) return; // não está na página de perfil

  // resolve o id por localStorage/dataset/meta/query
  const id = resolveUserId();
  if (!id) {
    container.innerHTML = `
      <div style="padding:1rem;border:1px solid #e5e7eb;border-radius:.5rem;background:#fff;">
        <strong>Sem sessão:</strong> não foi possível identificar o usuário.
      </div>`;
    return;
  }

  try {
    PROFILE_STATE.loading = true;
    const user = await apiGetUserById(id);
    PROFILE_STATE.user = user;
    renderProfile(PROFILE_STATE.user);

    // opcional: manter header/menu em sincronia
    updateSessionUserPartial({
      name: [user.nome, user.sobrenome].filter(Boolean).join(' '),
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    showAlert({
      title: 'Erro',
      message: err.message || 'Não foi possível carregar o perfil.',
    });
  } finally {
    PROFILE_STATE.loading = false;
  }
}


window.renderPerfil = (opts = {}) => {
  if (opts.userId) document.body.dataset.userId = String(opts.userId);
  document.body.dataset.activeTab = "perfil";
   if (location.hash !== "#perfil") {
     try { history.replaceState(null, "", "#perfil"); } catch {}
   }
   initProfile();
};