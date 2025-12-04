import { useEffect, useState } from "react";
//donde hago la peticion (Servicios)
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type {
  CategoryInterfaz,
  ProducInterface,
} from "./api/interfaces/general-Interfaces";
import { Link } from "react-router-dom"; 
//Componentes
import { SelectorRol } from "./componentes/SelectorRol";
import { Categoriasss } from "./componentes/Categorias";
import { Productos } from "./componentes/Productos";
import { Carrito } from "./componentes/Carrito";
import { Footer } from "./componentes/Footer";

//imagen de carga
import logoCarga from "./imagenes/logoCarga.png";

export const ListadoGeneral = () => {
  const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
  const [productoss, setProductoss] = useState<ProducInterface[]>([]);

  //Pantalla de carga
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [compraProducto, setCompraProducto] = useState<ProducInterface | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    //Promise.all sirve para esperar las 2 peticiones juntas.
    //asi no sucede eso de que va cargando de a uno.
    Promise.all([getCategoris(), getProductis()])
      .then(([catsData, prodsData]) => {
        setCategoriass(catsData);
        setProductoss(prodsData);
      })
      .catch((error) => {
        console.error("Error cargando datos:", error);
      })
      .finally(() => {
        //Sea que funciono o no, se quita el loading
        setIsLoading(false);
      });
  }, []);

  // esta funcion la pasamos al hijo
  const handleCategorySelect = (id: number | null) => {
    if (selectedCategory == id) {
      console.log("toco la misma categoria");
      setSelectedCategory(null);
    } else {
      console.log("toco la categoria con id ", id);
      setSelectedCategory(id);
    }
  };

  //funcion para recibir el producto seleccionado al comprar
  const comprarProductos = (producto: ProducInterface) => {
    setCompraProducto({ ...producto }); //esto lo puse asi porque tuve que reenderizar los productos para que se actualicen
  };

  //agregue la logica de filtrado, para buscar por producto, descripcion
  const filteredProducts = productoss.filter((p) => {
    const textoBusqueda = searchTerm.toLowerCase(); //guarda el texto recibido y lo pasa a minuscula

    const matchesSearch = //aca se basa la logica del buscado
      p.title.toLowerCase().includes(textoBusqueda) ||
      p.description?.toLowerCase().includes(textoBusqueda);

    return matchesSearch; //retorna lo buscado a tiempo real
  });

  const esAdmin = localStorage.getItem("rolUsuario") === "admin";

  //Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 anime-pulse">
          Cargando el supermercado...
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <p className="text-gray-500 text-sm">
            Preparando los productos para tí...
          </p>
          <img
            src={logoCarga}
            alt="Cargando"
            className="w-4 h-4 object-contain animate-bounce"
          />
        </div>
      </div>
    );
  }

  return (
    // Esto hace que las tarjetas blancas de los productos resalten más.
    <div className="min-h-screen bg-gray-50">
      <div>
       <SelectorRol/>
       </div>
       {/*La condional, si admin es true muestra el panel de crud*/}
          {esAdmin && (  
            <Link to="/Crud" 
            className="fixed bottom-4 mt-12 left-2 z-30 flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-full hover:bg-black  text-sm font-medium transform hover:-translate-y-0.5">
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
             <circle 
             cx="12" 
             cy="12" 
             r="3"/>
              <path
               d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15v-.09a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.33-.4 1.51-1A1.65 1.65 0 0 0 4.6 8.09l-.06-.06A2 2 0 1 1 7.37 4.2l.06.06c.38.38.9.51 1.39.33.45-.16.94-.25 1.44-.25.5 0 .99.09 1.44.25.49.18 1.01.05 1.39-.33l.06-.06A2 2 0 1 1 16.63 7.8l-.06.06c-.18.58-.06 1.24.33 1.7.27.31.68.45 1.06.39.49-.08.98-.02 1.44.17.18.09.34.22.46.39.16.24.22.53.17.81z"/>
              </svg>
              Control
            </Link>     
          )}
      {/* class="bg-white min-h-screen pb-8 flex flex-col" */}
      {/* Contenedor principal centrado */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-10 lg:pt-10">
        {/*Encabezado*/}
        <header className="mb-8 text-center md:text-left">
          <div>
          <h2 
          className="text-3xl md:text-5xl font-extrabold pt-10 text-gray-900 tracking-tight">
            Listado General de Categorías
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Explora nuestros productos y agrega lo que quieras al carrito para
            llevarte!
          </p>
          </div>
          
        </header>

        {/*Seccion de las categorias*/}
        <section className="mb-12">
          <Categoriasss
            categories={categoriass}
            onCategorySelect={handleCategorySelect}
          />
        </section>

        {/**Barra de busqueda */}
        <div className="relative w-full max-w-lg mx-auto mb-12">
          <input
            type="text"
            placeholder="🔎 Buscar producto, descripcion"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-6 text-gray-700 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
          />
        </div>

        {/*Seccion de productos*/}
        <section>
          {/*agregue un titulo*/}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 sm:gap-0">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedCategory
                ? "Productos de la categoría"
                : "Todos los productos"}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              {filteredProducts.length} Resultados
            </span>
          </div>

          <Productos
            productos={filteredProducts}
            selectedCategory={selectedCategory}
            compraProduc={comprarProductos}
          />
        </section>
      </div>
      <Footer />
      <Carrito compraProducto={compraProducto} />
    </div>
  );
};
