import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//Api y url
import { apiProduct } from "./api/url/refugioHuellitas";
import type { ProducInterface } from "./api/interfaces/general-Interfaces";
//Imagenes
import imgDefecto from "./imagenes/logoCenter.png";
import logoCarga from "./imagenes/logoCarga.png";
//componentes
import { Footer } from "./componentes/Footer";
import { Carrito } from "./componentes/Carrito";

const mapApiProduct = (variable: any): ProducInterface => ({
  title: variable.title,
  description: variable.description,
  price: variable.price,
  category_id: variable.category_id,
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
              "Authorization": "Bearer div",
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto p-6 w-full flex-grow">

      {/**Boton para volver a listadoGeneral*/}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14 4l-8 8 8 8 1.4-1.4L9.8 12l5.6-5.6L14 4z"/>
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
                      { producto.categoria_id !==null ? `Categoría #${producto.categoria_id}` : 'Sin categoría'}
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {producto.title}
                    </h1>

                    {/* Precio */}
                    <div className="text-5xl font-bold text-gray-800 mb-6">
                        ${producto.price}
                    </div>

                    {/* Descripción */}
                    <div className="prose text-gray-600 mb-8 leading-relaxed">
                        <p>{producto.description}</p>
                    </div>

                    {/* Tags (Si existen) */}
                    {producto.tags && producto.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {producto.tags.map((tag: any, index: number) => (
                                <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                    #{tag.title} 
                                </span>
                             ) 
                              ) }
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
      {/* Footer al final */}
      <Footer />
    </div>
            
  );
};
