import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

import { ListadoGeneral } from './ListadoGeneral'
import { CRUD } from './CRUD'
import { BrowserRouter } from 'react-router-dom'
import { Formulario } from './formulario'
import { Routter } from './Routter'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    {/* <ListadoGeneral /> */}
    {/* <CRUD/> */}
    {/* <Formulario/> */}
    <Routter/>
    </BrowserRouter>
  </StrictMode>,
)
