import { Routes, Route } from "react-router-dom";
import { ListadoGeneral } from "./ListadoGeneral";
import { CRUD } from "./componentes/CRUD";
import { DetalleProducto } from "./DetalleProducto";
import { FormularioCategoria } from "./componentes/FormularioCategoria";
import { FormularioProducto } from "./componentes/FormularioProducto";
import { FormularioTag } from "./componentes/FormularioTag";

export const Routter = () => {
  return (
    <Routes>
      <Route path="/" element={<ListadoGeneral />} />
     
      <Route path="/detalle/:id" element={<DetalleProducto />} />

      <Route path="/Crud" element={<CRUD />} />
      {/* categorias creacion y post o put*/}
      <Route path="/categoria/nueva" element={<FormularioCategoria />} />
      <Route path="/categoria/editar/:id" element={<FormularioCategoria />} />

      
        {/* productos creacion y post o put */}
        <Route path="/productos/nuevo" element={<FormularioProducto />} />
        <Route path="/productos/editar/:id" element={<FormularioProducto />} />

        {/* tags creacion y post o put*/}
        <Route path="/tags/nuevo" element={<FormularioTag />} />
        <Route path="/tags/editar/:id" element={<FormularioTag />} />

      {/* crear un componente cuando ponga cualquier url  */}
      <Route path="*" element={<ListadoGeneral />} />
    </Routes>
  );
};
