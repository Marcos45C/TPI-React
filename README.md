<h1>Proyecto de dde la asignatura "WEB II" de TUDA (React + TS)</h1>
  <br>
Este proyecto es una aplicación frontend desarrollada con **React** y **TypeScript**, diseñada para gestionar
un e-commerce. Lista general de categorías de productos consumidos desde una API externa. 
Permite a los usuarios(clientes) filtrar por categorías, ver detalles y agregar productos al carrito de compras, además cuenta con un panel de admin (CRUD) y sandbox de una pasarela de pagos.

## 👥 Integrantes
👨‍💻- Marcos Cerezo <br>
👨‍💻- Lucas Rodríguez <br>

##  💻 Tecnologías Utilizadas

* **React** (con Vite)
* **TypeScript** (Tipado estático con interfaces centralizadas)
* **React Router**: Navegación entre vistas (SPA).
* **TailwindCSS**: Para los estilos.
* **Fetch API**: Para el consumo de datos.
* **Stripe (Sandbox)**: Simula la pasarela de pagos.

## Arquitectura y Flujo de Datos 📂
El proyecto mejoró para incluir enrutamiento, además de una mejor division de archivos. 

### 1. Configuración y Tipos
* **`refugioHuellitas.ts`**: Archivo de configuración central donde se almacenan las URLs de las APIs (`categoria`, `producto`, etc.).
* **`general-Interfaces.ts`**: Define los contratos de datos (Interfaces de TypeScript) para asegurar que los objetos `Producto`, `Categoria`, etc., se usen correctamente en toda la app.
* **Otro punto:**
El proyecto sigue un patrón de **Componentes Contenedores y Componentes de Presentación** para separar responsabilidades y mantener la prolijidad.

### 2. Navegación (`Routter.tsx`)
Maneja las rutas de la aplicación utilizando `react-router-dom`:
* `/`: Pantalla principal (`ListadoGeneral`).
* `/crud`: Panel de administración.
* `/detalle/:id`: Vista de detalle de un producto específico.
* `/categoria/:id`: Vista filtrada por categoría.


### 3. Capa de Servicios (`servicios/`)
Para mantener el código limpio y reutilizable, toda la lógica de peticiones fetch` está aislada en sus propios archivos de servicio:

* **get-api-categoria.ts**: Contiene la función `getCategoris()`, que realiza un fetch asíncrono al endpoint de categorías.
* **get-api-productos.ts**: Contiene la función `getProductis()`, que hace lo mismo para el endpoint de productos.
* **get-api-tags.ts**: Y por último, que contiene la función `getTags()` que también hace lo mismo.

### 4. Componentes Presentacionales (`componentes/`)
Estos componentes "tontos" se encargan de **mostrar la UI** y *emitir eventos** para el componente padre.
* **`Productos.tsx`**: Tarjeta individual de presentación del producto.
* **`Categorias.tsx`**: Menú o grilla para selección de filtros.
* **`Carrito.tsx`**: Sidebar que muestra los items agregados.
* **`PasarelaStripe.tsx`**: Componente que integra el modo Sandbox de Stripe para simular pagos.
* **`Footer.tsx`**: Pie de página con información del sitio.

## 5. Assets o imagenes
* `logoCenter.png`: logo principal de la página.
* `logoCarga.png`: Usado para algunos estados de *loading* (como en `ListadoGeneral.tsx` o `DetalleProducto.tsx`).

## 6. Vistas (views)
Acá se encuentran las vistas principales: 
* **`ListadoGeneral.tsx`**: Componente contenedor principal. Muestra el catálogo y gestiona la carga inicial.
* **`DetalleProducto.tsx`**: Renderiza la información completa de un ítem seleccionado.
* **`CategoriaPage.tsx`**: Se renderiza cuando el usuario selecciona una categoría específica desde el listado.
* **`CRUD.tsx`**: Panel de gestión para Crear, Leer, Actualizar y Borrar registros, unicamente para usuarios `Admin`.

## Componente Contenedor (`ListadoGeneral.tsx`)
Este es el componente "inteligente" o "contenedor" principal de la aplicación.
* **Rol**: Su principal responsabilidad es **buscar los datos** y **gestionar el estado** principal.
* **Flujo de datos**:<br>
  1- Utiliza `useState` para manejar los estados `categoriass`, `productoss` y `selectedCategory`.<br>
  2- Utiliza `useEffect` para ejecutar las peticiones de datos solo una vez, cuando el componente se monta.<br>
  3- Dentro del `useEffect`, llama a `getCategoris()` y `getProductis()`. Como estas funciones ya son `async` y devuelven promesas, usamos el encadenamiento de promesas (`.then()` y `.catch()`) para manejar la respuesta y actualizar el estado. Esto evita declarar otra función `async` dentro del `useEffect`.
* **Paso de props**: Pasa los datos (como `productoss`) y las funciones (como `handleCategorySelect`) a los componentes presentacionales.
------------
## ⚓ Features Clave
### Gestión de Estado (Carrito 🛒)
Implementado de forma *Global* con estado persistente en <Strong>`localStorage`</Strong> para no perder los productos almacenados en el, en caso de recargar/refrescar la página.  

## 💳 Pagos (Stripe SandBox) 
Integramos la API de Stripe en modo de pruebas, permitiendo simular el flujo de compra del carrito.

## 🔎 Búsqueda
La página tiene una navegación fluida, permitiendo al usuario buscar por productos, categorias o descripción.

### Instalaciones 
- router
- npm install react-hot-toast, para el manejo de alertas
