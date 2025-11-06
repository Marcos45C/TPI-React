import { useEffect, useState } from "react";
import type {CategoryInterfaz,ProducInterface} from "./api/interfaces/general-Interfaces";
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";

export const CRUD = () => {
  const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
  const [productoss, setProductoss] = useState<ProducInterface[]>([]);

  useEffect(() => {
    getCategoris()
      .then(setCategoriass) //si da bien y es lo mismo de hacer asi .then((data) => setCategoriass(data))
      .catch((i) => console.error("error al cargar categorías:", i));
    getProductis()
      .then(setProductoss) //
      .catch((i) => console.error("error al cargar productos:", i));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        CRUD
      </h1>
    
      {/* categotiass */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Categorías</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
            nueva Categoría
          </button>
        </div>

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 border-b text-left">ID</th>
                <th className="py-3 px-4 border-b text-left">TITULO</th>
                <th className="py-3 px-4 border-b text-left">DESCRIPCION</th>
                <th className="py-3 px-4 border-b text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {categoriass.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50 transition text-gray-800"
                >
                  <td className="py-3 px-4 border-b">{cat.id}</td>
                  <td className="py-3 px-4 border-b font-semibold">
                    {cat.title}
                  </td>
                  <td className="py-3 px-4 border-b">{cat.description}</td>
                  <td className="py-3 px-4 border-b text-center space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                    Editar
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                    Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* productoss */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Productos</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
          nuevo Producto
          </button>
        </div>

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 border-b text-left">ID</th>
                <th className="py-3 px-4 border-b text-left">TITLE</th>
                <th className="py-3 px-4 border-b text-left">CATEGORIA QUE PERTENECEN</th>
                <th className="py-3 px-4 border-b text-left">Precio</th>
                <th className="py-3 px-4 border-b text-center">ACCIONE</th>
              </tr>
            </thead>
            <tbody>
              {productoss.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-gray-50 transition text-gray-800 "
                >
                  <td className="py-3 px-4 border-b">{prod.id}</td>
                  <td className="py-3 px-4 border-b font-semibold">
                    {prod.title}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {prod.categoria_id || "sin categoría"}
                  </td>
                  <td className="py-3 px-4 border-b text-green-600 font-medium">
                    ${prod.price ?? "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b text-center space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                    Editar
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                    Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
