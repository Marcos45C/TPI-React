import { useEffect, useState } from "react";

export const SelectorRol = () => {
  const [esAdmin, setEsAdmin] = useState(false);

  //Estado del login
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rolUsuario");
    if (rolGuardado === "admin") {
      setEsAdmin(true);
    }
  }, []);

  //Función para cambiar de rol y recarga la página
    const cambiarRol = (nuevoRol: 'admin' | 'cliente') => {
    localStorage.setItem("rolUsuario", nuevoRol);

    window.location.reload();
 };
  
   //lógica del login
   const handleLoginSubmit = (e: React.FormEvent) =>{
    e.preventDefault();
   

   if(password === "admin"){
    cambiarRol('admin');
   }else {
    setError("Contraseña incorrecta. Pone: admin"); //para no dar tantas vueltas dejo la contra aca
    setTimeout(() => setError(""), 3000);
   }
  };


 return (
  <>
    <div className="fixed top-4 left-4 z-50 w-max bg-white/95 backdrop-blur-sm border border-gray-200 p-3 rounded-xl shadow-lg transition-all hover:shadow-xl">
      {/* Estado Actual */}
      <div className={`mb-2 text-center text-xs font-bold uppercase tracking-wider py-1 rounded ${
          esAdmin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
      }`}>
        {esAdmin ? '🔑 Admin' : '👤 Cliente'}
      </div>
        {/**cliente */}
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
            {/**admin */}
        <button 
            onClick={() => setShowLogin(true)} 
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
   {/*solo se muestra si setShowLogin es true, si le haces click para entrar como admin*/}
    {showLogin && (
      
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Cabecera del Modal */}
            <div className="bg-gray-900 p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            >
            <path
              fill="currentColor"
              d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-3 0H10V6a2 2 0 0 1 4 0v2z"/>
           </svg>
           </div>
          <h3 className="text-white font-bold text-lg">Acceso Restringido</h3>
              <p className="text-gray-400 text-sm">Solo personal autorizado</p>
          </div>
           
            <form onSubmit={handleLoginSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Contraseña de Administrador
                </label>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 outline-none focus:border-red-500 transition-colors"/>
                {error && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="#D32F2F"/>
                    <rect x="4.5" y="9" width="15" height="3" transform="rotate(-45 12 12)" fill="#FFF"/> 
                   </svg>
                   {error}
                  </p>
                )}
              </div>

                <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setShowLogin(false); setPassword(""); setError(""); }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/30">
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};