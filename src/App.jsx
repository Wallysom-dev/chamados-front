import { Routes, Route } from "react-router-dom"
import Cabecalho from "./components/Cabecalho"
import Home from "./pages/Home"
import Detalhe from "./pages/Detalhe"
import NovoChamado from "./pages/NovoChamado"
import EditarChamado from "./pages/EditarChamado"

function App() {
  return (
    <>
      <Cabecalho />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chamado/:id" element={<Detalhe />} />
          <Route path="/novo" element={<NovoChamado />} />
          <Route path="/editar/:id" element={<EditarChamado />} />
        </Routes>
      </main>
    </>
  )
}

export default App