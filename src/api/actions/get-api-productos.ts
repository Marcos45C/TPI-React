import type {  ProducInterface } from "../interfaces/general-Interfaces";
import {  apiProduct } from "../url/mercado.api";


export const getProductis = async (): Promise<ProducInterface[]> => {
  // hacemos la petición con fetch
    const response = await fetch(`${apiProduct}`, {  
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
    precio:variable.price,
    categoriaid:variable.category_id,
    id:variable.id,
    picture:variable.picture
    }));
};
