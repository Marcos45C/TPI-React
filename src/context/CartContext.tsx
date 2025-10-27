import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ProducInterface } from '../api/interfaces/general-Interfaces';

//Para definir la forma del context
interface CartContextState {
  cart: ProducInterface[];
  isCartOpen: boolean; 
  toggleCart: () => void;
  openCart: () => void;
  addToCart: (product: ProducInterface) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

//Crea el contexto
export const CartContext = createContext<CartContextState | undefined>(undefined);

//Crea el Proveedor (Provider)
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    //inicializa desde localStorage
const [cart, setCart] = useState<ProducInterface[]>(() => {
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al leer de localStorage", error);
      return [];
    }
  });
    // Efecto para guardar en el localStorage cada vez que el 'cart' cambia
useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error al guardar en localStorage", error);
    }
  }, [cart]);

  //Sidebar 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);

  //Funciones
  const addToCart = (product: ProducInterface) => {
    // Evitar duplicados
    setCart(prevCart => {
      const isAlreadyInCart = prevCart.find(item => item.id === product.id);
      if (isAlreadyInCart) {
        alert("Esta mascota ya está en el carrito."); //No se que otra forma podria manejarlo
        return prevCart;
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  //Proveer el estado y las funciones a sus hijas
  return (
    <CartContext.Provider 
    value={{ 
      cart, 
      isCartOpen,
      toggleCart,
      openCart,
      addToCart, 
      removeFromCart, 
      clearCart 
      }}>
      {children}
    </CartContext.Provider>
  );
};

//Hook personalizado para consumir el contexto 
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};