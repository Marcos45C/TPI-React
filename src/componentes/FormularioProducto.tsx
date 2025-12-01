import { useEffect, useState } from "react";
import type {
  CategoryInterfaz,
  ProducInterface,
} from "../api/interfaces/general-Interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiProduct } from "../api/url/refugioHuellitas";
import { getCategoris } from "../servicios/get-api-categoria";

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
    defaultValues: { title: "", description: "", price: 0, category_id: 0 },
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CategoryInterfaz[]>([]);

  const esEdicion = Boolean(productoState);

  // Cargar valores base si es edición
  useEffect(() => {
    if (esEdicion && productoState) {
      reset(productoState);
    }
  }, [esEdicion, productoState, reset]);

  // Redirige si entras a editar sin producto
  useEffect(() => {
    if (!productoState && location.pathname === "/productos/editar") {
      navigate("/CRUD", { replace: true });
    }
  }, [productoState, navigate, location.pathname]);

  // Cargar categorías
  useEffect(() => {
    getCategoris()
      .then((cats) => {
        setCategorias(cats);

        // Una vez cargadas las categorías, seteamos la correcta si es edición
        if (esEdicion && productoState) {
          if (productoState.category_id) {
            setValue("category_id", productoState.category_id);
          }
        }
      })
      .catch((i) => console.error("error al cargar categorías:", i));
  }, []);

  // Envío del formulario
  const onSubmit = async (formData: ProducInterface) => {
    setError(null);
    setCargando(true);

    try {
      const method = esEdicion ? "PUT" : "POST";
      const url = esEdicion ? `${apiProduct}${productoState!.id}/` : apiProduct;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer div",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error al guardar (status ${res.status}) ${text}`);
      }

      navigate("/CRUD");
    } catch (err) {
      console.error(err);
      setError("Hubo un error al guardar el producto");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <p className="p-6 text-gray-600">Cargando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {esEdicion ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Título</label>
            <input
              {...register("title", {
                required: "El título es obligatorio",
                minLength: {
                  value: 3,
                  message: "El título debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "Máximo 30 caracteres",
                },
              })}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Ingrese nombre del producto"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Descripción
            </label>
            <textarea
              {...register("description", {
                maxLength: {
                  value: 200,
                  message: "Máximo 200 caracteres",
                },
              })}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Descripción breve"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Precio</label>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                valueAsNumber: true,
                required: "El precio es obligatorio",
                min: {
                  value: 1,
                  message: "El precio debe ser mayor a 0",
                },
              })}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                errors.price ? "border-red-500" : ""
              }`}
              placeholder="Ingrese el precio"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Selector de  Categoría */}
          <div>
            <label className="block text-gray-700 font-medium">Categoría</label>
            <select
              {...register("category_id", {
                required: "Selecciona una categoría",
                valueAsNumber: true,
              })}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                errors.category_id ? "border-red-500" : ""
              }`}
            >
              <option value={0}>-- Elegir categoría --</option>

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

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Volver
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {esEdicion ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
