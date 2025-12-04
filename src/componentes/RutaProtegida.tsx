import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element; // Esto representa el CRUD, al que hay que cuidar.
}

export const RutaProtegida = ({ children }: Props) => {
    const esAdmin = localStorage.getItem("rolUsuario") === "admin";
    
    if (!esAdmin) {
    // 'replace' borra el intento fallido del historial para que no pueda volver atrás
    return <Navigate to="/" replace />;
    }
    // 3. Si SÍ es admin, lo dejamos pasar y mostramos el contenido (children)
    return children;
  };
