import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CategoryInterfaz } from "../api/interfaces/general-Interfaces";
import { apiCategory } from "../api/url/refugioHuellitas";


export const FormularioCategoria = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<CategoryInterfaz>();

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (!esEdicion) return;

    const fetchCategoria = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch(`${apiCategory}${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer div", 
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        reset(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la categoría");
      } finally {
        setCargando(false);
      }
    };

    fetchCategoria();
  }, [esEdicion, id, reset]);

  //en caso de post o put
  const onSubmit = async (formData: CategoryInterfaz) => {
    setError(null);
    try {
      const method = esEdicion ? "PUT" : "POST";
      const url = esEdicion ? `${apiCategory}${id}/` : apiCategory;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer div", // 
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error al guardar (status ${res.status}) ${text}`);
      }

      // si todo sale bien vuelve para el crud
      navigate("/CRUD");
    } catch (err) {
      console.error(err);
      setError("hubo un error al guardar la categoría");
    }
  };

  if (cargando) return <p className="p-6 text-gray-600">Cargandoo!</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {esEdicion ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Titulo</label>
            <input
              {...register("title", { required: true })}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="ingrese categoria Nueva"
            />
          </div>


        {/* al ingresar nueva categoria */}
          <div>
            <label className="block text-gray-700 font-medium">Descripcion</label>
            <textarea
              {...register("description")}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Descripcion breve"
            />
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