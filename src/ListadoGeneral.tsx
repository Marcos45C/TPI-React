import { useEffect, useState } from "react";
//donde hago la peticion
import { getCategoris } from "./servicios/get-api-categoria";
import { getProductis } from "./servicios/get-api-productos";
//todas las interfaces
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";




export const ListadoGeneral = () => {
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [productoss, setProductoss] = useState<ProducInterface[]>([]);

    useEffect(() => {

        // const fetchCategorias = async () => {
        //     const categoriesapi = await getCategoris();
        //     setCategoriass(categoriesapi);
        // };
         // const fetchProductos = async () => {
        //     const productosapi = await getProductis();
        //     setProductoss(productosapi);
        // };
        getCategoris()
            .then(setCategoriass)//si da bien y es lo mismo de hacer asi .then((data) => setCategoriass(data))
            .catch((e) => console.error("Error al cargar categorías:", e));
        getProductis()
            .then(setProductoss)//
            .catch((e) => console.error("Error al cargar productos:", e));
        
    }, []);

    return (
        <div>
            <h2>Listado General de Categorias </h2>
            <ul>
                {categoriass.map((variableCat) => (
                    <li key={variableCat.id}>{variableCat.title}</li>
                ))}
                <h2>Listado General de Productos </h2>
                {productoss.map((variableProdc) => (
                    <li key={variableProdc.id}>{variableProdc.title}, {variableProdc.description}</li>
                ))}
            </ul>
        </div>
    );
};
