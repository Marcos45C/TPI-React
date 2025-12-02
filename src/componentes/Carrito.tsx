import { useEffect, useState } from "react";
import type { ProducInterface } from "../api/interfaces/general-Interfaces";
//Importe la pasarela de stripe
import { PasarelaStripe } from "./PasarelaStripe";
interface Props {
  compraProducto: ProducInterface | null;
}

interface ItemCarrito extends ProducInterface {
  cantidad: number;
}

const LS_KEY = "carritoMarcos";

export const Carrito = ({ compraProducto }: Props) => {
  // inicializar
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ItemCarrito[];
    } catch (err) {
      console.error("Error parseando carrito desde localStorage:", err);
      return [];
    }
  });

  const [abierto, setAbierto] = useState(false);

  //Estado de la pasarela, para abrir o cerrarla
  const [mostrarPago, setMostrarPago] = useState(false);

  // aca cada vez que cambie se guarda
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(carrito));
    } catch (err) {
      console.error("Error guardando carrito en localStorage:", err);
    }
  }, [carrito]);

  
  useEffect(() => {
    if (!compraProducto) return;
    
    setCarrito((prev) => {
      const existente = prev.find((p) => p.id === compraProducto.id);
    if(existente) {
      return prev.map((p) =>
       p.id === compraProducto.id ? {...p, cantidad: p.cantidad + 1} : p); //aca lo modificado, así aumenta la cantidad 
    }                                                                     //del mismo producto si ya existe
    return [...prev, {...compraProducto, cantidad: 1}]; //si es un producto nuevo, agrega con cantidad 1
    });
  }, [compraProducto]);

  const toggleCarrito = () => setAbierto((s) => !s);
 
  //borrar todo
  const eliminarProducto = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const limpiarCarrito = () => setCarrito([]);

  const aumentarCantidad = (id: number) => { //pa agregar más al carrito
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id?{...p, cantidad: p.cantidad + 1} : p)
  );
  };

  const disminuirCantidad = (id:number) => { //para quitar del carrito
    setCarrito((prev) =>
      prev
        .map((p) => p.id === id?{...p, cantidad:p.cantidad - 1} : p
      )
      .filter((p) => p.cantidad > 0)
      );
  };

  //Lógica del precio, guardo los tags
   const calcularSubtotalItem = (item: ItemCarrito): number => {
    const tags = item.tags || [];
    const tiene2x1 = tags.some((t: any) => t.title.toLowerCase().includes("2x1"));
    const tieneDescuento = tags.some((t: any) => t.title.toLowerCase().includes("descuento"));

    let precioTotal= item.cantidad * item.price;
  //Lógica del 2x1
  //si tiene 2x1, cada par se cobra como 1
  if (tiene2x1) {
      // Si llevas 2, pagas 1. Si llevas 3, pagas 2.
      const unidadesAPagar = Math.ceil(item.cantidad / 2);
      precioTotal = unidadesAPagar * item.price;
    } 

  //Lógica de descuento
  if(tieneDescuento){
    //Aplica un descuento de 15% al precio unitario.
    precioTotal = precioTotal * 0.85;
  }

  //El precio normal
  return precioTotal; 
  };

  const total = carrito.reduce( 
    (acc, item) => acc + calcularSubtotalItem(item), 0
  );

  //Esta funcion para cuando se termine el pago 
  const handlePagoExitoso = () => {
    limpiarCarrito(); //limpio el carrito
    setAbierto(false); //se cierra el panel lateral del carrito
    alert("pago exitoso"); 
  }

  //Helper visual, para mostrar qué promo se aplica
  const obtenerEtiquetaPromo = (item: ItemCarrito) => {
    const tags = item.tags || [];
    const tiene2x1 = tags.some((t: any) => t.title.toLowerCase().includes("2x1"));
    const tieneDescuento = tags.some((t: any) => t.title.toLowerCase().includes("descuento"));

    if(tiene2x1 && tieneDescuento) return '🌋 ¡2x1 + 15% OFF';
    if(tags.some((t: any) => t.title.toLowerCase().includes("2x1"))) return '⚡ Promo 2x1';
    if(tags.some((t: any) => t.title.toLowerCase().includes("descuento"))) return '🔥 15% OFF';
     return null;
  }


  return (
   <>
      <button
        onClick={toggleCarrito}
        className="fixed top-5 right-5 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
        aria-label="Abrir carrito"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.625M7.5 14.25h11.25M16.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.25 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>

        {carrito.length > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-gray-800 text-xs font-bold text-white rounded-full">
            {carrito.reduce((a,b) => a + b.cantidad, 0)}
          </span>
        )}
      </button>

      {abierto && <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleCarrito} />}
        
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 p-6 flex flex-col transition-transform duration-300 ease-in-out ${abierto ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-red-700">Carrito 🛒</h2>
          <button onClick={toggleCarrito} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {carrito.length > 0 ? (
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-200">
            {carrito.map((item) => {
              // Calculamos el subtotal de este item para mostrarlo
              const subtotalItem = calcularSubtotalItem(item);
              const etiqueta = obtenerEtiquetaPromo(item);

              return (
              <li key={item.id} className="flex justify-between items-center py-3">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.pictures && item.pictures.length ? `http://161.35.104.211:8000${item.pictures[0]}` : "/placeholder.png"}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">{item.title}</h3>
                    
                    {/* Visualización de precio unitario y promo */}
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 text-sm">${item.price}</p>
                        {etiqueta && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">
                                {etiqueta}
                            </span>
                        )}
                    </div>
                    
                    {/* Visualización del subtotal de la linea */}
                    <p className="text-sm font-bold text-gray-900 mt-1">
                        Subtotal: ${subtotalItem.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => disminuirCantidad(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-red-300 font-bold">-</button>
                    <span className="text-sm font-medium w-4 text-center">{item.cantidad}</span>
                    <button onClick={() => aumentarCantidad(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-green-300 font-bold">+</button>
                    </div>
                    <button onClick={() => eliminarProducto(item.id)} 
                    className="text-red-500 hover:text-red-700 text-xs mt-2 underline">Quitar</button>
                </div>
              </li>
            )})}
          </ul>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Tu carrito está vacío.</p>
          </div>
        )}

        {carrito.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-bold text-red-700">${total.toFixed(2)}</span>
            </div>
            
            <button onClick={() => setMostrarPago(true) } 
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-200 shadow-lg transform active:scale-95">
                Pagar Ahora
            </button>

            <button 
                onClick={limpiarCarrito} 
                className="w-full mt-2 py-3 rounded-xl text-gray-500 font-bold border border-gray-200 hover:bg-gray-100 hover:text-red-600 transition">
                Vaciar carrito
            </button>
          </div>
        )}
      </div>

      <PasarelaStripe 
        isOpen={mostrarPago}
        onClose={() => setMostrarPago(false)}
        total={total}
        onPaymentSuccess={handlePagoExitoso}
        />
    </>
  );
};
