"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Definir el tipo de producto y item del carrito
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Definir el tipo del contexto
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getProductQuantity: (productId: string) => number;
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// Función para cargar carrito desde localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return []; // Para Next.js que se ejecuta en servidor

  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error("Error al cargar el carrito:", e);
      return [];
    }
  }
  return [];
};

// Proveedor de contexto
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito al inicio
  useEffect(() => {
    setItems(loadCartFromStorage());
  }, []);
  // Guardar en localStorage cuando cambie items
  useEffect(() => {
    // Solo guardar si estamos en el navegador
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  // Añadir producto al carrito
  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      // Verificar si el producto ya existe en el carrito
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Si ya existe, incrementar cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Si no existe, agregar como nuevo con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }; // Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Si la cantidad es 0 o menos, eliminar el producto
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  // Obtener total del carrito
  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Obtener cantidad total de items
  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  // Obtener cantidad de un producto específico
  const getProductQuantity = (productId: string) => {
    const item = items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    getProductQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
