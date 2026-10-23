import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { mensagemDeErro } from "../services/utils"

function FormularioChamado({ id }) {
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("")
  const [local, setLocal] = useState("")
  const [prioridade, setPrioridade] = useState("")
  const [dataAbertura, setDataAbertura] = useState(
    new Date().toLocaleDateString("sv-SE")
  )

  const [tipos, setTipos] = useState([])
  const [locais, setLocais] = useState([])
  const [prioridades, setPrioridades] = useState([])

  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [bloqueado, setBloqueado] = useState(false)

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
    if (!id) return

    async function carregarChamado() {
      try {
        const resposta = await api.get(`/chamados/${id}`)
        const c = resposta.data

        if (c.status === "resolvido") {
          setBloqueado(true)
          setErro("Chamados resolvidos não podem ser editados.")
          return
        }

        setTitulo(c.titulo)
        setDescricao(c.descricao)
        setTipo(c.tipo)
        setLocal(c.local)
        setPrioridade(c.prioridade)
        setDataAbertura(c.data_abertura)
      } catch (e) {
        setErro(mensagemDeErro(e))
      }
    }
    carregarChamado()
  }, [id])

  async function enviar(evento) {
    evento.preventDefault()
    setErro("")
    setSucesso("")

    const dados = {
      titulo,
      descricao,
      tipo,
      local,
      prioridade,
      data_abertura: dataAbertura
    }

    try {
      if (id) {
        await api.put(`/chamados/${id}`, dados)
      } else {
        await api.post("/chamados", dados)
      }
      setSucesso("Chamado salvo com sucesso!")
      setTimeout(() => navigate("/"), 1000)
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <fieldset disabled={bloqueado}>
        <label>Título</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          minLength="3"
          maxLength="80"
        />

        <label>Descrição</label>
        <textarea
          rows="4"
          maxLength="500"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label>Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="">Selecione...</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Local</label>
        <select value={local} onChange={(e) => setLocal(e.target.value)} required>
          <option value="">Selecione...</option>
          {locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <label>Prioridade</label>
        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
          <option value="">Selecione...</option>
          {prioridades.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label>Data de abertura</label>
        <input
          type="date"
          value={dataAbertura}
          onChange={(e) => setDataAbertura(e.target.value)}
          required
        />
      </fieldset>

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}

      <div className="acoes">
        <button type="submit" disabled={bloqueado}>Salvar</button>
        <button type="button" className="cinza" onClick={() => navigate("/")}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default FormularioChamado