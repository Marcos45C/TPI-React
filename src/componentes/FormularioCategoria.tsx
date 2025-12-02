import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { CategoryInterfaz } from "../api/interfaces/general-Interfaces";
import { apiCategory } from "../api/url/refugioHuellitas";

export const FormularioCategoria = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const categoriaState = (location.state as any)?.categoria as CategoryInterfaz | undefined;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryInterfaz>({
    defaultValues: { title: "", description: "" }
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const esEdicion = Boolean(categoriaState);

 
  useEffect(() => {
    if (esEdicion && categoriaState) {
      reset(categoriaState);
    }
  }, [esEdicion, categoriaState, reset]);


  useEffect(() => {
  
    if (!categoriaState && location.pathname === "/categoria/editar") {
      navigate("/CRUD", { replace: true });
    }
  }, [categoriaState, navigate, location.pathname]);

  const onSubmit = async (formData: CategoryInterfaz) => {
    setError(null);
    setCargando(true);
    try {
      const method = esEdicion ? "PUT" : "POST";
      const url = esEdicion ? `${apiCategory}${categoriaState!.id}/` : apiCategory;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer div",
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
      setError("Hubo un error al guardar la categoría");
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
          {esEdicion ? "Editar Categoría" : "Nueva Categoría"}
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
              placeholder="Ingrese nombre de categoría"
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
