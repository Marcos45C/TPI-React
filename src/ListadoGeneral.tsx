import { useEffect, useState } from "react";
//donde hago la peticion
import { getCategoris } from "./api/actions/get-api-categoria";
import { getProductis } from "./api/actions/get-api-productos";
import type { CategoryInterfaz, ProducInterface } from "./api/interfaces/general-Interfaces";



export const ListadoGeneral = () => {
    const [categoriass, setCategoriass] = useState<CategoryInterfaz[]>([]);
    const [productoss, setProductoss] = useState<ProducInterface[]>([]);

    useEffect(() => {

    const fetchCategorias = async () => {
        const categoriesapi = await getCategoris();
        setCategoriass(categoriesapi);
    };

    const fetchProductos = async () => {
        const productosapi = await getProductis();
        setProductoss(productosapi);
    };

    fetchCategorias();
    fetchProductos();
    }, []);

    return (
    <div>
        <h2>Listado General de Categorias </h2>
        <ul>
        {categoriass.map((variableCat) => (
            <li key={variableCat.id}>{variableCat.title}</li>
        ))}
        <h2>Listado General de Productos </h2>
            {productoss.map((variableCat) => (
            <li key={variableCat.id}>{variableCat.title}</li>
        ))}

        </ul>
    </div>
    );
};
