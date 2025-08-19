function createModal(title, content) {
  const existingModal = document.getElementById("modal-overlay");
  if (existingModal) existingModal.remove();

  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0, 0, 0, 0.6)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  const modal = document.createElement("div");
  modal.style.background = "white";
  modal.style.borderRadius = "0.5rem";
  modal.style.maxWidth = "600px";
  modal.style.width = "100%";
  modal.style.padding = "1.5rem";
  modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  modal.style.textAlign = "left";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  titleEl.style.fontSize = "1.25rem";
  titleEl.style.fontWeight = "600";
  titleEl.style.marginBottom = "0.5rem";

  const contentEl = document.createElement("div");
  contentEl.innerHTML = content;
  contentEl.style.marginBottom = "0rem";

  modal.appendChild(titleEl);
  modal.appendChild(contentEl);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      fecharModal();
    }
  });
}


function fecharModal() {
  const modal = document.getElementById("modal-overlay");
  if (modal) modal.remove();
}

function confirmarModal({ title, message }) {
  return new Promise((resolve) => {
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100vw";
    modalOverlay.style.height = "100vh";
    modalOverlay.style.background = "rgba(0,0,0,0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.zIndex = "1000";

    const modal = document.createElement("div");
    modal.style.background = "#fff";
    modal.style.padding = "1.5rem";
    modal.style.borderRadius = "0.5rem";
    modal.style.maxWidth = "400px";
    modal.style.width = "100%";
    modal.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600;">${title}</h3>
        <button id="fecharModalBtn" style="background: transparent; border: none; font-size: 1.25rem; cursor: pointer;">&times;</button>
      </div>
      <p style="color: #374151; font-size: 0.95rem; margin-bottom: 1.5rem;">${message}</p>
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button id="cancelarBtn" style="padding: 0.5rem 1rem; background: #e5e7eb; border: none; border-radius: 0.375rem; cursor: pointer;">Cancelar</button>
        <button id="confirmarBtn" style="padding: 0.5rem 1rem; background:rgb(0, 0, 0); color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Confirmar</button>
      </div>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    modal.querySelector("#fecharModalBtn").onclick =
    modal.querySelector("#cancelarBtn").onclick = () => {
      document.body.removeChild(modalOverlay);
      resolve(false);
    };

    modal.querySelector("#confirmarBtn").onclick = () => {
      document.body.removeChild(modalOverlay);
      resolve(true);
    };
  });
}


function showToast(message, type = "success") {
  const toast = document.createElement("div");

  const icon = type === "success" ? "✅" : "❌";
  const bgColor = type === "success" ? "#16a34a" : "#dc2626";

  toast.innerHTML = `
    <span style="margin-right: 0.5rem;">${icon}</span>
    <span>${message}</span>
  `;

  toast.style.position = "fixed";
  toast.style.bottom = "1.5rem";
  toast.style.right = "1.5rem";
  toast.style.maxWidth = "300px";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "0.5rem";
  toast.style.padding = "0.75rem 1rem";
  toast.style.background = bgColor;
  toast.style.color = "#fff";
  toast.style.borderRadius = "0.5rem";
  toast.style.fontSize = "0.875rem";
  toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
  toast.style.zIndex = "10000";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";
  toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}


function alertModal({ title, message }) {
  return new Promise((resolve) => {
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100vw";
    modalOverlay.style.height = "100vh";
    modalOverlay.style.background = "rgba(0,0,0,0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.zIndex = "1000";

    const modal = document.createElement("div");
    modal.style.background = "#fff";
    modal.style.padding = "1.5rem";
    modal.style.borderRadius = "0.5rem";
    modal.style.maxWidth = "400px";
    modal.style.width = "100%";
    modal.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600;">${title}</h3>
        <button id="fecharModalBtn" style="background: transparent; border: none; font-size: 1.25rem; cursor: pointer;">&times;</button>
      </div>
      <p style="color: #374151; font-size: 0.95rem; margin-bottom: 1.5rem;">${message}</p>
      <div style="display: flex; justify-content: flex-end;">
        <button id="okBtn" style="padding: 0.5rem 1rem; background: rgb(0,0,0); color: white; border: none; border-radius: 0.375rem; cursor: pointer;">OK</button>
      </div>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    modal.querySelector("#fecharModalBtn").onclick =
    modal.querySelector("#okBtn").onclick = () => {
      document.body.removeChild(modalOverlay);
      resolve(true);
    };
  });
}
