import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { mensagemDeErro, formatarData } from "../services/utils"

function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [chamado, setChamado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [responsavel, setResponsavel] = useState("")
  const [solucao, setSolucao] = useState("")
  const [confirmando, setConfirmando] = useState(false)

  async function carregar() {
    try {
      const resposta = await api.get(`/chamados/${id}`)
      setChamado(resposta.data)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  async function iniciar() {
    try {
      setErro("")
      await api.patch(`/chamados/${id}/iniciar`, { responsavel })
      setResponsavel("")
      carregar()
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  async function resolver() {
    try {
      setErro("")
      await api.patch(`/chamados/${id}/resolver`, { solucao })
      setSolucao("")
      carregar()
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  async function excluir() {
    try {
      await api.delete(`/chamados/${id}`)
      navigate("/")
    } catch (e) {
      setErro(mensagemDeErro(e))
      setConfirmando(false)
    }
  }

  if (carregando) return <p>Carregando chamado...</p>
  if (!chamado) return <p className="erro">{erro}</p>

  return (
    <div>
      <Link to="/">← Voltar</Link>

      <h2>{chamado.titulo}</h2>
      <p>
        <span className={`etiqueta ${chamado.status.replace(" ", "-")}`}>
          {chamado.status}
        </span>
        <span className="etiqueta">{chamado.prioridade}</span>
      </p>

      <p><strong>Descrição:</strong> {chamado.descricao}</p>
      <p><strong>Tipo:</strong> {chamado.tipo}</p>
      <p><strong>Local:</strong> {chamado.local}</p>
      <p><strong>Aberto em:</strong> {formatarData(chamado.data_abertura)}</p>
      {chamado.responsavel && (
        <p><strong>Responsável:</strong> {chamado.responsavel}</p>
      )}
      {chamado.solucao && (
        <p><strong>Solução:</strong> {chamado.solucao}</p>
      )}
      {chamado.data_resolucao && (
        <p><strong>Resolvido em:</strong> {formatarData(chamado.data_resolucao)}</p>
      )}

      {erro && <p className="erro">{erro}</p>}

      <div className="acoes">
        {chamado.status !== "resolvido" && (
          <Link to={`/editar/${id}`} className="botao">Editar</Link>
        )}
        <button className="perigo" onClick={() => setConfirmando(true)}>
          Excluir
        </button>
      </div>

      {confirmando && (
        <div className="caixa">
          <p>Tem certeza que deseja excluir este chamado?</p>
          <div className="acoes">
            <button className="perigo" onClick={excluir}>Excluir</button>
            <button className="cinza" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {chamado.status === "aberto" && (
        <div className="caixa">
          <h3>Próxima etapa: iniciar atendimento</h3>
          <input
            placeholder="Nome do responsável"
            maxLength="80"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
          />
          <button onClick={iniciar}>Iniciar</button>
        </div>
      )}

      {chamado.status === "em andamento" && (
        <div className="caixa">
          <h3>Próxima etapa: resolver</h3>
          <textarea
            rows="3"
            maxLength="300"
            placeholder="Descreva a solução"
            value={solucao}
            onChange={(e) => setSolucao(e.target.value)}
          />
          <button onClick={resolver}>Resolver</button>
        </div>
      )}
    </div>
  )
}

export default Detalhe