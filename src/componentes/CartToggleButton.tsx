import { useCart } from '../context/CartContext';

export const CartToggleButton = () => {
  const { cart, toggleCart } = useCart();
  const itemCount = cart.length;

  return (
    <button
      onClick={toggleCart}
      className="fixed top-5 right-5 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
      aria-label="Abrir carrito"
    >
      {/* Icono SVG de Carrito */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.625M7.5 14.25h11.25M16.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.25 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>

      {/* Badge de Cantidad */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-gray-800 text-xs font-bold text-white rounded-full">
          {itemCount}
        </span>
      )}
    </button>
  );
};