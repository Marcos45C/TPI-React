import type { CategoryInterfaz } from "../api/interfaces/general-Interfaces";
import { apiCategory } from "../api/url/refugioHuellitas";


export const getCategoris = async (): Promise<CategoryInterfaz[]> => {
  // hacemos la petición con fetch
  const respuesta = await fetch(`${apiCategory}`, {  
    method:'GET',
          headers: {
            "Accept": "application/json",
            "Authorization": "Bearer refugioHuellitas", 
          },  
        });
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  const data = await respuesta.json();
  // console.log(data);
  return data.map((variable: any) => ({
    title: variable.title,
    description:variable.description,
    id:variable.id,
    picture:variable.picture
  }));
};
