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

  const [tagsSeleccionados, setTagsSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    if (!producto) {
      navigate("/CRUD");
      return;
    }

    setTagsSeleccionados(
      producto.tags
        ?.map((t: { id: string | number }) =>
          parseInt((t.id ?? 0).toString(), 10)
        )
        .filter((id: number) => id > 0) || []
    );
    console.log(producto);
    getTags()
      .then(setTagsDisponibles)
      .catch((i) => console.error("error al cargar tags:", i));
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

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={guardarTags}
      >
        Guardar Tags
      </button>
      <Toaster position="top-center" />
    </div>
  );
};
