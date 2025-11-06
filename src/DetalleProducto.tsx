import { useParams } from "react-router-dom";

export const DetalleProducto = () => {
  const { id } = useParams(); 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Detalle del producto {id}</h1>
    
    </div>
  );
};
