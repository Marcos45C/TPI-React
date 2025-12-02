import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTags } from "../servicios/get-api-tags";
import type { TagsInterface } from "../api/interfaces/general-Interfaces";
import { apiProduct, claveToken } from "../api/url/refugioHuellitas";
import toast, { Toaster } from "react-hot-toast";

export const AnadirTagsProducto = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const producto: any = location.state?.productos;

  const [tagsDisponibles, setTagsDisponibles] = useState<TagsInterface[]>([]);
  const [cargandoTags, setCargandoTags] = useState(true);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    if (!producto) {
      navigate("/CRUD");
      return;
    }
    setCargandoTags(true);
    setTagsSeleccionados(
      producto.tags
        ?.map((t: { id: string | number }) =>
          parseInt((t.id ?? 0).toString(), 10)
        )
        .filter((id: number) => id > 0) || []
    );
    // console.log(producto);
    getTags()
      .then((data) => {
        setTagsDisponibles(data);
      })
      .catch((i) => {
        console.error("error al cargar tags:", i);
        toast.error("Error al cargar la lista de tags."); // Opcional: mostrar error
      })
      .finally(() => {
        setCargandoTags(false);
      });
  }, [producto, navigate]);

  const toggleTag = (id: number) => {
    if (tagsSeleccionados.includes(id)) {
      setTagsSeleccionados(tagsSeleccionados.filter((t) => t !== id));
    } else {
      setTagsSeleccionados([...tagsSeleccionados, id]);
    }
  };

  const guardarTags = async () => {
    try {
      const bodyData = {
        ...producto,
        tag_ids: tagsSeleccionados,
      };

      const res = await fetch(`${apiProduct}${producto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${claveToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Error al guardar tags");

      toast.success("Tags actualizados correctamente.", { duration: 4000 });
      setTimeout(() => {
        navigate("/CRUD");
      }, 800);
    } catch (e) {
      console.error(e);
      toast.error("Hubo un error al guardar los tags.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">
        Añadir Tags a: {producto?.title}
      </h2>

      {cargandoTags ? (
        <p className="text-gray-500">Cargando tags disponibles...</p>
      ) : tagsDisponibles.length === 0 ? (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded mb-4">
          <p className="font-bold">Información:</p>
          <p>No hay tags disponibles en el sistema para asignar.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          {tagsDisponibles.map((tag: TagsInterface) => {
            const tagId = parseInt((tag.id ?? 0).toString(), 10);
            if (tagId <= 0) return null;
            return (
              <button
                key={tagId}
                onClick={() => toggleTag(tagId)}
                className={`px-3 py-1 border rounded ${
                  tagsSeleccionados.includes(tagId)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {tag.title}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex justify-between pt-4">
        
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
          onClick={() => navigate(-1)} 
        >
          Cancelar
        </button>
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded ${
          cargandoTags || tagsDisponibles.length === 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={guardarTags}
        disabled={cargandoTags || tagsDisponibles.length === 0}
      >
        Guardar Tags
      </button>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};
