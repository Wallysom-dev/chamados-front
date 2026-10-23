import { useParams } from "react-router-dom"
import FormularioChamado from "../components/FormularioChamado"

function EditarChamado() {
  const { id } = useParams()

  return (
    <div>
      <h2>Editar chamado</h2>
      <FormularioChamado id={id} />
    </div>
  )
}

export default EditarChamado