import { useEffect, useState } from "react";
// import { baseApi} from "./api/url/mercado.api";
import type { CategoryInterfaz } from "./api/interfaces/general-Interfaces";
import { apiCategory } from "./api/url/refugioHuellitas";

export const Categoriasss = () => {

const [categories, setCategories] = useState<CategoryInterfaz[]>([]);

  const getCategories = async ()=> {
    try {
      const response = await fetch(`${apiCategory}`, {  
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer refugioHuellitas", 
        },  
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
      // console.log(data);  
    } catch (error) {
      console.error("error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);//esto hace q al iniciar el componente, llame a getCategories y haga la peticion

  return (
    <div>
    
      <h2>categorías</h2>
      <ul>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li key={cat.id}>
              {cat.title}
            </li>
          ))
        ) : (
          <p>error...</p>
        )}
      </ul>
    </div>
  );
};
