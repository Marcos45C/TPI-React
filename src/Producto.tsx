import { useEffect, useState } from "react";
import { apiProduct } from "./api/url/refugioHuellitas";
import type { ProducInterface } from "./api/interfaces/general-Interfaces";


export const Producto = () => {
  const [productos, setProductos] = useState<ProducInterface[]>([]);

  const getProductos = async () => {
    try {
      const response = await fetch(`${apiProduct}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer refugioHuellitas`, // token o user
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      const data = await response.json();
      setProductos(data); // guardo el estado
      // console.log("GET data:", data);
      // console.log(id);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    getProductos();
  }, [])

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       console.log("5 segundes");
//     }, 5000);
//     //
//     return () => clearTimeout(timer);
//   }, []);

  return (
    <>
      <div>
        {productos.map((i) => (
          <div key={i.id}>
            <div className="max-w-96 shadow-lg bg-gray-100  h-full flex flex-col">
              <img
                src={`http://161.35.104.211:8000${i.pictures}`}
                alt={`{i.title}`}
                className="aspect-square w-full mix-blend-multiply brightness-110"
              />
              <div className="flex-1 p-3 bg-white flex flex-col justify-between">
                <h2 className="text-xl font-bold mb-1">{i.title}</h2>
                <p className="text-gray-600 mb-2">{i.description}</p>
                <div className="text-2xl font-semibold text-green-600">
                  $${i.price}
                </div>
                <p>{i.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
