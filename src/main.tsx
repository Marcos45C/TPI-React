import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

import { ListadoGeneral } from './ListadoGeneral'
import { CRUD } from './CRUD'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListadoGeneral />
    {/* <CRUD/> */}
  </StrictMode>,
)
