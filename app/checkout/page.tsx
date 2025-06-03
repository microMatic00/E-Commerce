"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { orderService } from "@/services/pocketbaseService";
import { useRouter } from "next/navigation";
import { ORDER_STATUS } from "@/config/pocketbase.config";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const { showToast } = useToast();
  const router = useRouter();
  // Redireccionar al carrito si está vacío
  // Necesitamos usar useEffect para la redirección del lado del cliente
  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito");
      showToast("El carrito está vacío", "info");
    }
  }, [items.length, router, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: items.map((item) => ({
          ...item,
          id: String(item.id),
        })),
        totalAmount: getCartTotal(),
        status: ORDER_STATUS.PENDING,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        createdAt: new Date().toISOString(),
      };

      const newOrder = await orderService.createOrder(orderData);

      // Limpiar carrito después de crear el pedido
      clearCart();

      showToast("¡Pedido realizado con éxito!", "success");

      // Mostrar mensaje de confirmación
      alert(`¡Gracias por tu compra! Tu número de pedido es: ${newOrder.id}`);

      // Redireccionar a la página principal
      router.push("/");
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      showToast("Error al procesar el pedido. Intente nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de envío */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Datos de Envío</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Código postal
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/carrito" className="text-blue-600 hover:text-blue-800">
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
