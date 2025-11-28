import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid de 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Columna 1: Marca y Eslogan */}
          <div>
            <h3 className="text-2xl font-bold text-red-500 mb-2">CenterFamily</h3>
            <p className="text-gray-400 text-sm">
              Tu supermercado de confianza, ahora digital. 
              Llevamos la calidad de siempre a la puerta de tu casa.
            </p>
          </div>
            {/** Primera columna: Enlaces rápidos*/}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-red-400 transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Ofertas Semanales</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Categorías</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Soporte</a></li>
            </ul>
          </div>
          {/**Segunda columna */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Contáctanos</h4>
            <ul className="space-y-2 text-sm text-gray-400">

              <li className="flex items-center gap-2">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"> {/**Icono de ubicacion */}
                    <title>Ubicación</title>
                    <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </span> Calle tanto 980, Ciudad
            </li>

            <li className="flex items-center gap-2"> {/**Aca el del telefono de la empresa */}
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>telefono</title>
                    <path fill="currentColor" d="M6.62 10.79a15.052 15.052 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.38 2.33.59 3.57.59.55 0 1 .45 1 1V21c0 .55-.45 1-1 1C10.63 22 2 13.37 2 3c0-.55.45-1 1-1h4.47c.55 0 1 .45 1 1 0 1.25.2 2.46.59 3.57.12.35.04.74-.24 1.02l-2.2 2.2z"/>
                </svg>
                </span>
                 +54 ** **-**** 
            </li>
            <li className="flex items-center gap-2"> {/**Icono del correo de la empresa */}
                 <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>correo</title>
                        <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v1l10 6 10-6V6c0-1.1-.9-2-2-2zm0 6-10 6L2 10v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8z"/>
                    </svg>
                 </span>
                 contacto@centerfamily.com
            </li>
        </ul>
    </div>
    </div> 
    <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2025 CenterFamily. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Iconos "fake" de redes sociales con emojis */}
            <span className="cursor-pointer hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>Instagram</title>
                    <path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5.3A4.7 4.7 0 1 1 7.3 12 4.7 4.7 0 0 1 12 7.3zm6.2-.8a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2zM12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3z"/>
                </svg>
            </span>
            <span className="cursor-pointer hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>Facebook</title>
                  <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H8.1V12h2.34V9.82c0-2.31 1.38-3.58 3.49-3.58.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.51l-.4 2.89h-2.11v6.99C18.34 21.13 22 17 22 12z"/>
                </svg>
            </span>
          </div>
        </div>
        </div>
    </footer>
  );
};