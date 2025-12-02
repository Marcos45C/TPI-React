import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { TagsInterface } from "../api/interfaces/general-Interfaces"; 
import {  apiTags, claveToken } from "../api/url/UrlGenerales"; 

export const FormularioTag = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener el tag a editar del estado de la ruta. Si no existe, es null/undefined.
  const tagState = (location.state as any)?.tag as TagsInterface | undefined;

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<TagsInterface>({
    defaultValues: { 
      title: tagState?.title || "",
    }
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determinamos si estamos en modo edición (si se pasó un objeto tag)
  const esEdicion = Boolean(tagState);

  // 1. Efecto para cargar los datos del tag a editar en el formulario (reset)
  useEffect(() => {
    if (esEdicion && tagState) {
      reset(tagState);
    }
  }, [esEdicion, tagState, reset]);

  // 2. Efecto de seguridad (opcional, pero buena práctica):
  // Si alguien navega manualmente a la ruta de edición sin pasar un objeto, lo devolvemos.
  useEffect(() => {
    
    if (!tagState && location.pathname.includes("/tags/editar")) {
    
        navigate("/CRUD", { replace: true }); 
    }
  }, [tagState, navigate, location.pathname]);

  // 3. Manejo del envío del formulario (POST/PUT)
  const onSubmit = async (formData: TagsInterface) => {
    setError(null);
    setCargando(true);
    
    try {
      
      const method = esEdicion ? "PUT" : "POST";

      const url = esEdicion ? `${apiTags}${tagState!.id}` : apiTags; 

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${claveToken}`, // Usa tu claveToken
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
       
        const text = await res.text().catch(() => "Error desconocido");
        throw new Error(`Error al guardar (status ${res.status}): ${text}`);
      }

   
      navigate("/CRUD"); 

    } catch (err: any) {
      console.error("Error al procesar el formulario:", err);
      setError("Hubo un error al guardar el Tag: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <p className="p-6 text-gray-600">Guardando...</p>;
  
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {esEdicion ? "Editar Tag" : "Crear Nuevo Tag"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
          <div>
            <label className="block text-gray-700 font-medium">Título</label>
            <input
              {...register("title", {
                required: "El título es obligatorio",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
              })}
              className={`w-full border rounded px-3 py-2 mt-1 ${errors.title ? "border-red-500" : ""}`}
              placeholder="Ingrese nombre del Tag"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
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
              disabled={cargando}
            >
              {esEdicion ? "Guardar cambios" : "Crear Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};