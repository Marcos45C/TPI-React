import { useEffect, useState } from "react";
//donde hago la peticion
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";

import { Categoriasss } from "./componentes/Categorias";
import {  Productos } from "./componentes/Productos";

import { CaritoMarcos } from "./componentes/CaritoMarcos";


export const ListadoGeneral = () => {
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [productoss, setProductoss] = useState<ProducInterface[]>([]);
    
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const [compraProducto, setCompraProducto] = useState<ProducInterface| null>(null);
  


    useEffect(() => {
        getCategoris()
            .then(setCategoriass)//si da bien y es lo mismo de hacer asi .then((data) => setCategoriass(data))
            .catch((i) => console.error("error al cargar categorías:", i));
        getProductis()
            .then(setProductoss)//
            .catch((i) => console.error("error al cargar productos:", i));
    }, []);

    
    // esta funcion la pasamos al hijo
  const handleCategorySelect = (id: number | null) => {    
    if (selectedCategory==id) {
      console.log("toco la misma categoria");
      setSelectedCategory(null);
    }else{
      console.log("toco la categoria con id ", id);
    setSelectedCategory(id);
    }
  };

  //funcion para recibir el producto seleccionado al comprar
  const comprarProductos =(producto:ProducInterface)=>{
    setCompraProducto({...producto}); //esto lo puse asi porque tuve que reenderizar los productos para que se actualicen
  }


    return (

    <div className="p-4 max-w-6xl mx-auto"> {/*centre el contenedor un poco*/}
      <h2 className="text-2xl font-bold mb-4">Listado General de Categorías</h2>
      <Categoriasss 
      categories={categoriass} //aca le mando los categorias 
      onCategorySelect={handleCategorySelect}
      />
      <Productos
        productos={productoss} //aca le mando los productos 
        selectedCategory={selectedCategory}
        compraProduc={comprarProductos}
      />
      <CaritoMarcos
      compraProducto={compraProducto}
      />
    </div>
  );
};