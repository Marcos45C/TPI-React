<h1>Proyecto "Refugio de Huellitas" (React + TS)</h1>
  <br>
Este proyecto es una aplicación frontend desarrollada con React y TypeScript, diseñada para listar categorías y <Strong>"mascotas"</Strong> (que son productos por algún motivo) desde una API. Permite a los usuarios filtrar productos por categoría y agregarlos a un <Strong>"refugio"</Strong> (un carrito de compras).

## 👥 Integrantes
👨‍💻- Marcos Cerezo <br>
👨‍💻- Lucas Rodríguez <br>

## Tecnologías Utilizadas 💻

* **React** (con Vite)
* **TypeScript**
* **React Context**: Para la gestión del estado global del carrito.
* **TailwindCSS**: Para los estilos.
* **Fetch API**: Para el consumo de datos.

## Arquitectura y Flujo de Datos 📂

El proyecto sigue un patrón de **Componentes Contenedores y Componentes Presentacionales** para separar responsabilidades y mantener la prolijidad.

### 1. Capa de Servicios (`servicios/`)

Para mantener el código limpio y reutilizable, toda la lógica de peticiones fetch` está aislada en sus propios archivos de servicio:
* **`get-api-categoria.ts`**: Contiene la función `getCategoris()`, que realiza un `fetch` asíncrono al endpoint de categorías.
* **`get-api-productos.ts`**: Contiene la función `getProductis()`, que hace lo mismo para el endpoint de productos.

### 2. Componente Contenedor (`ListadoGeneral.tsx`)
Este es el componente "inteligente" o "contenedor" principal de la aplicación.

* **Rol**: Su principal responsabilidad es **buscar los datos** y **gestionar el estado** principal.
* **Flujo de datos**:<br>
  1- Utiliza `useState` para manejar los estados `categoriass`, `productoss` y `selectedCategory`.<br>
  2- Utiliza `useEffect` para ejecutar las peticiones de datos solo una vez, cuando el componente se monta.<br>
  3- Dentro del `useEffect`, llama a `getCategoris()` y `getProductis()`. Como estas funciones ya son `async` y devuelven promesas, usamos el encadenamiento de promesas (`.then()` y `.catch()`) para manejar la respuesta y actualizar el estado. Esto evita declarar otra función `async` dentro del `useEffect`.
* **Paso de props**: Pasa los datos (como `productoss`) y las funciones (como `handleCategorySelect`) a los componentes presentacionales.

### 3. Componentes Presentacionales (`componentes/`)
Estos componentes "tontos" se encargan de **mostrar la UI** y *emitir eventos** para el componente padre.
* **`Categoriasss.tsx`**:
    * Recibe la lista de `categories` por props.
    * Mapea y renderiza cada categoría.
    * Maneja la **interacción del usuario**: Al hacer clic en una categoría, llama a la función `onCategorySelect` (recibida por props) para notificar al padre (`ListadoGeneral`) sobre la selección.
* **`Productos.tsx`**:
    * Recibe la lista completa de `productos` y la `selectedCategory` por props.
    * **Lógica de UI**: Filtra internamente la lista de productos basándose en `selectedCategory`.
    * Renderiza solo los productos filtrados.
------------
## Features Clave
### Gestión de Estado Global (Carrito)
* **`context/CartContext.tsx`**:
    * Define el `CartProvider` que envuelve la aplicación.
    * Maneja el estado del `cart` (la lista de productos agregados).
    * **Persistencia**: Guarda y lee el carrito en `localStorage` para que los datos persistan al recargar la página.
    * Maneja el estado de visibilidad del sidebar (`isCartOpen`, `toggleCart`).
    * Provee funciones globales (`addToCart`, `removeFromCart`) que pueden ser consumidas por cualquier componente.

### Sidebar del Carrito

* **`componentes/Carrito.tsx`**: Es el componente del sidebar que consume el `CartContext` para mostrar los items (`cart`) y su estado de visibilidad (`isCartOpen`).
* **`componentes/CartToggleButton.tsx`**: Es el botón flotante 🛒 que también consume el contexto para mostrar la cantidad de items (`cart.length`) y ejecutar `toggleCart()` al hacer clic.

### Instalaciones 
- router
