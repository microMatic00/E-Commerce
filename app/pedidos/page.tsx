"use client";

import { useState } from "react";
import { orderService, Order, CartItem } from "@/services/pocketbaseService";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const { showToast } = useToast();
  const searchOrdersByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(true);
    setLoading(true);

    try {
      if (email) {
        const result = await orderService.getOrdersByCustomer(email);
        setOrders(result.items);
        if (result.items.length === 0) {
          showToast(
            "No se encontraron pedidos para este correo electrónico",
            "info"
          );
        }
      } else {
        setOrders([]);
        showToast("Por favor ingrese un correo electrónico", "info");
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      showToast("Error al cargar los pedidos", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar el estado del pedido en español
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      processing: { label: "En proceso", color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-800" },
      delivered: { label: "Entregado", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };

    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seguimiento de Pedidos</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Consultar mis pedidos</h2>
        <form
          onSubmit={searchOrdersByEmail}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-grow">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Correo electrónico utilizado en la compra
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Buscando...
                </span>
              ) : (
                "Buscar pedidos"
              )}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {!searchSubmitted ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-lg text-gray-600">
                Ingrese su correo electrónico para ver sus pedidos
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-lg text-gray-600 mb-4">
                No se encontraron pedidos para este correo electrónico
              </p>
              <Link
                href="/catalogo"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusLabel(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <span className="text-sm text-gray-500">
                          Pedido #{order.id}
                        </span>
                        <p className="font-medium">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="font-semibold">
                        Total: ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Productos:</h3>{" "}
                      <ul className="space-y-2">
                        {typeof order.items === "string"
                          ? JSON.parse(order.items).map(
                              (item: CartItem, idx: number) => (
                                <li key={idx} className="flex justify-between">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="text-gray-600">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </li>
                              )
                            )
                          : order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-gray-600">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-semibold mb-2">
                          Dirección de envío:
                        </h3>
                        {typeof order.shippingAddress === "string" ? (
                          (() => {
                            const address = JSON.parse(
                              order.shippingAddress as string
                            );
                            return (
                              <>
                                <p>{address.name}</p>
                                <p>{address.address}</p>
                                <p>
                                  {address.city}, {address.zipCode}
                                </p>
                                <p>Tel: {address.phone}</p>
                              </>
                            );
                          })()
                        ) : (
                          <>
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.zipCode}
                            </p>
                            <p>Tel: {order.shippingAddress.phone}</p>
                          </>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-semibold mb-2">
                          Información de contacto:
                        </h3>
                        <p>Nombre: {order.customerName}</p>
                        <p>Email: {order.customerEmail}</p>
                        <p>Teléfono: {order.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
