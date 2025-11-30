import { useEffect, useState } from "react";
import type {
  CategoryInterfaz,
  ProducInterface,
  TagsInterface,
} from "../api/interfaces/general-Interfaces";
import { getCategoris } from "../servicios/get-api-categoria";
import { getProductis } from "../servicios/get-api-productos";
import { apiCategory, apiProduct, apiTags } from "../api/url/refugioHuellitas";
import { getTags } from "../servicios/get-api-tags";
import { useNavigate } from "react-router-dom";
import { ModalConfirmar } from "./ModalConfirmar";

export const CRUD = () => {
  const navigate = useNavigate();

  const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
  const [productoss, setProductoss] = useState<ProducInterface[]>([]);
  const [tags, setTags] = useState<TagsInterface[]>([]);

  //modales para eliminar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const [openCategoria, setOpenCategoria] = useState(Boolean);
  const [openProducto, setOpenProducto] = useState(Boolean);
  const [openTags, setOpenTags] = useState(Boolean);

  // const [recargar, setRecargar] = useState(Boolean); //tengo q hacer que cuando se cambie algo o se elimine este actualice

  useEffect(() => {
    getCategoris()
      .then(setCategoriass) //si da bien y es lo mismo de hacer asi .then((data) => setCategoriass(data))
      .catch((i) => console.error("error al cargar categorías:", i));
    getProductis()
      .then(setProductoss) //
      .catch((i) => console.error("error al cargar productos:", i));
    getTags()
      .then(setTags) //traigo los tags
      .catch((i) => console.error("error al cargar productos:", i));
  }, []);

  const CrearCategoria = () => {
    console.log("CrearCategoria");
    navigate("/categoria/nueva");
  };
  const EditarCategoria = (id: number | null) => {
    console.log("EditarCategoria", id);
    navigate(`/categoria/editar/${id}`);
  };

  const confirmarEliminacion = async () => {
    if (!idAEliminar) return;

    const respuesta = await fetch(`${apiCategory}${idAEliminar}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer div",
      },
    });

    if (respuesta.ok) {
      // 🔥 Actualiza la tabla automáticamente
      setCategoriass((prev) => prev.filter((c) => c.id !== idAEliminar));
    }

    setMostrarModal(false);
    setIdAEliminar(null);
  };

  ///////////////////////////////

  const CrearProducto = () => {
    console.log("CrearProducto");
  };
  const EditarProducto = (id: number | null) => {
    console.log("EditarProducto", id);
  };

  const EliminarProducto = async (id: number | null) => {
    console.log("EliminarProducto", id);
    try {
      const respuesta = await fetch(`${apiProduct}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer div",
        },
      });
      if (!respuesta.ok) {
        throw new Error("Error al eliminar la categoria");
      }
      console.log("Producto eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Fallo al eliminar:", error);
      return false;
    }
  };

  ////////////////////

  const CrearTags = () => {
    console.log("Crear Tags");
  };
  const EditarTags = (id: number | null) => {
    console.log("EditarProducto", id);
  };

  const EliminarTag = async (id: number | null) => {
    console.log("EliminarTag", id);
    try {
      const respuesta = await fetch(`${apiTags}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer div",
        },
      });
      if (!respuesta.ok) {
        throw new Error("Error al eliminar la categoria");
      }
      console.log("Producto eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Fallo al eliminar:", error);
      return false;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        CRUD
      </h1>
      {/* categotiass */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">Categorías</h2>
            <button
              onClick={() => setOpenCategoria(!openCategoria)}
              className={`inline-block text-left px-4 py-2 font-semibold text-gray-700 transition-all duration-300
              ${openCategoria ? "opacity-40" : "opacity-100"}`}
            >
              Información adicional
            </button>
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
            onClick={CrearCategoria}
          >
            nueva Categoría
          </button>
        </div>
        {openCategoria && ( // si toca la categoria se despliega todo esto
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
                      {/* <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                        onClick={() => EditarCategoria(cat.id)}
                      >
                        EditaRR
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        onClick={() => EliminarCategoria(cat.id)}
                      >
                        Eliminar
                      </button> */}
                      <div className="inline-flex">
                        <button
                          className="-ml-px border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
                          onClick={() => EditarCategoria(cat.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            ></path>
                          </svg>
                        </button>

                        <button
                          className="-ml-px rounded-r-sm border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
                          onClick={() => {
                            setIdAEliminar(cat.id);
                            setMostrarModal(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* productoss */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">Productos</h2>

            <button
              onClick={() => setOpenProducto(!openProducto)}
              className={`inline-block text-left px-4 py-2 font-semibold text-gray-700 transition-all duration-300
              ${openProducto ? "opacity-40" : "opacity-100"}`}
            >
              Información adicional
            </button>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
            onClick={CrearProducto}
          >
            nuevo Producto
          </button>
        </div>
        {openProducto && (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 border-b text-left">ID</th>
                  <th className="py-3 px-4 border-b text-left">TITULO</th>
                  <th className="py-3 px-4 border-b text-left">
                    CATEGORIA QUE PERTENECEN
                  </th>
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
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                        onClick={() => EditarProducto(prod.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        onClick={() => EliminarProducto(prod.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* TAGS */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">Tags</h2>
            <button
              onClick={() => setOpenTags(!openTags)}
              className={`inline-block text-left px-4 py-2 font-semibold text-gray-700 transition-all duration-300
              ${openTags ? "opacity-40" : "opacity-100"}`}
            >
              Información adicional
            </button>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
            onClick={CrearTags}
          >
            Nuevo Tag
          </button>
        </div>
        {openTags && ( // si toca la tags se despliega todo esto
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 border-b text-left">ID</th>
                  <th className="py-3 px-4 border-b text-left">TÍTULO</th>
                  <th className="py-3 px-4 border-b text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <tr
                      key={tag.id}
                      className="hover:bg-gray-50 transition text-gray-800"
                    >
                      <td className="py-3 px-4 border-b">{tag.id}</td>
                      <td className="py-3 px-4 border-b font-semibold">
                        {tag.title}
                      </td>
                      <td className="py-3 px-4 border-b text-center space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                          onClick={() => EditarTags(tag.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                          onClick={() => EliminarTag(tag.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 text-center text-gray-500 italic border-b"
                    >
                      No hay tags disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <ModalConfirmar
        open={mostrarModal}
        texto="¿Seguro que deseas eliminar esta categoría?"
        onCancel={() => setMostrarModal(false)}
        onConfirm={confirmarEliminacion}
      />
    </div>
  );
};
