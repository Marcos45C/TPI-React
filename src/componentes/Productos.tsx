import { useNavigate } from "react-router-dom";
import type { ProducInterface } from "../api/interfaces/general-Interfaces";
import imgDefecto from "../imagenes/logoCenter.png";

interface Props {
  productos: ProducInterface[];
  selectedCategory: number | null;
  compraProduc: (producto: ProducInterface) => void; // pra devolver todo el producto entero
}

export const Productos = ({
  productos,
  selectedCategory,
  compraProduc,
}: Props) => {
  // filtrar productos según la categoría seleccionada
  const filteredProducts = selectedCategory
    ? productos.filter((prod) => prod.category_id === selectedCategory)
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
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((prod) => { 
            {/**La lógica del descuento*/}
            const tieneTagDescuento = prod.tags?.some(
              (t) => t.title.toLowerCase().includes("descuento")
            );
            {/*aca hace las cuentas, pero es todo visual, carrito.tsx se encarga en si*/}
            const precioOriginal = prod.price || 0;
            const porcentaje = 15; 
            const precioConDescuento = tieneTagDescuento
              ? precioOriginal - (precioOriginal * (porcentaje / 100))
              : precioOriginal;
            return (
              <li
                key={prod.id}
                className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-lg hover:scale-[1.02] flex flex-col h-full border border-gray-100 group">
                <div
                  className="relative cursor-pointer h-32 sm:h-52 w-full bg-white flex items-center justify-center p-2"
                  onClick={() => irADetalle(prod.id)}
                >
                  {/**si tiene descuento muestra un tags encima diciendo Oferta! */}
                  {tieneTagDescuento && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-sm z-10">
                      ¡OFERTA! 
                    </div>
                  )}

                  <img
                    src={
                      prod.pictures && prod.pictures.length > 0
                        ? `http://161.35.104.211:8000${prod.pictures[0]}`
                        : imgDefecto
                    }
                    alt={prod.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                  {/**Aca se muestra el titulo, los tags y la descripción, que además si el tags es 'descuento' tiene su propio color (rojo) */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  
                  <div> 
                    <h2 className="text-sm sm:text-lg font-bold text-gray-800 leading-tight mb-1 line-clamp-2">
                      {prod.title}
                    </h2>

                    {prod.tags && prod.tags.length > 0 && (
                      <div 
                      className="hidden sm:flex flex-wrap gap-1 mt-1 mb-2">
                        {prod.tags.map((tag: any, index: number) => (
                          <span
                            key={index}
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              tag.title.toLowerCase().includes("descuento")
                                ? "text-red-600 bg-red-50 border-red-100" 
                                : "text-blue-600 bg-blue-50 border-blue-100"
                            }`}
                          >
                            #{tag.title}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div>
                    {/**Aca se decide que precio se muestra, en base a si tiene el tag 'descuento' o no*/}
                    <div className="mb-2 h-8 flex items-end">
                      {tieneTagDescuento ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400 line-through decoration-red-500">
                            ${precioOriginal}
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-red-600">
                            ${precioConDescuento.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-lg sm:text-xl font-bold text-green-600">
                          ${precioOriginal}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => compraProduc(prod)}
                      className="w-full bg-gray-100 text-gray-800 text-xs sm:text-sm font-bold px-3 py-2 rounded-lg border border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-200 active:scale-95"
                    >
                      Agregar al carrito
                    </button>
                  </div>

                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            className="w-24 h-24 text-gray-300 mb-4"
          >
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="9" cy="10" r="1.3" fill="currentColor" />
            <circle cx="15" cy="10" r="1.3" fill="currentColor" />
            <path d="M8 16c1-.9 2.3-1.4 4-1.4s3 .5 4 1.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p className="text-gray-500 text-lg font-medium text-center">
            ¡Ups! No encontré productos para esta categoría.
          </p>
        </div>
      )}
    </div>
  );

};