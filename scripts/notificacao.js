(function () {
  const STORE_KEY = "kontrollarNotifs";

  const el = {
    bell: null,
    panel: null,
    close: null,
    list: null,
    header: null,
    badge: null,
  };

  const Notifs = {
    items: [],
    routes: {
      task: "backlog",
      meeting: "calendarioio",
      project: "projetos",
      notice: "avisos",
    },

    init() {
      try {
        this.items = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      } catch {
        this.items = [];
      }
      return this;
    },
    save() {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.items));
    },

    initUI(opts = {}) {
      el.bell = document.querySelector(
        opts.bellSelector || "#botaoNotificacao"
      );
      el.panel = document.querySelector(
        opts.panelSelector || "#painelNotificacao"
      );
      el.close = document.querySelector(
        opts.closeSelector || "#fecharNotificacao"
      );

      el.list =
        document.querySelector(opts.listSelector || "#listaNotificacoes") ||
        el.panel?.querySelector("#listaNotificacoes") ||
        el.panel?.querySelector(".notification-list");

      if (!el.panel) return this;

      if (el.list) {
        el.list.id = "listaNotificacoes";
        el.list.innerHTML = "";
      } else {
        el.list = document.createElement("div");
        el.list.id = "listaNotificacoes";
        el.panel.appendChild(el.list);
      }
      el.header = el.panel.querySelector(".notification-header");
      if (el.header && !el.header.querySelector(".notif-actions")) {
        const actions = document.createElement("div");
        actions.className = "notif-actions";
        actions.style.cssText =
          "display:flex; gap:.25rem; align-items:center; margin-left:auto;";
        actions.innerHTML = `
    <button id="notifMarkAll" class="notif-icon-btn" title="Marcar todas como lidas" aria-label="Marcar todas como lidas">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    </button>
    <button id="notifClearAll" class="notif-icon-btn" title="Limpar notificações" aria-label="Limpar notificações">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 6h18"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
    </button>
  `;
        el.header.appendChild(actions);

        if (!document.getElementById("notifIconBtnCSS")) {
          const css = document.createElement("style");
          css.id = "notifIconBtnCSS";
          css.textContent = `
      .notif-actions .notif-icon-btn{
        display:inline-flex;align-items:center;justify-content:center;
        width:28px;height:28px;border:none;background:transparent;
        border-radius:6px;cursor:pointer;
      }
      .notif-actions .notif-icon-btn:hover{ background:#f3f4f6; }
      .notif-actions .notif-icon-btn svg{ width:16px;height:16px;stroke:#374151;stroke-width:2; }
    `;
          document.head.appendChild(css);
        }

        el.header
          .querySelector("#notifMarkAll")
          ?.addEventListener("click", () => this.markAllRead());
        el.header
          .querySelector("#notifClearAll")
          ?.addEventListener("click", async () => {
            if (el.panel) el.panel.style.display = "none";

            const confirmar = await confirmarModal({
              title: "Limpar notificações?",
              message:
                "Tem certeza que deseja limpar todas as notificações? Esta ação não pode ser desfeita.",
            });

            if (confirmar) {
              this.clear();
            } else {
              if (el.panel) el.panel.style.display = "block";
            }
          });
      }

      el.badge = document.querySelector(".notification-badge");
      if (el.badge) el.badge.style.display = "none";

      el.bell?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });
      el.close?.addEventListener("click", () => this.hide());
      document.addEventListener("click", (e) => {
        if (!el.panel) return;
        const insidePanel = el.panel.contains(e.target);
        const onBell = el.bell?.contains(e.target);
        if (!insidePanel && !onBell) this.hide();
      });

      this.render();
      this.updateBell();
      return this;
    },

    toggle() {
      if (!el.panel) return;
      const show = el.panel.style.display !== "block";
      el.panel.style.display = show ? "block" : "none";
      if (show) this.markAllRead();
    },
    show() {
      if (el.panel) {
        el.panel.style.display = "block";
        this.markAllRead();
      }
    },
    hide() {
      if (el.panel) el.panel.style.display = "none";
    },

    markAllRead() {
      const now = new Date().toISOString();
      let changed = false;
      this.items = (this.items || []).map((n) => {
        if (!n.readAt) {
          changed = true;
          return { ...n, readAt: now };
        }
        return n;
      });
      if (changed) {
        this.save();
        this.render();
      }
      this.updateBell();
    },

    push({ title, body = "", type = "notice", page, when } = {}) {
      const item = {
        id: Date.now(),
        title: String(title || "Notificação"),
        body: String(body || ""),
        type,
        page: page || this.routes[type] || "avisos",
        when: when || new Date().toISOString(),
        readAt: null,
      };
      this.items.unshift(item);
      this.save();
      this.render();
      this.updateBell();
      return item.id;
    },


    render() {
      if (!el.list) return;
      if (!this.items.length) {
        el.list.innerHTML = `<div style="padding:0.75rem;color:#6b7280;font-size:0.875rem;">Sem notificações.</div>`;
        return;
      }
      el.list.innerHTML = this.items
        .map((n, idx) => {
          const unread = !n.readAt;
          return `
          <div class="notification-item" data-idx="${idx}"
               style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.75rem;border-bottom:1px solid #f3f4f6;cursor:pointer;${
                 unread ? "background:#f9fafb;" : ""
               }">
            <div style="width:8px;height:8px;border-radius:999px;margin-top:0.4rem;background:${this._dotColor(
              n.type
            )};"></div>
            <div style="flex:1;">
              <div style="font-weight:${
                unread ? "700" : "600"
              };color:#111827;">${this._esc(n.title)}</div>
              ${
                n.body
                  ? `<div style="color:#4b5563;font-size:0.9rem;">${this._esc(
                      n.body
                    )}</div>`
                  : ""
              }
              <div style="color:#9ca3af;font-size:0.75rem;margin-top:0.25rem;">${this._when(
                n.when
              )}</div>
            </div>
          </div>
        `;
        })
        .join("");

      el.list.querySelectorAll(".notification-item").forEach((div) => {
        div.addEventListener("click", () => {
          const idx = Number(div.getAttribute("data-idx"));
          const n = this.items[idx];
          if (!n) return;
          if (
            typeof definirPaginaAtiva === "function" &&
            typeof carregarConteudoPagina === "function"
          ) {
            definirPaginaAtiva(n.page);
            carregarConteudoPagina(n.page);
          }
          this.hide();
        });
      });
    },

    clear() {
      this.items = [];
      this.save();
      this.render();
      this.updateBell();
    },

    getUnreadCount() {
      return (this.items || []).filter((n) => !n.readAt).length;
    },
    updateBell() {
      const unread = this.getUnreadCount();
      if (unread > 0) el.bell?.setAttribute("data-has", "1");
      else el.bell?.removeAttribute("data-has");
    },

    _dotColor(type) {
      switch (type) {
        case "meeting":
          return "#2563eb";
        case "project":
          return "#f59e0b";
        case "task":
          return "#10b981";
        default:
          return "#a855f7";
      }
    },
    _esc(s) {
      return String(s).replace(
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
    },
    _when(iso) {
      try {
        return new Date(iso).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        });
      } catch {
        return iso || "";
      }
    },
  };

  window.Notifs = Notifs.init();
})();
