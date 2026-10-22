export function mensagemDeErro(erro) {
  const detail = erro.response?.data?.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ")
  return "Não foi possível falar com a API. Verifique sua chave."
}

export function formatarData(data) {
  if (!data) return ""
  const [ano, mes, dia] = data.split("T")[0].split("-")
  return `${dia}/${mes}/${ano}`
}