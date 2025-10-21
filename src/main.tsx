import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
// import { Listado } from './Listado'
// import { Producto } from './Producto'
import { ListadoGeneral } from './ListadoGeneral'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListadoGeneral />
  </StrictMode>,
)
