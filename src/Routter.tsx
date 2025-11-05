import { Routes, Route } from "react-router-dom";
import { ListadoGeneral } from "./ListadoGeneral";
import { CRUD } from "./CRUD";

export const Routter=() =>  {
 return (
   <Routes>
     <Route path="/" element={<ListadoGeneral />} />
     <Route path="/Crud" element={<CRUD />} />
     {/* <Route path="/usuarios/:id" element={<UsuarioDetalle />} /> */}
     {/* Ruta comodín para páginas no encontradas */}
     <Route path="*" element={<ListadoGeneral />} />
   </Routes>
 );
}

