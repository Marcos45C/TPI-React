
import type { ProducInterface } from "../api/interfaces/general-Interfaces";
import { apiProduct } from "../api/url/refugioHuellitas";


export const getProductis = async (): Promise<ProducInterface[]> => {
  // hacemos la petición con fetch
    const respuesta = await fetch(`${apiProduct}`, {  
      method:'GET',
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer div", 
            },  
        });
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
    const data = await respuesta.json();
  // console.log(data);
    return data.map((variable: any) => ({
    title: variable.title,
    description:variable.description,
    price:variable.price,
    categoria_id:variable.category_id,
    id:variable.id,
    pictures:variable.pictures
    }));
};
