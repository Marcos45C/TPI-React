import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { BrowserRouter } from 'react-router-dom'
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
