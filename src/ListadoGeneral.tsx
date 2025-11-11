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

    const [searchTerm, setSearchTerm] = useState<string>(""); 
  
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
 //agregue la logica de filtrado, para buscar por producto, descripcion o categoria
  const filteredProducts = productoss.filter((p) => {
    const categoria = categoriass.find((c) => c.id == p.categoria_id);
    const textoBusqueda = searchTerm.toLowerCase(); //guarda el texto recibido y lo pasa a minuscul

      const matchesCategory =
        selectedCategory === null || p.categoria_id === selectedCategory;

        const categoriaExiste = categoria?.title?.toLowerCase() ?? ""; //comprueba que exista la categoria

        const matchesSearch = //aca se basa la logica del buscado
         p.title.toLowerCase().includes(textoBusqueda) ||
         p.description?.toLowerCase().includes(textoBusqueda) ||
         categoriaExiste?.includes(textoBusqueda); 

  return matchesCategory && matchesSearch;  //retorna lo buscado a tiempo real
    });


    return (
    <div className="p-8 max-w-6xl mx-auto"> {/*centre el contenedor un poco*/}
          {/* class="bg-white min-h-screen pb-8 flex flex-col" */}
      <h2 className="text-2xl font-bold mb-4">Listado General de Categorías</h2>
      <Categoriasss 
      categories={categoriass} //aca le mando los categorias 
      onCategorySelect={handleCategorySelect}
      />
      {/*barra de busquedad */}
      <input 
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="border border-gray-300 rounded-md p-2 w-full mb-4"/>
      <Productos
        productos={filteredProducts} //aca le mando los productos filtrados
        selectedCategory={selectedCategory}
        compraProduc={comprarProductos}
      />
      <CaritoMarcos
      compraProducto={compraProducto}
      />
    </div>
  );
};