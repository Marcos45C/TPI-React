import { Routes, Route } from "react-router-dom";
import { ListadoGeneral } from "./ListadoGeneral";
import { CRUD } from "./CRUD";
import { DetalleProducto } from "./DetalleProducto";

export const Routter = () => {
  return (
    <Routes>
      <Route path="/" element={<ListadoGeneral />} />
      <Route path="/Crud" element={<CRUD />} />
      <Route path="/detalle/:id" element={<DetalleProducto />} />

      {/* crear un componente cuando ponga cualquier url  */}
      <Route path="*" element={<ListadoGeneral />} />
    </Routes>
  );
};
