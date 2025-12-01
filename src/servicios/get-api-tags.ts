import type { TagsInterface } from "../api/interfaces/general-Interfaces";
import { apiTags, claveToken } from "../api/url/refugioHuellitas";

export const getTags = async (): Promise<TagsInterface[]> => {
  // hacemos la petición con fetch
  const respuesta = await fetch(`${apiTags}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${claveToken}`,
    },
  });
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  const data = await respuesta.json();
  // console.log(data);
  return data.map((variable: any) => ({
    title: variable.title,
    id: variable.id,
  }));
};
