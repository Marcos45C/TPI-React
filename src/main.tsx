import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

// import { ListadoGeneral } from './ListadoGeneral'
// import { CartProvider } from './context/CartContext' 
import { CRUD } from './CRUD'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*envuelve la App*/}
    {/* <CartProvider>
    <ListadoGeneral />
    </CartProvider> */}
    <CRUD/>
  </StrictMode>,
)
