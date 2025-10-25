import { useEffect, useState } from "react";
//donde hago la peticion
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";


import { Categoriasss } from "./componentes/Categorias";
import {  Productos } from "./componentes/Productos";





export const ListadoGeneral = () => {
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [productoss, setProductoss] = useState<ProducInterface[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
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
            .catch((i) => console.error("error al cargar categorías:", i));
        getProductis()
            .then(setProductoss)//
            .catch((i) => console.error("error al cargar productos:", i));
    }, []);

    // Esta función la pasamos al hijo:
  const handleCategorySelect = (id: number | null) => {
    
    if (selectedCategory==id) {
      console.log("toco la misma categoria");
      setSelectedCategory(null);
    }else{
      console.log("Categoría seleccionada:", id);
    setSelectedCategory(id);
    }
   
  };


    return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Listado General de Categorías</h2>

      {/* Acá mostramos el componente de categorías */}
      <Categoriasss 
      categories={categoriass} //aca le mando los productos
      onCategorySelect={handleCategorySelect}
      />

      {/* {selectedCategory && (
        <p className="mt-4 text-gray-600">
          Mostrando productos de la categoría ID: {selectedCategory}
        </p>
        )} */}

      <Productos
        productos={productoss}
        selectedCategory={selectedCategory}
      />

    </div>
  );
};