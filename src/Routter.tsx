import { Routes, Route } from "react-router-dom";
import { ListadoGeneral } from "./ListadoGeneral";
import { CRUD } from "./componentes/CRUD";
import { DetalleProducto } from "./DetalleProducto";
import { FormularioCategoria } from "./componentes/FormularioCategoria";
import { FormularioProducto } from "./componentes/FormularioProducto";
import { FormularioTag } from "./componentes/FormularioTag";
import { AnadirTagsProducto } from "./componentes/AnadirTagsProducto";
import { CategoriaPage } from "./CategoriaPage";
import { RutaProtegida } from "./componentes/RutaProtegida";

export const Routter = () => {
  return (
    <Routes>
      <Route path="/" element={<ListadoGeneral />} />
    
      <Route path="/detalle/:id" element={<DetalleProducto />} />

      <Route 
      path="/Crud" 
      element={
        <RutaProtegida>
      <CRUD />
      </RutaProtegida>
      } />
      {/* categorias creacion y post o put*/}
      <Route path="/categoria/nueva" element={<FormularioCategoria />} />
      <Route path="/categoria/editar" element={<FormularioCategoria />} />

      
        {/* productos creacion y post o put  y añadir tags*/}
        <Route path="/productos/nuevo" element={<FormularioProducto />} />
        <Route path="/productos/editar/" element={<FormularioProducto />} />
        <Route path="/productos/añadirTags/" element={<AnadirTagsProducto />} />


        {/* tags creacion y post o put*/}
        <Route path="/tags/nuevo" element={<FormularioTag />} />
        <Route path="/tags/editar" element={<FormularioTag />} />

      {/* crear un componente cuando ponga cualquier url  */}
      <Route path="/categoria/:id" element={<CategoriaPage />} /> {/*la nueva ruta*/}
      {/* crear una pagina con error 404  */}
      <Route path="*" element={<ListadoGeneral />} />
    </Routes>
  );
};
