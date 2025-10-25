

import type { ProducInterface } from "../api/interfaces/general-Interfaces";

interface Props{
productos:ProducInterface[];
selectedCategory: number | null;
}

export const Productos = ({productos,selectedCategory }:Props) => { 

 
  // filtrar productos según la categoría seleccionada
  const filteredProducts = selectedCategory
    ? productos.filter((prod) => prod.categoria_id === selectedCategory)
    : productos; // si no hay selección, muestra todos

  return (<div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Productos</h2>
      {filteredProducts.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <li
              key={prod.id}
              className="bg-gray-100 rounded-lg shadow hover:scale-105 transition-transform cursor-pointer p-4"
            >
              <img
                src={`http://161.35.104.211:8000${prod.pictures}`}
                alt={prod.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold text-red-700">
                {prod.title}
              </h3>
              <p className="text-gray-600">{prod.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No hay productos para esta categoría.</p>
      )}
    </div>
  );
};
