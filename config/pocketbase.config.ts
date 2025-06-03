/**
 * Configuración de PocketBase para la aplicación e-commerce
 *
 * Este archivo contiene la configuración y algunas utilidades para trabajar con PocketBase
 */

// URL base de PocketBase - Ajusta esto según tu entorno
// En desarrollo: http://127.0.0.1:8090
// En producción: https://tu-instancia-pocketbase.com
export const POCKETBASE_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

// Nombres de colecciones
export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  CARTS: "carts",
  ORDERS: "orders",
};

// Estado de los pedidos
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Funciones de utilidad para trabajar con los datos

/**
 * Formatea el precio para su visualización
 * @param price
 * @returns
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Tipo para un producto mínimo necesario para obtener la imagen
 */
interface ProductImage {
  id: string;
  image?: string;
}

/**
 * Obtiene la URL de la imagen de un producto
 * @param product Producto que contiene el campo image
 * @returns URL completa de la imagen
 */
export const getProductImageUrl = (product: ProductImage): string => {
  if (!product || !product.image) {
    return ""; // No devolver ninguna imagen por defecto
  }

  return `${POCKETBASE_URL}/api/files/${COLLECTIONS.PRODUCTS}/${product.id}/${product.image}`;
};

/**
 * Esquema esperado para la colección de productos
 */
export const productSchema = {
  name: "text",
  description: "text",
  price: "number",
  stock: "number",
  image: "file",
  category: "text",
};

/**
 * Esquema esperado para la colección de carritos
 */
export const cartSchema = {
  user: "relation:users",
  items: "json",
  updatedAt: "date",
};

/**
 * Esquema esperado para la colección de órdenes/pedidos
 */
export const orderSchema = {
  customerName: "text",
  customerEmail: "text",
  customerPhone: "text",
  items: "json",
  totalAmount: "number",
  status: "select",
  shippingAddress: "json",
  createdAt: "date",
};
