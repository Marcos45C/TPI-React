import type { CategoryInterfaz } from "../interfaces/general-Interfaces";
import { apiCategory } from "../url/mercado.api";


export const getCategoris = async (): Promise<CategoryInterfaz[]> => {
  // hacemos la petición con fetch
  const response = await fetch(`${apiCategory}`, {  
          headers: {
            "Accept": "application/json",
            "Authorization": "Bearer div", 
          },  
        });
  const data = await response.json();
  // console.log(data);
  return data.map((variable: any) => ({
    title: variable.title,
    description:variable.description,
    id:variable.id,
    picture:variable.picture
  }));
};
