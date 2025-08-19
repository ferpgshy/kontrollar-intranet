function getNoticePriorityColor(priority) {
  switch (priority) {
    case "alta": return "#dc2626";
    case "media": return "#d97706";
    case "baixa": return "#16a34a";
    default: return "#6b7280";
  }
}

function getNoticePriorityBgColor(priority) {
  switch (priority) {
    case "alta": return "#fef2f2";
    case "media": return "#fef3c7";
    case "baixa": return "#f0fdf4";
    default: return "#f3f4f6";
  }
}

function getNoticePriorityTextColor(priority) {
  switch (priority) {
    case "alta": return "#dc2626";
    case "media": return "#d97706";
    case "baixa": return "#16a34a";
    default: return "#374151";
  }
}

function getPriorityBorderColor(priority) {
  switch (priority) {
    case "alta": return "#dc2626";
    case "media": return "#d97706";
    case "baixa": return "#16a34a";
    default: return "#6b7280";
  }
}

function getNoticeTypeBgColor(type) {
  switch (type) {
    case "policy": return "#dbeafe";
    case "maintenance": return "#fef3c7";
    case "announcement": return "#f0fdf4";
    case "urgent": return "#fef2f2";
    default: return "#f3f4f6";
  }
}

function getNoticeTypeTextColor(type) {
  switch (type) {
    case "policy": return "#1e40af";
    case "maintenance": return "#d97706";
    case "announcement": return "#16a34a";
    case "urgent": return "#dc2626";
    default: return "#374151";
  }
}

function getTaskStatusBgColor(status) {
  switch (status) {
    case "todo": return "#f3f4f6";
    case "em-progresso": return "#fef3c7";
    case "em-revisao": return "#dcfce7";
    case "concluida": return "#f0fdf4";
    case "bloqueada": return "#fee2e2";
    default: return "#ffffff";
  }
}

function getTaskStatusTextColor(status) {
  switch (status) {
    case "todo": return "#374151";
    case "em-progresso": return "#d97706";
    case "em-revisao": return "#166534";
    case "concluida": return "#16a34a";
    case "bloqueada": return "#b91c1c";
    default: return "#000000";
  }
}

function getStatusBgColor(status) {
  switch (status) {
    case "Planejamento": return "#eff6ff";
    case "Em Andamento": return "#fef3c7";
    case "Em Desenvolvimento": return "#dcfce7";
    case "Quase Concluído": return "#f0fdf4";
    case "Concluído": return "#ecfdf5";
    case "Pausado": return "#fee2e2";
    default: return "#f3f4f6";
  }
}

function getStatusTextColor(status) {
  switch (status) {
    case "Planejamento": return "#2563eb";
    case "Em Andamento": return "#d97706";
    case "Em Desenvolvimento": return "#166534";
    case "Quase Concluído": return "#16a34a";
    case "Concluído": return "#065f46";
    case "Pausado": return "#b91c1c";
    default: return "#374151";
  }
}

function getPriorityStyle(priority) {
  switch (priority) {
    case "Alta":
      return "background-color: #fef2f2; color: #dc2626;";
    case "Média":
      return "background-color: #fef3c7; color: #d97706;";
    case "Baixa":
      return "background-color: #f0fdf4; color: #16a34a;";
    default:
      return "background-color: #f3f4f6; color: #374151;";
  }
}

function getTaskPriorityBgColor(priority) {
  switch (priority) {
    case "alta":
      return "#fef2f2"; 
    case "media":
      return "#fef3c7"; 
    case "baixa":
      return "#f0fdf4"; 
    default:
      return "#f3f4f6"; 
  }
}

function getTaskPriorityTextColor(priority) {
  switch (priority) {
    case "alta":
      return "#dc2626"; 
    case "media":
      return "#d97706"; 
    case "baixa":
      return "#16a34a"; 
    default:
      return "#374151"; 
  }
}

function getTaskPriorityColor(priority) {
  switch (priority) {
    case "alta":
      return "#dc2626"; 
    case "media":
      return "#d97706"; 
    case "baixa":
      return "#16a34a"; 
    default:
      return "#6b7280"; 
  }
}