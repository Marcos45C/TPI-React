import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCategory, claveToken } from "../api/url/UrlGenerales";
import toast from "react-hot-toast";

export const AnadirImgCategoria = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Seleccione una imagen antes de subir.");
      toast.error("Debe seleccionar una imagen.");
      return;
    }

    if (!id) {
      setError("ID de categoría no válido.");
      toast.error("ID de categoría inválido.");
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = `${apiCategory}${id}/picture`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${claveToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`error al subir la imagen: ${text}`);
      }

      toast.success("Imagen subida con exito");
      navigate(-1);

      setFile(null);
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error inesperado al subir la imagen.");
      toast.error(err.message || "Error inesperado al subir la imagen.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#708090]">
      <form
        onSubmit={handleUpload}
        className="bg-[#DCDCDC] p-6 rounded-lg shadow-lg w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Subir imagen a categoría
        </h2>

        {/* ARCHIVO */}
        <label className="block text-gray-700 font-medium">Imagen</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border px-3 py-2 rounded mt-1"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            className="w-full h-40 object-cover rounded mt-4 border"
          />
        )}

        {/* ERROR LOCAL */}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* BOTÓN SUBIR */}
        <button
          type="submit"
          disabled={cargando}
          className={`w-full py-2 rounded text-white font-medium ${
            cargando
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {cargando ? "Subiendo..." : "Subir Imagen"}
        </button>

        {/* BOTÓN VOLVER */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full py-2 rounded bg-gray-400 text-gray-800 hover:bg-[#708090] transition"
        >
          Volver
        </button>
      </form>
    </div>
  );
};
