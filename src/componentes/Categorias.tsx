
import type { CategoryInterfaz } from "../api/interfaces/general-Interfaces";


interface Props {
  categories: CategoryInterfaz[];
  onCategorySelect: (id: number | null) => void;

}

export function Categoriasss({ categories,onCategorySelect  }: Props) {
  // const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);


  // const handleClick = (cat: CategoryInterfaz) => {
  //   setSelectedCategoryId(cat.id);
  //   console.log("Categoría seleccionada:", cat.title);
  // };

  

  return (
  <div className="w-full hover-scroll flex space-x-4 pb-4">
      {categories.map((cat) => (
        <div
          className="min-w-[200px] p-0 bg-gray-100 rounded-lg shadow text-center transition cursor-pointer hover:scale-105"
          key={cat.id}
            
          onClick={() => onCategorySelect(cat.id)}
        >
          <div className="transition-transform duration-200">
            <img
              src={`http://161.35.104.211:8000${cat.picture}`}
              alt={cat.title || "no hay"}
              className="w-full h-48 object-cover mx-auto mix-blend-multiply brightness-110 mb-0 rounded"
            />
          </div>
          <h2 className="text-xl font-bold text-red-700">{cat.title}</h2>
        </div>
      ))}
    </div>
  );
}