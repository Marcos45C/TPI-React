import { useEffect, useState } from "react";
//donde hago la peticion (Servicios)
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type {
  CategoryInterfaz,
  ProducInterface,
} from "./api/interfaces/general-Interfaces";
//Componentes
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

  //agregue la logica de filtrado, para buscar por producto, descripcion o categoria
  const filteredProducts = productoss.filter((p) => {
    const categoria = categoriass.find((c) => c.id == p.category_id);
    const textoBusqueda = searchTerm.toLowerCase(); //guarda el texto recibido y lo pasa a minuscul

    const matchesCategory =
      selectedCategory === null || p.category_id === selectedCategory;

    const categoriaExiste = categoria?.title?.toLowerCase() ?? ""; //comprueba que exista la categoria

    const matchesSearch = //aca se basa la logica del buscado
      p.title.toLowerCase().includes(textoBusqueda) ||
      p.description?.toLowerCase().includes(textoBusqueda) ||
      categoriaExiste?.includes(textoBusqueda);

    return matchesCategory && matchesSearch; //retorna lo buscado a tiempo real
  });

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
    // Esto hace que las tarjetas blancas de los productos resalten más (efecto profundidad diria io).
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* class="bg-white min-h-screen pb-8 flex flex-col" */}
      {/* Contenedor principal centrado */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/*Encabezado, con color gris oscuro y espacios entre letras*/}
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {" "}
            Listado General de Categorías{" "}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Explora nuestros productos y agrega lo que quieras al carrito para
            llevarte!
          </p>
        </header>

        {/*Seccion de las categorias*/}
        <section className="mb-10">
          <Categoriasss
            categories={categoriass}
            onCategorySelect={handleCategorySelect}
          />
        </section>

        {/**Barra de busqueda */}
        <div className="relative max-w-lg mx-auto mb-10">
          <input
            type="text"
            placeholder="🔎 Buscar producto, descripcion o categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-6 text-gray-700 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
          />
        </div>

        {/*Seccion de productos*/}
        <section>
          {/*agrege un titulo*/}
          <div className="flex items-center justify-between mb-6">
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
