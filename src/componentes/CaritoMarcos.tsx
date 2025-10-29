import { useEffect } from "react";
import type { ProducInterface } from "../api/interfaces/general-Interfaces"

interface Props{
  compraProducto:ProducInterface | null;
}

export const CaritoMarcos = ({compraProducto}:Props) => {

  useEffect(() => {
    
  console.log(compraProducto?.price);
  
    
  }, [compraProducto])
  
  
  return (
    <>
  <div>
    
  </div>
    
    </>
  )
}
