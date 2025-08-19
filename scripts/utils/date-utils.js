let dataAtualCalendario = new Date();

function getDataBrasiliaFormatada() {
  const agoraUTC = new Date();
  const offsetBrasilia = -3 * 60;
  const horaBrasilia = new Date(agoraUTC.getTime() + offsetBrasilia * 60 * 1000);
  const ano = horaBrasilia.getFullYear();
  const mes = String(horaBrasilia.getMonth() + 1).padStart(2, "0");
  const dia = String(horaBrasilia.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarDataPtBR(dataIso) {
  const [ano, mes, dia] = String(dataIso || "").split("-");
  return (ano && mes && dia) ? `${dia}/${mes}/${ano}` : (dataIso || "");
}
