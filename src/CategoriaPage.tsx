import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductis } from "./servicios/get-api-productos";
import { getCategoris } from "./servicios/get-api-categoria";
import type {
  CategoryInterfaz,
  ProducInterface,
} from "./api/interfaces/general-Interfaces";
import { Productos } from "./componentes/Productos";
import { Carrito } from "./componentes/Carrito";
import { Footer } from "./componentes/Footer";

import { Link } from "react-router-dom";
import { SelectorRol } from "./componentes/SelectorRol";

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
        const filtrados = prods.filter((p) => p.category_id === Number(id));
        setProductos(filtrados);
      })
      .catch(console.error);
  }, [id]);

  const comprarProductos = (producto: ProducInterface) => {
    setCompraProducto({ ...producto });
  };

   const esAdmin = localStorage.getItem("rolUsuario") === "admin";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <SelectorRol />
      </div>
      {esAdmin && (
        <Link
          to="/Crud"
          className="fixed bottom-6 left-4 z-40 flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg hover:bg-black text-sm font-medium transform hover:-translate-y-1 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15v-.09a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.33-.4 1.51-1A1.65 1.65 0 0 0 4.6 8.09l-.06-.06A2 2 0 1 1 7.37 4.2l.06.06c.38.38.9.51 1.39.33.45-.16.94-.25 1.44-.25.5 0 .99.09 1.44.25.49.18 1.01.05 1.39-.33l.06-.06A2 2 0 1 1 16.63 7.8l-.06.06c-.18.58-.06 1.24.33 1.7.27.31.68.45 1.06.39.49-.08.98-.02 1.44.17.18.09.34.22.46.39.16.24.22.53.17.81z" />
          </svg>
          Control
        </Link>
      )}
      {/*contenedor principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow mt-10 pt-22">
        {/*bóton de volver */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="transition-transform hover:-translate-x-1">
              <path
                fill="currentColor"
                d="M14 4l-8 8 8 8 1.4-1.4L9.8 12l5.6-5.6L14 4z"
              />
            </svg>
            Volver al inicio
          </button>
        </div>

        {categoria ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border-l-4 border-red-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
                  {categoria.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Explora nuestra selección de productos
                </p>
              </div>
            </div>
            
            <div className="border-t-4 border-black-600 w-90 mx-auto mb-9" />

            <Productos
              productos={productos}
              selectedCategory={categoria.id}
              compraProduc={comprarProductos}
            />

            <Carrito compraProducto={compraProducto} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">
              Cargando productos...
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}