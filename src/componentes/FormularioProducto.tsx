import { useEffect, useState } from "react";
import type {
    CategoryInterfaz,
    ProducInterface,
} from "../api/interfaces/general-Interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiProduct, claveToken } from "../api/url/UrlGenerales";
import { getCategoris } from "../servicios/get-api-categoria";

import logoCarga from "../imagenes/logoCarga.png";


const LoadingSpinner = ({ mensaje, esEdicion = false }: { mensaje: string, esEdicion?: boolean }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
            {mensaje}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
            <p className="text-gray-500 text-sm">
                {esEdicion ? "Actualizando producto..." : "Preparando formulario..."}
            </p>
            <img
                src={logoCarga}
                alt="Cargando"
                className="w-4 h-4 object-contain animate-bounce"
            />
        </div>
    </div>
);


const ErrorMessage = ({ errorText }: { errorText: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="text-4xl text-red-600 mb-4">🚨</div>
        <p className="text-xl font-bold text-red-700 mb-2">
            ¡Operación Fallida!
        </p>
        <p className="text-md text-red-600 text-center">{errorText}</p>
        <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
        >
            Reintentar
        </button>
    </div>
);


export const FormularioProducto = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const productoState = (location.state as any)?.productos as
        | ProducInterface
        | undefined;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ProducInterface>({
        defaultValues: { title: "", description: "", price: 0, category_id: null },
    });

    
    const [cargando, setCargando] = useState(false); 

    const [loadingInitial, setLoadingInitial] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<CategoryInterfaz[]>([]);
    const [preview, setPreview] = useState<any[]>([]);

    const esEdicion = Boolean(productoState);

    useEffect(() => {
        if (!productoState && location.pathname === "/productos/editar") {
            navigate("/CRUD", { replace: true });
        }
    }, [productoState, navigate, location.pathname]);


    useEffect(() => {
        getCategoris()
            .then((cats) => {
                setCategorias(cats);

                if (esEdicion && productoState) {
                    reset(productoState); // ahora sí
                    setPreview(productoState.pictures ?? []);
                }
            })
            .catch((i) => {
                console.error("error al cargar categorías:", i);
                setError("Error al cargar categorías o datos de edición.");
            })
            .finally(() => {
                setLoadingInitial(false); 
            });
    }, [esEdicion, productoState, reset]); 

    const onSubmit = async (formData: ProducInterface) => {
        setError(null);
        setCargando(true); 

        try {
            const method = esEdicion ? "PUT" : "POST";
            const url = esEdicion ? `${apiProduct}${productoState!.id}/` : apiProduct;

            // guardo el producto
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${claveToken}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: formData.price,
                    category_id: formData.category_id,
                }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Error al guardar (status ${res.status}) ${text}`);
            }

            const savedProduct = await res.json(); 
            const productId = esEdicion ? productoState!.id : savedProduct.id;

            // subo la imagen
            if (formData.pictures && formData.pictures.length > 0) {
                const formDataImg = new FormData();

                
                for (let img of formData.pictures as unknown as File[]) {
                   
                    formDataImg.append("files", img); 
                }

                const uploadURL = `${apiProduct}${productId}/pictures`;

                const upload = await fetch(uploadURL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${claveToken}`,
                        
                    },
                    body: formDataImg,
                });

                if (!upload.ok) {
                    throw new Error("Error al subir imágenes");
                }
            }

            navigate("/CRUD");
        } catch (err) {
            console.error(err);
            setError("Hubo un error al guardar el producto. Inténtalo de nuevo.");
        } finally {
            setCargando(false); // Desactiva el spinner de submit
        }
    };


    if (error) return <ErrorMessage errorText={error} />;

    if (loadingInitial) return <LoadingSpinner mensaje="Cargando categorías y formulario..." />;
 
    if (cargando) return <LoadingSpinner mensaje={esEdicion ? "Guardando cambios del producto..." : "Creando nuevo producto..."} esEdicion={esEdicion} />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#708090]">
            <div className="bg-[#DCDCDC] p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {esEdicion ? "Editar Producto" : "Nuevo Producto"}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* TITULO */}
                    <div>
                        <label className="block text-gray-700 font-medium">Título</label>
                        <input
                            {...register("title", {
                                required: "El título es obligatorio",
                                minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" },
                                maxLength: { value: 30, message: "Máximo 30 caracteres" },
                            })}
                            className={`w-full border rounded px-3 py-2 mt-1 ${errors.title ? "border-red-500" : ""}`}
                            placeholder="Ingrese nombre del producto"
                        />
                        {errors.title && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPCION */}
                    <div>
                        <label className="block text-gray-700 font-medium">
                            Descripción
                        </label>
                        <textarea
                            {...register("description", {
                                maxLength: { value: 200, message: "Máximo 200 caracteres" },
                            })}
                            className={`w-full border rounded px-3 py-2 mt-1 ${errors.description ? "border-red-500" : ""}`}
                            placeholder="Descripción breve"
                        />
                        {errors.description && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* PRECIO */}
                    <div>
                        <label className="block text-gray-700 font-medium">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", {
                                valueAsNumber: true,
                                required: "El precio es obligatorio",
                                min: { value: 1, message: "El precio debe ser mayor a 0" },
                            })}
                            className={`w-full border rounded px-3 py-2 mt-1 ${errors.price ? "border-red-500" : ""}`}
                            placeholder="Ingrese el precio"
                        />
                        {errors.price && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    {/* selector de Categoria */}
                    <div>
                        <label className="block text-gray-700 font-medium">Categoría</label>
                        <select
                            {...register("category_id", {
                                valueAsNumber: true,
                            })}
                            className={`w-full border rounded px-3 py-2 mt-1 ${errors.category_id ? "border-red-500" : ""}`}
                        >
                            <option value="">-- Elegir categoría --</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={Number(cat.id)}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.category_id.message}
                            </p>
                        )}
                    </div>

                    {/* subir imagenes */}
                    <div>
                        <label className="block text-gray-700 font-medium">Imágenes</label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const newFiles = e.target.files
                                    ? Array.from(e.target.files)
                                    : [];
                                setValue("pictures", newFiles as any);       
                                setPreview((prev) => [
                                    ...prev.filter(item => typeof item === 'string' && !item.startsWith('blob:') && item.startsWith('/uploads')), 
                                    ...newFiles.map((f) => URL.createObjectURL(f)), 
                                ]);
                            }}
                            className="w-full border px-3 py-2 rounded mt-1"
                        />

                        {/* Previsualización */}
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {preview.map((img, i) => {
                                const imgSrc = 
                                    typeof img === 'string' 
                                        ? (img.startsWith("/uploads") 
                                            ? `http://161.35.104.211:8000${img}` 
                                            : img) 
                                        : null; 
                                
                                return imgSrc ? (
                                    <img
                                        key={i}
                                        src={imgSrc}
                                        alt={`Previsualización ${i + 1}`}
                                        className="w-full h-24 object-cover rounded border"
                                    />
                                ) : null;
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between pt-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-400 hover:bg-[#708090] text-gray-800 px-4 py-2 rounded"
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            disabled={cargando}
                        >
                            {esEdicion ? "Guardar cambios" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};