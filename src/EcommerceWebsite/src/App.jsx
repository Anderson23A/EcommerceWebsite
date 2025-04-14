import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProdutosPagina from './paginas/produtos/produtos'
import MainNavbar from './componentes/navbar/Navbar'
import ProdutoPagina from './paginas/produto/produto'
import SucessoPagina from './paginas/sucesso/sucesso'


function Redirecionar() {
  window.location.href = '/produtos/'
  return (<></>)
}

function App() {

  return (
    <>
      <MainNavbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Redirecionar />} />
          <Route path='/produtos/' element={<ProdutosPagina />} />
          <Route path='/produto/:produtoId' element={<ProdutoPagina/>}/>
          <Route path='/sucesso/' element={<SucessoPagina/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
