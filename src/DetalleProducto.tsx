import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//Api y url
import { apiProduct, claveToken } from "./api/url/UrlGenerales";
import type { ProducInterface } from "./api/interfaces/general-Interfaces";
//Imagenes
import imgDefecto from "./imagenes/logoCenter.png";
import logoCarga from "./imagenes/logoCarga.png";
//componentes
import { Footer } from "./componentes/Footer";
import { Carrito } from "./componentes/Carrito";

import { Link } from "react-router-dom";
import { SelectorRol } from "./componentes/SelectorRol";

const mapApiProduct = (variable: any): ProducInterface => ({
  title: variable.title,
  description: variable.description,
  price: variable.price,
  category_id: variable.category_id,
  category_title: variable.category?.title || "sin categoria", //directamente desde aca se define si tiene o no categoria, más simple.
  id: variable.id,
  pictures: variable.pictures,
  tags: variable.tags || [], // Añadido por si acaso
});

export const DetalleProducto = () => {
  const { id } = useParams<{id: string }>(); 
  const navigate = useNavigate();

  //Estados del producto
  const [producto, setProducto] = useState<ProducInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //Estado del carrito 
  const [compraProducto, setCompraProducto] = useState<ProducInterface | null>(null);


 //useEffect se ejecuta cuando se monta el componente
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No se proporcionó un ID de producto.");
      return;
    }
  
  const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        //Hacemos el fetch directamente
        const respuesta = await fetch(`${apiProduct}${id}`, {
            method: 'GET',
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${claveToken}`
            },
          });

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} al buscar producto ${id}`);
        }

        const data = await respuesta.json();

        setProducto(mapApiProduct(data));

      }catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
  };

  fetchProducto();
  }, [id]);

 //función para agregar al carrito
 //Le agregue el descuento, además del 2x1 que agregue al CRUD.
 const handleAggregarCarrito = () => {
  if(producto) {

    setCompraProducto({...producto});
  }
 };


  if (loading) {
    return (
    <div 
    className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando detalles...</h2>
         <img src={logoCarga} alt="Cargando" className="w-8 h-8 mt-4 object-contain animate-bounce"/>
    </div> );
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ocurrió un error</h3>
                  <p className="text-gray-600">{error}</p>
                  <button onClick={() => navigate("/")} className="mt-6 text-red-600 hover:underline">
                    Volver al inicio
                </button>
                </div>
          </div>
  }

  if (!producto) {
    return <div className="p-4 text-center">Producto no encontrado.</div>;
  }

  //muestra el producto
  const imageUrl = (producto.pictures && producto.pictures.length > 0)
    ? `http://161.35.104.211:8000${producto.pictures[0]}`
    : imgDefecto;

  const tieneTagDescuento = producto.tags?.some((t: any) => t.title.toLowerCase().includes("descuento"));
  const precioOriginal = producto.price || 0;
  const porcentaje = 15;
  const precioFinal = tieneTagDescuento ? precioOriginal - (precioOriginal * (porcentaje / 100)) : precioOriginal;
   
  const esAdmin = localStorage.getItem("rolUsuario") === "admin";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
       <SelectorRol/>
      </div>
             {/*La condional, si admin es true muestra el panel de crud*/}
         {esAdmin && (  
          <Link to="/Crud" 
             className="fixed bottom-6 mt-12 left-2 z-30 flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-full hover:bg-black  text-sm font-medium transform hover:-translate-y-0.5">
             <svg 
             xmlns="http://www.w3.org/2000/svg"
              width="24"
               height="24"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true">             
              <circle cx="12" cy="12" r="3"/>
               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15v-.09a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.33-.4 1.51-1A1.65 1.65 0 0 0 4.6 8.09l-.06-.06A2 2 0 1 1 7.37 4.2l.06.06c.38.38.9.51 1.39.33.45-.16.94-.25 1.44-.25.5 0 .99.09 1.44.25.49.18 1.01.05 1.39-.33l.06-.06A2 2 0 1 1 16.63 7.8l-.06.06c-.18.58-.06 1.24.33 1.7.27.31.68.45 1.06.39.49-.08.98-.02 1.44.17.18.09.34.22.46.39.16.24.22.53.17.81z"/>
            </svg>
             Control
         </Link>         
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow pt-20">

      {/**Boton para volver a listadoGeneral*/}
      <nav className="flex items-center text-sm text-gray-500 mb-8 mt-14 sm:mt-0">

          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200">
            
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24">
              <path 
              fill="currentColor" 
              d="M14 4l-8 8 8 8 1.4-1.4L9.8 12l5.6-5.6L14 4z"/>
            </svg>
             volver al inicio
          </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium truncate">{producto.title}</span>
        </nav>

        {/**Layout de la tarjeta del producto*/}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/**Columna izquierda, ira la imagen*/}
            <div className="bg-gray-100 p-8 flex items-center justify-center h-[500px]">
                <img 
                  src={imageUrl}
                  alt={producto.title}
                  className="max-h-full max-w-full object-contain drop-shadow-lg transition-transform hover:scale-105 duration-300"/>
            </div>
            {/**Columna derecha con la info*/}
            <div className="p-8 md:p-12 flex flex-col justify-center">
                    
                    {/* Título y Categoría */}
                    <span className="text-sm font-bold text-red-500 tracking-wider uppercase mb-2">
                     { producto.category_title }
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {producto.title}
                    </h1>

                    {/* Precio Modificado con Descuento */}
                    <div className="mb-6">
                      {tieneTagDescuento ? (
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl text-gray-400 line-through decoration-red-500">
                              ${precioOriginal}
                            </span>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                              {porcentaje}% OFF
                            </span>
                          </div>
                          <div className="text-5xl font-bold text-red-600">
                            ${precioFinal.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-5xl font-bold text-gray-800">
                          ${precioOriginal}
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    <div className="prose text-gray-600 mb-8 leading-relaxed">
                        <p>{producto.description}</p>
                    </div>

                    {/* Tags (Si existen) */}
                    {producto.tags && producto.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {producto.tags.map((tag: any, index: number) => (
                                                     <span
                                                       key={index}
                                                       className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                                         tag.title.toLowerCase().includes("descuento")
                                                           ? "text-red-600 bg-red-50 border-red-100" 
                                                           : "text-blue-600 bg-blue-50 border-blue-100"
                                                       }`}
                                                     >
                                                       #{tag.title}
                                                     </span>
                                                   ))}
                                                 </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">

                        <button 
                          onClick={handleAggregarCarrito}
                          className="flex-1 bg-red-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-red-700 transition shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2">
                            <span>🛒</span> Agregar al Carrito
                        </button>
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition">
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
      {/**el carrito */}
      <Carrito compraProducto={compraProducto}/>
      {/* Footer al final*/}
      <Footer />
    </div>
            
  );
};
