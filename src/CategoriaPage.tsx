import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductis } from "./servicios/get-api-productos";
import { getCategoris } from "./servicios/get-api-categoria";
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";
import { Productos } from "./componentes/Productos";
import { Carrito } from "./componentes/Carrito";

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
    <div className="min-h-screen bg-red-400">
    <div className="p-8 max-w-6xl mx-auto">
        {/*para volver a la pagina principal*/}
         <button onClick={() => navigate("/")}
            className="mb-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            volver
        </button>

      {categoria ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-white-700 text-center uppercase tracking-wide">
            {categoria.title}
          </h2>

            <div className="border-t-4 border-black-600 w-90 mx-auto mb-9"/>
      
          <Productos 
            productos={productos}
            selectedCategory={categoria.id}
            compraProduc={comprarProductos}
          />
       
          <Carrito compraProducto={compraProducto} />
        </>
      ) : (
        <p className="text-center text-black-600 font-semibold text-lg">
            Cargando categoría...
        </p>
      )}
      </div>
    </div>
  );
};