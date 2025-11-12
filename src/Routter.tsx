import { Routes, Route } from "react-router-dom";
import { ListadoGeneral } from "./ListadoGeneral";
import { CRUD } from "./CRUD";
import { DetalleProducto } from "./DetalleProducto";
import { CategoriaPage } from "./CategoriaPage"; //este es para la consigna 

export const Routter = () => {
  return (
    <Routes>
      <Route path="/" element={<ListadoGeneral />} />
      <Route path="/Crud" element={<CRUD />} />
      <Route path="/detalle/:id" element={<DetalleProducto />} />
      <Route path="/categoria/:id" element={<CategoriaPage />} /> {/*la nueva ruta*/}
      {/* crear una pagina con error 404  */}
      <Route path="*" element={<ListadoGeneral />} />
    </Routes>
  );
};
