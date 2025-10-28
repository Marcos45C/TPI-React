import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

import { ListadoGeneral } from './ListadoGeneral'
import { CartProvider } from './context/CartContext' // <- agregue el contexto 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*envuelve la App*/}
    <CartProvider>
    <ListadoGeneral />
    </CartProvider>
  </StrictMode>,
)
