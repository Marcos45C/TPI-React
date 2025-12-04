import { useEffect, useState } from "react";
import type {
  CategoryInterfaz,
  ProducInterface,
  TagsInterface,
} from "../api/interfaces/general-Interfaces";
import { getCategoris } from "../servicios/get-api-categoria";
import { getProductis } from "../servicios/get-api-productos";
import { apiCategory, apiProduct, apiTags } from "../api/url/UrlGenerales";
import { getTags } from "../servicios/get-api-tags";
import { useNavigate } from "react-router-dom";
import { ModalConfirmar } from "./ModalConfirmar";
import { eliminarItem } from "../servicios/eliminarItem";

export const CRUD = () => {
  const navigate = useNavigate();

  const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
  const [productoss, setProductoss] = useState<ProducInterface[]>([]);
  const [tags, setTags] = useState<TagsInterface[]>([]);

  const [openCategoria, setOpenCategoria] = useState<boolean>(true);
  const [openProducto, setOpenProducto] = useState<boolean>(true);
  const [openTags, setOpenTags] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      // cargo categorias
      try {
        const data = await getCategoris();
        setCategoriass(data);
      } catch (i) {
        console.error("Error al cargar categorias:", i);
      }

      // los productos
      try {
        const data = await getProductis();
        setProductoss(data);
      } catch (i) {
        console.error("Error al cargar productos:", i);
      }
      // los tags
      try {
        const data = await getTags();
        setTags(data);
      } catch (i) {
        console.error("Error al cargar tags:", i);
      }
    };

    cargarDatos();
  }, []);

  // estado unico para el modal y la eliminacion
  const [modalConfig, setModalConfig] = useState<{
    abierto: boolean;
    id: number | null;
    tipo: "categoria" | "producto" | "tag" | null;
    texto: string;
  }>({
    abierto: false,
    id: null,
    tipo: null,
    texto: "",
  });

  // funcion para abrir modal desde cualquier botón
  const abrirModalEliminar = (
    id: number | null,
    tipo: "categoria" | "producto" | "tag",
    texto?: string
  ) => {
    setModalConfig({
      abierto: true,
      id,
      tipo,
      texto:
        texto ??
        (tipo === "categoria"
          ? "¿Seguro que deseas eliminar esta categoría?"
          : tipo === "producto"
          ? "¿Seguro que deseas eliminar este producto?"
          : "¿Seguro que deseas eliminar este tag?"),
    });
  };

  // funcion q usan los 3 que confirma y borra , se usa con el elimimarItem para q pueda abrir los 3 el mismo modal
  const confirmarEliminacion = async () => {
    const id = modalConfig.id;
    const tipo = modalConfig.tipo;
    if (!id || !tipo) return;

    let urlBase = apiCategory;
    let actualizar: (() => void) | null = null;

    if (tipo === "categoria") {
      urlBase = apiCategory;
      actualizar = () =>
        setCategoriass((prev) => prev.filter((c) => c.id !== id));
    } else if (tipo === "producto") {
      urlBase = apiProduct;
      actualizar = () =>
        setProductoss((prev) => prev.filter((p) => p.id !== id));
    } else if (tipo === "tag") {
      urlBase = apiTags;
      actualizar = () => setTags((prev) => prev.filter((t) => t.id !== id));
    }

    try {
      const ok = await eliminarItem({ urlBase, id });
      if (ok && actualizar) actualizar();
      else if (!ok) console.error("No se pudo eliminar en el servidor");
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      // cerrar modal y resetear config
      setModalConfig({ abierto: false, id: null, tipo: null, texto: "" });
    }
  };

  // cancelar
  const cancelarEliminacion = () =>
    setModalConfig({ abierto: false, id: null, tipo: null, texto: "" });

  const CrearCategoria = () => {
    console.log("CrearCategoria");
    navigate("/categoria/nueva");
  };
  const CrearProducto = () => {
    console.log("Crear Producto");
    navigate("/productos/nuevo");
  };

  const CrearTags = () => {
    console.log("Crear Tags");
    navigate("/tags/nuevo");
  };

  return (<div className="p-6 bg-[#708090] min-h-screen max-w-full overflow-x-hidden">
      <div className="mb-4 flex justify-start">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Volver al Super
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-black text-center">
        Seccion de Administrador
      </h1>
      {/* cambie estilo aca para que se adapte a los telefonos y no sea imposible agregar nueva categoria , producto o tag */}
      <div className="flex flex-col sm:flex-row justify-center mb-6 gap-4">
        <button
          className="bg-[#008B8B] hover:bg-[#00A0A0] text-white px-4 py-2 rounded shadow transition"
          onClick={CrearCategoria}
        >
          Nueva Categoría
        </button>
        <button
          className="bg-[#008B8B] hover:bg-[#00A0A0] text-white px-4 py-2 rounded shadow transition"
          onClick={CrearProducto}
        >
          Nuevo Producto
        </button>
        <button
          className="bg-[#008B8B] hover:bg-[#00A0A0] text-white px-4 py-2 rounded shadow transition"
          onClick={CrearTags}
        >
          Nuevo Tag
        </button>
      </div>

      {/* categotiass */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-black">Categorias</h2>
            <button
              onClick={() => setOpenCategoria(!openCategoria)}
              className={`cursor-pointer inline-block text-left px-4 py-2 font-semibold text-gray-900 transition-all duration-300
                            ${
                              openCategoria ? "opacity-40" : "opacity-100"
                            } hover:opacity-100`}
            >
              {openCategoria ? "Ocultar" : "Mostrar"} Información
            </button>
          </div>
        </div>
        {openCategoria && ( // si toca la categoria se despliega todo esto
          <div className="overflow-x-auto shadow rounded-lg w-full border border-black">
            <table className="min-w-full bg-white text-center">
              <thead className="bg-[#808080] text-gray-700 uppercase text-sm">
                <tr>
                  <th className="bg-[#808080] py-3 px-4 border-b text-center w-1/4 ">
                    TITULO
                  </th>
                  <th className="py-3 px-4 border-b text-center w-2/4">
                    DESCRIPCION
                  </th>
                  <th className="py-3 px-4 border-b text-center w-1/4">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoriass.length > 0 ? (
                  categoriass.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-[#66BBBB] transition text-gray-800"
                    >
                      <td className="bg-[#DCDCDC] py-3 px-4 border-b font-semibold w-1/4 truncate">
                        {cat.title}
                      </td>
                      <td className="bg-[#DCDCDC] py-3 px-4 border-b w-2/4 break-words  whitespace-normal">
                        {cat.description}
                      </td>
                      <td className="bg-[#DCDCDC] py-3 px-4 border-b text-center w-1/4">
                        <div className="inline-flex gap-2">
                          <button
                            className="cursor-pointer bg-blue-500 border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-blue-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 rounded-lg"
                            onClick={() =>
                              navigate("/categoria/editar", {
                                state: { categoria: cat },
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 sm:size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                              />
                            </svg>
                          </button>
                          <button
                            className="cursor-pointer bg-red-500 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-red-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
                            onClick={() =>
                              abrirModalEliminar(cat.id, "categoria")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 sm:size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 text-center text-gray-500 italic border-b"
                    >
                      No hay categorias disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* productoss */}
      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-black">Productos</h2>
            <button
              onClick={() => setOpenProducto(!openProducto)}
              className={`cursor-pointer inline-block text-left px-4 py-2 font-semibold text-gray-900 transition-all duration-300
                            ${
                              openProducto ? "opacity-40" : "opacity-100"
                            } hover:opacity-100`}
            >
              {openProducto ? "Ocultar" : "Mostrar"} Información
            </button>
          </div>
        </div>
        {openProducto && (
          <div className="overflow-x-auto shadow rounded-lg w-full border border-black">
  <table className="min-w-full bg-white text-center">
    <thead className="bg-[#808080] text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 border-b w-1/4">Título</th>
                  <th className="py-3 px-4 border-b w-1/4">Categoría</th>
                  <th className="py-3 px-4 border-b w-1/4">Precio</th>
                  <th className="py-3 px-4 border-b w-1/4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productoss.length > 0 ? (
                  productoss.map((prod) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-gray-50 transition text-gray-800 "
                    >
                      <td className="bg-[#DCDCDC] py-3 px-2 border-b font-semibold">
                        {prod.title}
                      </td>

                      <td className="bg-[#DCDCDC] py-3 px-2 border-b">
                        {categoriass.find((c) => c.id === prod.category_id)
                          ?.title || "Sin categoría"}
                      </td>

                      <td className="bg-[#DCDCDC] py-3 px-2 border-b text-green-600 font-medium">
                        ${prod.price ?? "N/A"}
                      </td>
                      <td className="bg-[#DCDCDC] py-3 px-2 border-b ">
                        <div className="flex justify-center gap-2">
                          <button
                            className="cursor-pointer bg-green-500 border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-green-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 rounded-lg"
                            onClick={() =>
                              navigate("/productos/añadirTags", {
                                state: { productos: prod },
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                            >
                              <path d="M20.59 13.41l-8-8A2 2 0 0010.17 5H5a2 2 0 00-2 2v5.17a2 2 0 00.59 1.41l8 8a2 2 0 002.83 0l5.17-5.17a2 2 0 000-2.83z" />
                              <circle cx="7.5" cy="7.5" r="1.5" />
                            </svg>
                          </button>

                          <button
                            className="cursor-pointer bg-blue-500 border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-blue-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 rounded-lg"
                            onClick={() =>
                              navigate("/productos/editar", {
                                state: { productos: prod },
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 sm:size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                              />
                            </svg>
                          </button>

                          <button
                            className="cursor-pointer bg-red-500 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-red-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
                            onClick={() =>
                              abrirModalEliminar(prod.id, "producto")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 sm:size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 text-center text-gray-500 italic border-b"
                    >
                      No hay productos disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* TAGS */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-black">Tags</h2>
            <button
              onClick={() => setOpenTags(!openTags)}
              className={`cursor-pointer inline-block text-left px-4 py-2 font-semibold text-gray-900 transition-all duration-300
                            ${
                              openTags ? "opacity-40" : "opacity-100"
                            } hover:opacity-100`}
            >
              {openTags ? "Ocultar" : "Mostrar"} Informacion
            </button>
          </div>
        </div>
        {openTags && ( // si toca la tags se despliega todo esto
          <div className="overflow-x-auto shadow rounded-lg w-full border border-black">
  <table className="min-w-full bg-white text-center">
    <thead className="bg-[#808080] text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 border-b text-center">TÍTULO</th>
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
                      <td className="bg-[#DCDCDC] py-3 px-4 border-b text-center font-semibold">
                        {tag.title}
                      </td>
                      <td className="bg-[#DCDCDC] py-3 px-4 border-b text-center space-x-2">
                        <div className="inline-flex gap-2">
                          <button
                            className="cursor-pointer bg-blue-500 border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-blue-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 rounded-lg"
                            onClick={() =>
                              navigate("/tags/editar", {
                                state: { tag: tag },
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 sm:size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                              />
                            </svg>
                          </button>

                          <button
                            className="cursor-pointer bg-red-500 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 transition-colors hover:bg-red-600 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
                            onClick={() => abrirModalEliminar(tag.id, "tag")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 sm:size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
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
        open={modalConfig.abierto}
        texto={modalConfig.texto}
        onCancel={cancelarEliminacion}
        onConfirm={confirmarEliminacion}
      />
    </div>
  );
}