import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { apiProduct } from "./api/url/refugioHuellitas";
import type { ProducInterface } from "./api/interfaces/general-Interfaces";
import imgDefecto from "./imagenes/logoCenter.png";


const mapApiProduct = (variable: any): ProducInterface => ({
  title: variable.title,
  description: variable.description,
  price: variable.price,
  categoria_id: variable.category_id,
  id: variable.id,
  pictures: variable.pictures,
  tags: variable.tags || [], // Añadido por si acaso
});

export const DetalleProducto = () => {
  const { id } = useParams<{id: string }>(); 

  //Estados del producto
  const [producto, setProducto] = useState<ProducInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //useEffect se ejecuta cuando se monta el componente
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No se proporcionó un ID de producto.");
      return;
    }
  
  const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        //Hacemos el fetch directamente
        const respuesta = await fetch(`${apiProduct}${id}`, {
            method: 'GET',
            headers: {
              "Accept": "application/json",
              "Authorization": "Bearer div",
            },
          });

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status} al buscar producto ${id}`);
        }

        const data = await respuesta.json();

        setProducto(mapApiProduct(data));

      }catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
  };

  fetchProducto();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!producto) {
    return <div className="p-4 text-center">Producto no encontrado.</div>;
  }

  //muestra el producto
  const imageUrl = (producto.pictures && producto.pictures.length > 0)
    ? `http://161.35.104.211:8000${producto.pictures[0]}`
    : imgDefecto;

  return (
    <div className="mt-3 p-4 max-w-3xl mx-auto border-1 border-gray-300 shadow-xl">
      <h1 className="text-3xl font-bold mb-4">{producto.title}</h1>
      <img 
        src={imageUrl}
        alt={producto.title}
        className="w-full h-96 shadow-sm object-cover rounded-md mb-6 border-4 border-red-900"/>

        <p className="text-gray-700 text-lg mb-4">{producto.description}</p>

        <div className="text-4xl font-semibold text-green-600">
          ${producto.price}
        </div>
    </div>
  );
};
