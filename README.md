Yo y no se quien mas

16/10 ListadoGeneral.tsx
para hacer petisiones usamos un fetch (que esta en servicios) separado para poder reutilizarlo mejor , se ve mas pro y limpio.
despues use un Useeffect para para traer las cosas de getCategoris, usando una promesa encadenada, sin usar async de nuevo dentro del componente, porque getCategories() es una función asincrona (usa async/await ), por lo tanto devuelve una promise.

21/10
ListadoGeneral = trae los datos atravez del fetch
Categoriass= muestra losa datos y tambien le da interracion