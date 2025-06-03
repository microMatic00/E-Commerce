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
  collectionId?: string;
  collectionName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[] | string; // Puede ser un objeto o string JSON cuando se guarda/recupera
  totalAmount: number;
  status: string;
  shippingAddress:
    | {
        name: string;
        address: string;
        city: string;
        zipCode: string;
        phone: string;
      }
    | string; // Puede ser un objeto o string JSON cuando se guarda/recupera
  createdAt: string;
}

// Servicio para gestionar órdenes
export const orderService = {
  // Crear una nueva orden
  createOrder: async (orderData: Omit<Order, "id">) => {
    try {
      console.log("Creando nueva orden en PocketBase...");
      console.log("Datos de la orden:", orderData);

      // Convertir arrays y objetos a formato JSON string para PocketBase
      const preparedOrderData = {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        items: JSON.stringify(orderData.items),
        totalAmount: orderData.totalAmount,
        status: orderData.status || "processing", // Por defecto "processing" según modelo solicitado
        shippingAddress: JSON.stringify(orderData.shippingAddress),
        createdAt: orderData.createdAt || new Date().toISOString(),
        // Los campos collectionId y collectionName son manejados internamente por PocketBase
      };

      const result = await pb
        .collection(COLLECTIONS.ORDERS)
        .create<Order>(preparedOrderData);

      console.log("Orden creada con éxito:", result);
      return result;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      throw error;
    }
  },

  // Obtener todas las órdenes (útil para panel de administración)
  getAllOrders: async () => {
    try {
      const records = await pb
        .collection(COLLECTIONS.ORDERS)
        .getList<Order>(1, 100, { sort: "-created" });
      return records;
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      throw error;
    }
  },

  // Obtener órdenes de un cliente específico por email
  getOrdersByCustomer: async (email: string) => {
    try {
      const records = await pb
        .collection(COLLECTIONS.ORDERS)
        .getList<Order>(1, 50, {
          filter: `customerEmail = "${email}"`,
          sort: "-created",
        });
      return records;
    } catch (error) {
      console.error("Error al obtener órdenes del cliente:", error);
      throw error;
    }
  },

  // Obtener una orden específica por ID
  getOrderById: async (id: string) => {
    try {
      const record = await pb.collection(COLLECTIONS.ORDERS).getOne<Order>(id);

      // Convertir de vuelta los campos JSON string a objetos JavaScript
      return {
        ...record,
        items:
          typeof record.items === "string"
            ? JSON.parse(record.items)
            : record.items,
        shippingAddress:
          typeof record.shippingAddress === "string"
            ? JSON.parse(record.shippingAddress)
            : record.shippingAddress,
      };
    } catch (error) {
      console.error("Error al obtener orden por ID:", error);
      throw error;
    }
  },

  // Actualizar el estado de una orden
  updateOrderStatus: async (id: string, status: string) => {
    try {
      const record = await pb
        .collection(COLLECTIONS.ORDERS)
        .update<Order>(id, { status });
      return record;
    } catch (error) {
      console.error("Error al actualizar estado de la orden:", error);
      throw error;
    }
  },
};

export default pb;
