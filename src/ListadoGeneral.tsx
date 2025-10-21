import { useEffect, useState } from "react";
//donde hago la peticion
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";
import { Categoriasss } from "./Categoriasss";




export const ListadoGeneral = () => {
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);


    const [productoss, setProductoss] = useState<ProducInterface[]>([]);

      // Esta función la pasamos al hijo:
  const handleCategorySelect = (id: number | null) => {
    console.log("Categoría seleccionada:", id);
    setSelectedCategory(id);
  };


    useEffect(() => {
        // const fetchCategorias = async () => {
        //     const categoriesapi = await getCategoris();
        //     setCategoriass(categoriesapi);
        // };
         // const fetchProductos = async () => {
        //     const productosapi = await getProductis();
        //     setProductoss(productosapi);
        // };
        getCategoris()
            .then(setCategoriass)//si da bien y es lo mismo de hacer asi .then((data) => setCategoriass(data))
            .catch((e) => console.error("Error al cargar categorías:", e));
        getProductis()
            .then(setProductoss)//
            .catch((e) => console.error("Error al cargar productos:", e));
    }, []);

    return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Listado General de Categorías</h2>

      {/* Acá mostramos el componente de categorías */}
      <Categoriasss 
      categories={categoriass} //aca le mando los productos
      onCategorySelect={handleCategorySelect}
      />

      {selectedCategory && (
        <p className="mt-4 text-gray-600">
          Mostrando productos de la categoría ID: {selectedCategory}
        </p>
        )}

        
    </div>
  );
};