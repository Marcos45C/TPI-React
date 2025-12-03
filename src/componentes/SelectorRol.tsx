import { useEffect, useState } from "react";

export const SelectorRol = () => {
  
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rolUsuario");
    if (rolGuardado === "admin") {
      setEsAdmin(true);
    }
  }, []);

  //Función para cambiar de rol
    const cambiarRol = (nuevoRol: 'admin' | 'cliente') => {
    localStorage.setItem("rolUsuario", nuevoRol);

    window.location.reload();
 };

 return (
    <div className="fixed top-4 left-4 z-50 w-max bg-white/95 backdrop-blur-sm border border-gray-200 p-3 rounded-xl shadow-lg transition-all hover:shadow-xl">
      {/* Estado Actual */}
      <div className={`mb-2 text-center text-xs font-bold uppercase tracking-wider py-1 rounded ${
          esAdmin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
      }`}>
        {esAdmin ? '🔑 Admin' : '👤 Cliente'}
      </div>

      <div className="flex gap-2">
        <button 
            onClick={() => cambiarRol('cliente')}
            className={`p-2 rounded-lg transition-colors border ${
            !esAdmin ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-400 border-gray-200 hover:border-green-500 hover:text-green-600'
            }`}
            title="Cambiar a Cliente">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </button>
        <button 
            onClick={() => cambiarRol('admin')}
            className={`p-2 rounded-lg transition-colors border ${
            esAdmin ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-200 hover:border-red-500 hover:text-red-600'
            }`}
            title="Cambiar a Admin">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
        </button>
            </div>
        </div>
          );     
        }
