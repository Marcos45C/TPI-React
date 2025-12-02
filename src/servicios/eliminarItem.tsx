export const eliminarItem = async ({ urlBase, id }: { urlBase: string; id: number }) => {
  try {
    const respuesta = await fetch(`${urlBase}${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer div",
      },
    });
    return respuesta.ok;
  } catch (error) {
    console.error("Error en eliminarItem:", error);
    return false;
  }
};