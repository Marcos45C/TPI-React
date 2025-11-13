
import { useNavigate } from "react-router-dom";
import type { CategoryInterfaz } from "../api/interfaces/general-Interfaces";
import imgDefecto from "../imagenes/logoCenter.png";

interface Props {
  categories: CategoryInterfaz[];
  onCategorySelect?: (id: number | null) => void; //lo hice opcional

}

export function Categoriasss({ categories,onCategorySelect  }: Props) {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    if(onCategorySelect) onCategorySelect(id); //para usar localmente
    navigate(`/categoria/${id}`); //redirige a la pagina
  }

  return (
  <div className="w-full hover-scroll flex space-x-4 pb-4">
      {categories.map((cat) => (
        <div
          className="min-w-[200px] p-0 bg-gray-100 rounded-lg shadow text-center transition cursor-pointer hover:scale-105"
          key={cat.id}
          onClick={() => cat.id !== null && handleClick(cat.id)}
        >
      
            <img
            src={cat.picture ? `http://161.35.104.211:8000${cat.picture}` : imgDefecto}
            alt={cat.title || "no hay"}
            className="w-full h-48 object-cover mx-auto mix-blend-multiply brightness-110 mb-0 rounded"
            />
          <h2 className="text-xl font-bold text-red-700">{cat.title}</h2>
        </div>
      ))}
    </div>
  );
}