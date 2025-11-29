import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductis } from "./servicios/get-api-productos";
import { getCategoris } from "./servicios/get-api-categoria";
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";
import { Productos } from "./componentes/Productos";
import { Carrito } from "./componentes/Carrito";
import { Footer } from "./componentes/Footer";

export const CategoriaPage = () => {
  const { id } = useParams<{ id: string }>(); // obtiene el id de la URL
  const navigate = useNavigate(); 

  const [categoria, setCategoria] = useState<CategoryInterfaz | null>(null);
  const [productos, setProductos] = useState<ProducInterface[]>([]);
  const [compraProducto, setCompraProducto] = useState<ProducInterface | null>(null);

  useEffect(() => {
    getCategoris()
      .then((cats) => {
        const catEncontrada = cats.find((c) => c.id === Number(id)) || null;
        setCategoria(catEncontrada);
      })
      .catch(console.error);

    getProductis()
      .then((prods) => {
        const filtrados = prods.filter((p) => p.categoria_id === Number(id));
        setProductos(filtrados);
      })
      .catch(console.error);
  }, [id]);

  const comprarProductos = (producto: ProducInterface) => {
    setCompraProducto({ ...producto });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">

    <div className="p-8 max-w-6xl mx-auto w-full flex-grow">

        {/*para volver a la pagina principal*/}
        <div className="mb-6">
         <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M14 4l-8 8 8 8 1.4-1.4L9.8 12l5.6-5.6L14 4z"/>
          </svg>
           volver al inicio
         </button>
        </div>

      {categoria ? (
        <>
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border-l-4 border-red-500 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
            {categoria.title}
          </h2>
            <p className="text-gray-500 text-sm mt-1">Explora nuestra selección de productos</p>
          </div>
            <div className="border-t-4 border-black-600 w-90 mx-auto mb-9"/>
      
          <Productos 
            productos={productos}
            selectedCategory={categoria.id}
            compraProduc={comprarProductos}
          />
       
          <Carrito compraProducto={compraProducto} />
        </>
      ) : (
        //En lugar de un texto que diga "cargando categoria..." le agregue un spinner
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
           <p className="mt-4 text-gray-500 font-medium animate-pulse">
                    cargando productos...
           </p>
           </div>
      ) }
      </div>
      {/*agregue el footer también.*/}
      <Footer/>
    </div>
  );
};