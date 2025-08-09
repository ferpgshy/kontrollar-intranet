function getNoticeTypeLabel(type) {
  switch (type) {
    case "policy": return "Política";
    case "maintenance": return "Manutenção";
    case "announcement": return "Anúncio";
    case "urgent": return "Urgente";
    default: return type;
  }
}

function getTaskStatusLabel(status) {
  switch (status) {
    case "todo": return "A Fazer";
    case "em-progresso": return "Em Progresso";
    case "em-revisao": return "Em Revisão";
    case "concluida": return "Concluída";
    case "bloqueada": return "Bloqueada";
    default: return status;
  }
}

function cargosLabel(role) {
  switch (role) {
    case "admin": return "Administrador";
    case "manager": return "Gerente";
    case "employee": return "Funcionário";
    default: return "Desconhecido";
  }
}
