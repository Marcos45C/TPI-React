import { useEffect, useState } from "react";
//donde hago la peticion
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";


import { Categoriasss } from "./componentes/Categorias";
import {  Productos } from "./componentes/Productos";

import { Carrito } from "./componentes/Carrito";
import { CartToggleButton } from "./componentes/CartToggleButton";

export const ListadoGeneral = () => {
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [productoss, setProductoss] = useState<ProducInterface[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
    useEffect(() => {
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
    <div className="p-4 max-w-6xl mx-auto"> {/*centre el contenedor un poco*/}
    
 
    {/* Btn flotante del carrito */}
      <CartToggleButton/>

       {/**Aca va el carrito */}
      <Carrito/>

      <h2 className="text-2xl font-bold mb-4">Listado General de Categorías</h2>
     
      {/* Acá mostramos el componente de categorías */}
      <Categoriasss 
      categories={categoriass} //aca le mando los productos
      onCategorySelect={handleCategorySelect}
      />

      <Productos
        productos={productoss}
        selectedCategory={selectedCategory}
      />

    </div>
  );
};