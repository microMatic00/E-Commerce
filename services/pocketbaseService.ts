import PocketBase from "pocketbase";
import { POCKETBASE_URL, COLLECTIONS } from "@/config/pocketbase.config";

// Definición de interfaces para los tipos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  category?: string;
  created?: string;
  updated?: string;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

// Inicialización de PocketBase
const pb = new PocketBase(POCKETBASE_URL); // Usa la URL desde la configuración

// Servicios para productos
export const productService = {
  getAll: async (options?: {
    sort?: string;
    filter?: string;
    page?: number;
    perPage?: number;
  }) => {
    try {
      console.log("Llamando a PocketBase para obtener productos...");
      console.log("URL de PocketBase:", POCKETBASE_URL);
      console.log("Colección de productos:", COLLECTIONS.PRODUCTS);
      console.log("Opciones de búsqueda:", options);

      const page = options?.page || 1;
      const perPage = options?.perPage || 50;
      const queryOptions: Record<string, string | number | boolean> = {
        sort: options?.sort || "created",
      };

      if (options?.filter) {
        queryOptions.filter = options.filter;
      }

      const result = await pb
        .collection(COLLECTIONS.PRODUCTS)
        .getList<Product>(page, perPage, queryOptions);

      console.log("Respuesta de PocketBase:", result);
      return result;
    } catch (error) {
      console.error("Error en productService.getAll:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    return await pb.collection(COLLECTIONS.PRODUCTS).getOne<Product>(id);
  },

  // Nuevos métodos adicionales
  getByCategory: async (category: string) => {
    return await pb.collection(COLLECTIONS.PRODUCTS).getList<Product>(1, 50, {
      filter: `category = "${category}"`,
      sort: "created",
    });
  },

  search: async (query: string) => {
    return await pb.collection(COLLECTIONS.PRODUCTS).getList<Product>(1, 50, {
      filter: `name ~ "${query}" || description ~ "${query}"`,
      sort: "created",
    });
  },
};

export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  createdAt: string;
}

export const orderService = {
  createOrder: async (orderData: Omit<Order, "id">) => {
    return await pb.collection(COLLECTIONS.ORDERS).create<Order>(orderData);
  },

  getOrdersByEmail: async (email: string) => {
    const result = await pb
      .collection(COLLECTIONS.ORDERS)
      .getList<Order>(1, 50, {
        filter: `customerEmail = "${email}"`,
        sort: "-created",
      });
    return result.items;
  },
};

export default pb;
