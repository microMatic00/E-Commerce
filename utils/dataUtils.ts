/**
 * Utilidades para trabajar con datos de PocketBase en la aplicación
 */

import { CartItem as CartItemContext } from "@/context/CartContext";
import { CartItem as CartItemPocketBase } from "@/services/pocketbaseService";

/**
 * Convierte un ID a string (necesario para PocketBase)
 * @param id ID numérico o string
 * @returns ID como string
 */
export const ensureStringId = (id: string | number): string => {
  return String(id);
};

/**
 * Convierte un array de CartItems del contexto a CartItems para PocketBase
 * asegurando que los IDs sean strings
 */
export const convertCartItemsForPocketBase = (
  items: CartItemContext[]
): CartItemPocketBase[] => {
  return items.map((item) => ({
    ...item,
    id: ensureStringId(item.id),
  }));
};

/**
 * Formatea un precio para mostrar
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Formatea una fecha
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
