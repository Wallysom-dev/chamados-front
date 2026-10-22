import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Cabecalho() {
  const [nome, setNome] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get("/eu")
        setNome(resposta.data.nome)
      } catch (erro) {
        setNome("")
      }
    }
    carregar()
  }, [])

  return (
    <header className="cabecalho">
      <Link to="/">Diário de Chamados</Link>
      <span>{nome ? `Olá, ${nome}` : "Chave inválida"}</span>
    </header>
  )
}

export default Cabecalho