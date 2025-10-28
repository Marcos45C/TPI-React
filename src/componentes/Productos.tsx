

import type { ProducInterface } from "../api/interfaces/general-Interfaces";
import { useCart } from '../context/CartContext'; //importe el hook

interface Props{
productos:ProducInterface[];
selectedCategory: number | null;
}

export const Productos = ({productos,selectedCategory }:Props) => { 

  const { addToCart } = useCart(); //Obtiene la funcion del contexto
 
  // filtrar productos según la categoría seleccionada
  const filteredProducts = selectedCategory
    ? productos.filter((prod) => prod.categoria_id === selectedCategory)
    : productos; // si no hay seleccion, muestra todos

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
              <div className="relative">
                <img
                  src={`http://161.35.104.211:8000${prod.pictures}`}
                  alt={prod.title}
                  className="aspect-square w-full mix-blend-multiply brightness-110 object-cover"
                />
              </div>
              <div className="flex-1 p-3 bg-white flex flex-col justify-between">
                <h2 className="text-xl font-bold mb-1">
                  <a
                    // href={`ficha.html?producto=${prod.id}`}
                    // className="hover:text-red-600"
                  >
                    {prod.title}
                  </a>
                </h2>
                <p className="text-gray-500 mb-2">{prod.description}</p>
                {prod.price && (
                  <div className="text-2xl font-semibold text-green-600">
                    ${prod.price}
                  </div>
                )}
                <button
                  onClick={() => addToCart(prod)}
                  className="mt-3 bg-gray-200 text-black px-3 py-2 rounded border border-stone-300 hover:bg-red-700 hover:text-white hover:border-transparent transition duration-300"
                >
                  Agregar al carrito
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">
          No hay productos para esta categoría.
        </p>
      )}
    </div>
  );
};