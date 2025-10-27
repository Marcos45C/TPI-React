import { useCart } from '../context/CartContext';
import type { ProducInterface } from '../api/interfaces/general-Interfaces';

export const Carrito = () => {
  // Usa el hook personalizado
  const { cart, removeFromCart, clearCart, isCartOpen, toggleCart } = useCart();

  // Si el carrito está vacío, no mostramos nada
  if (cart.length === 0) {
    return null; // o podría mostrar algo, no sé, ¿tal vez un alert?
  }

  return (
    <>
      {/*Overlay (fondo oscuro) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity
          ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={toggleCart} // Cierra el carrito al hacer clic fuera
      ></div>

      {/*Panel del Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50
                  p-6 flex flex-col transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header del Carrito */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-red-700">Mi Refugio 🐾</h2> {/*emoji de emojiTerra*/}
          <button onClick={toggleCart} className="text-gray-500 hover:text-gray-800">
            {/* Icono "X" para cerrar */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del Carrito */}
        {cart.length > 0 ? (
          <div className="flex-1 overflow-y-auto"> {/* Para scroll si hay muchos items */}
            <ul className="divide-y divide-gray-200">
              {cart.map((mascota: ProducInterface) => (
                <li key={mascota.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`http://161.35.104.211:8000${mascota.pictures}`} 
                      alt={mascota.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{mascota.title}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(mascota.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Aún no has agregado mascotas al refugio.</p>
          </div>
        )}

        {/* Footer del Carrito (Botón de limpiar) */}
        {cart.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <button
              onClick={clearCart}
              className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-800 transition"
            >
              Limpiar Refugio
            </button>
          </div>
        )}
      </div>
    </>
  );
};
