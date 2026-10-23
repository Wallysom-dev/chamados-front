import { Link } from "react-router-dom"
import { formatarData } from "../services/utils"

function CardChamado({ chamado }) {
  return (
    <Link to={`/chamado/${chamado.id}`} className="card">
      <h3>{chamado.titulo}</h3>
      <p>
        {chamado.local} · {chamado.tipo} · {formatarData(chamado.data_abertura)}
      </p>
      <span className={`etiqueta ${chamado.status.replace(" ", "-")}`}>
        {chamado.status}
      </span>
      <span className="etiqueta">{chamado.prioridade}</span>
    </Link>
  )
}

export default CardChamado