import {  useNavigate } from "react-router-dom";
import type { ProducInterface } from "../api/interfaces/general-Interfaces";
import imgDefecto from "../imagenes/logoCenter.png";

interface Props {
  productos: ProducInterface[];
  selectedCategory: number | null;
   compraProduc: (producto: ProducInterface) => void; // pra devolver todo el producto entero
}

export const Productos = ({ productos, selectedCategory,compraProduc }: Props) => {


  // filtrar productos según la categoría seleccionada
  const filteredProducts = selectedCategory
    ? productos.filter((prod) => prod.categoria_id === selectedCategory)
    : productos; // si no hay seleccion, muestra todos

    //aca es para navevar entre componente y llevarle el id y que el componente haga una fetch
    const navigate = useNavigate();
    const irADetalle = (id: number) => {
    navigate(`/detalle/${id}`); 
  };


  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Productos</h2>
      {filteredProducts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <li
              key={prod.id}
              className="max-w-96 shadow-lg bg-gray-100 h-full flex flex-col rounded-lg overflow-hidden transition hover:scale-[1.02]"
            >
              <div className="relative cursor-pointer border-3 border-white hover:border-red-600" onClick={() => irADetalle(prod.id)}>
                <img
                  src={
                    prod.pictures && prod.pictures.length > 0
                      ? `http://161.35.104.211:8000${prod.pictures[0]}`
                      : imgDefecto // agrege la imagen por defecto
                  }
                  alt={prod.title}
                  className="aspect-square w-full mix-blend-multiply brightness-110 object-cover"
                />
              </div>
              <div className="flex-1 p-3 bg-white flex flex-col justify-between">
                <h2 className="text-xl font-bold mb-1">
                    {prod.title}
                </h2>
                <p className="text-gray-500 mb-2">{prod.description}</p>
                {prod.price && (
                  <div className="text-2xl font-semibold text-green-600">
                    ${prod.price}
                  </div>
                )}
                <button
                
                  onClick={() => compraProduc(prod)}
                  className="mt-3 bg-gray-200 text-black px-3 py-2 rounded border border-stone-300 hover:bg-red-700 hover:text-white hover:border-transparent transition duration-300"
                >
                  Agregar al carrito
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
           {/**Aca agregue un icono svg, en el caso de que no hayan productos en la categoria*/}
          <svg
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 30 30"
              className="w-32 h-32 text-red-700 mb-4">
               <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.2"/>
               <circle cx="9" cy="10" r="1.3" fill="currentColor"/>
               <circle cx="15" cy="10" r="1.3" fill="currentColor"/>
               <path d="M8 16c1-.9 2.3-1.4 4-1.4s3 .5 4 1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          
        <p className="text-gray-500 text-lg font-medium">
          Up! no encontre productos para esta Categoría. Perdón.
        </p>
        </div>
      )}
    </div>
  );
};
