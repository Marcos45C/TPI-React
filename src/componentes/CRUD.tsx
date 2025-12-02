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

    // --- Estados de Datos y Apertura ---
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [productoss, setProductoss] = useState<ProducInterface[]>([]);
    const [tags, setTags] = useState<TagsInterface[]>([]);

    const [openCategoria, setOpenCategoria] = useState<boolean>(false); // Mostrar por defecto
    const [openProducto, setOpenProducto] = useState<boolean>(true);
    const [openTags, setOpenTags] = useState<boolean>(false);

    // --- Estados de Carga y Error ---
    const [loading, setLoading] = useState({
        categorias: true,
        productos: true,
        tags: true,
    });
    const [error, setError] = useState({
        categorias: false,
        productos: false,
        tags: false,
    });

    useEffect(() => {
        const cargarDatos = async () => {
            // 1. Cargar Categorías
            try {
                const data = await getCategoris();
                setCategoriass(data);
            } catch (i) {
                console.error("Error al cargar categorías:", i);
                setError(prev => ({ ...prev, categorias: true }));
            } finally {
                setLoading(prev => ({ ...prev, categorias: false }));
            }

            // 2. Cargar Productos
            try {
                const data = await getProductis();
                setProductoss(data);
            } catch (i) {
                console.error("Error al cargar productos:", i);
                setError(prev => ({ ...prev, productos: true }));
            } finally {
                setLoading(prev => ({ ...prev, productos: false }));
            }

            // 3. Cargar Tags
            try {
                const data = await getTags();
                setTags(data);
            } catch (i) {
                console.error("Error al cargar tags:", i);
                setError(prev => ({ ...prev, tags: true }));
            } finally {
                setLoading(prev => ({ ...prev, tags: false }));
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

    // funcion que confirma y borra
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
        navigate("/categoria/nueva");
    };
    const CrearProducto = () => {
        navigate("/productos/nuevo");
    };

    const CrearTags = () => {
        navigate("/tags/nuevo");
    };

    // --- Función Auxiliar para Renderizar Contenido ---
    const renderTablaContenido = (
        tipo: 'categorias' | 'productos' | 'tags',
        datos: any[],
        children: React.ReactNode // Contenido de la tabla (<tbody>)
    ) => {
        if (error[tipo]) {
            return (
                <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                    ⚠️ **Error al cargar {tipo}**. Inténtalo de nuevo más tarde.
                </div>
            );
        }

        if (loading[tipo]) {
            return (
                <div className="p-4 text-gray-500 bg-gray-100 rounded-lg">
                    Cargando {tipo}...
                </div>
            );
        }

        if (datos.length === 0) {
            return (
                <div className="p-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-lg">
                    ℹ️ No hay {tipo} disponibles.
                </div>
            );
        }

        // Si no hay error, no esta cargando y hay datos, renderiza la tabla
        return (
            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    {children}
                </table>
            </div>
        );
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                Panel de Administración CRUD
            </h1>

            <div className="flex justify-center mb-6 space-x-4">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
                    onClick={CrearCategoria}
                >
                    ➕ Nueva Categoría
                </button>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
                    onClick={CrearProducto}
                >
                    ➕ Nuevo Producto
                </button>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
                    onClick={CrearTags}
                >
                    ➕ Nuevo Tag
                </button>
            </div>

            <hr className="mb-8" />

            {/* SECCIÓN CATEGORÍAS */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-semibold text-gray-700">📚 Categorías</h2>
                        <button
                            onClick={() => setOpenCategoria(!openCategoria)}
                            className={`cursor-pointer inline-block text-left px-4 py-2 font-semibold text-gray-700 transition-all duration-300
                            ${openCategoria ? "opacity-40" : "opacity-100"} hover:opacity-100`}
                        >
                            {openCategoria ? "Ocultar" : "Mostrar"} Información
                        </button>
                    </div>
                </div>
                {openCategoria && renderTablaContenido('categorias', categoriass, (
                    <>
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4 border-b text-left">ID</th>
                                <th className="py-3 px-4 border-b text-left">TITULO</th>
                                <th className="py-3 px-4 border-b text-left">DESCRIPCION</th>
                                {/* Se fija el ancho para que coincida con la tabla de Productos */}
                                <th className="py-3 px-4 border-b text-center min-w-[12rem]">ACCIONES</th>
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
                                        <div className="inline-flex gap-2 justify-end w-full"> 
                                            <button
                                                className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition"
                                                onClick={() =>
                                                    navigate("/categoria/editar", { state: { categoria: cat } })
                                                }
                                            > ✏️ Editar</button>
                                            <button
                                                className="bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition"
                                                onClick={() => abrirModalEliminar(cat.id, "categoria")}
                                            > 🗑️ Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                ))}
            </section>

            <hr className="mb-8" />

            {/* SECCIÓN PRODUCTOS */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-semibold text-gray-700">📦 Productos</h2>
                        <button
                            onClick={() => setOpenProducto(!openProducto)}
                            className={`cursor-pointer inline-block text-left px-4 py-2 font-semibold text-gray-700 transition-all duration-300
                            ${openProducto ? "opacity-40" : "opacity-100"} hover:opacity-100`}
                        >
                            {openProducto ? "Ocultar" : "Mostrar"} Información
                        </button>
                    </div>
                </div>
                {openProducto && renderTablaContenido('productos', productoss, (
                    <>
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4 border-b text-left">ID</th>
                                <th className="py-3 px-4 border-b text-left">TITULO</th>
                                <th className="py-3 px-4 border-b text-left">
                                    CATEGORIA
                                </th>
                                <th className="py-3 px-4 border-b text-left">Precio</th>
                            
                                <th className="py-3 px-4 border-b text-center min-w-[12rem]">ACCIONES</th>
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
                                        {prod.category_id || "sin categoría"}
                                    </td>
                                    <td className="py-3 px-4 border-b text-green-600 font-medium">
                                        ${prod.price ?? "N/A"}
                                    </td>
                                    <td className="py-3 px-4 border-b text-center space-x-2">
                                        {/* Este div no necesita justify-end porque los 3 botones ya empujan a los otros a la derecha */}
                                        <div className="inline-flex gap-2">
                                            <button
                                                className="bg-yellow-500 text-white rounded-lg px-3 py-2 hover:bg-yellow-600 transition"
                                                onClick={() =>
                                                    navigate("/productos/añadirTags", { state: { productos: prod } })
                                                }
                                            >🏷️ Tags</button>

                                            <button
                                                className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition"
                                                onClick={() =>
                                                    navigate("/productos/editar", { state: { productos: prod } })
                                                }
                                            > ✏️ Editar</button>

                                            <button
                                                className="bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition"
                                                onClick={() => abrirModalEliminar(prod.id, "producto")}
                                            > 🗑️ Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                ))}
            </section>

            <hr className="mb-8" />

            {/* SECCIÓN TAGS */}
            <section className="mt-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-semibold text-gray-700">🏷️ Tags</h2>
                        <button
                            onClick={() => setOpenTags(!openTags)}
                            className={`cursor-pointer inline-block text-left px-4 py-2 font-semibold text-gray-700 transition-all duration-300
                            ${openTags ? "opacity-40" : "opacity-100"} hover:opacity-100`}
                        >
                            {openTags ? "Ocultar" : "Mostrar"} Información
                        </button>
                    </div>
                </div>
                {openTags && renderTablaContenido('tags', tags, (
                    <>
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4 border-b text-left">ID</th>
                                <th className="py-3 px-4 border-b text-left">TÍTULO</th>
                              
                                <th className="py-3 px-4 border-b text-center min-w-[12rem]">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tags.map((tag) => (
                                <tr
                                    key={tag.id}
                                    className="hover:bg-gray-50 transition text-gray-800"
                                >
                                    <td className="py-3 px-4 border-b">{tag.id}</td>
                                    <td className="py-3 px-4 border-b font-semibold">
                                        {tag.title}
                                    </td>
                                    
                                    <td className="py-3 px-4 border-b text-center space-x-2">
                                        <div className="inline-flex gap-2 justify-end w-full">
                                            <button
                                                className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 transition"
                                                onClick={() =>
                                                    navigate("/tags/editar", { state: { tag: tag } })
                                                }
                                            > ✏️ Editar</button>
                                            <button
                                                className="bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition"
                                                onClick={() => abrirModalEliminar(tag.id, "tag")}
                                            > 🗑️ Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                ))}
            </section>

            <ModalConfirmar
                open={modalConfig.abierto}
                texto={modalConfig.texto}
                onCancel={cancelarEliminacion}
                onConfirm={confirmarEliminacion}
            />
        </div>
    );
};