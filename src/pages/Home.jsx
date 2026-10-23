import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { mensagemDeErro } from "../services/utils"
import CardChamado from "../components/CardChamado"

function Home() {
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [tipo, setTipo] = useState("")
  const [local, setLocal] = useState("")
  const [prioridade, setPrioridade] = useState("")

  const [tipos, setTipos] = useState([])
  const [locais, setLocais] = useState([])
  const [prioridades, setPrioridades] = useState([])

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const t = await api.get("/tipos")
        const l = await api.get("/locais")
        const p = await api.get("/prioridades")
        setTipos(t.data)
        setLocais(l.data)
        setPrioridades(p.data)
      } catch (e) {
        setErro(mensagemDeErro(e))
      }
    }
    carregarOpcoes()
  }, [])

  useEffect(() => {
    async function carregarChamados() {
      try {
        setCarregando(true)
        setErro("")

        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (tipo) params.tipo = tipo
        if (local) params.local = local
        if (prioridade) params.prioridade = prioridade

        const resposta = await api.get("/chamados", { params })
        setChamados(resposta.data)
      } catch (e) {
        setErro("Não foi possível carregar. Verifique sua chave.")
      } finally {
        setCarregando(false)
      }
    }
    carregarChamados()
  }, [busca, status, tipo, local, prioridade])

  return (
    <div>
      <div className="topo-lista">
        <h2>Chamados</h2>
        <Link to="/novo" className="botao">+ Abrir chamado</Link>
      </div>

      <div className="filtros">
        <input
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="aberto">aberto</option>
          <option value="em andamento">em andamento</option>
          <option value="resolvido">resolvido</option>
        </select>

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Tipo</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local</option>
          {locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
          <option value="">Prioridade</option>
          {prioridades.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando chamados...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && chamados.length === 0 && (
        <p>Nenhum chamado encontrado.</p>
      )}

     <div className="lista">
        {chamados.map((chamado) => (
          <CardChamado key={chamado.id} chamado={chamado} />
        ))}
      </div>
    </div>
  )
}

export default Home