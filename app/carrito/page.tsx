"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function CarritoPage() {
  const {
    items,
    justCompletedOrder,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    resetOrderCompletion,
  } = useCart();
  const { showToast } = useToast();
  // Si acabamos de completar una orden, resetear la bandera
  // Pero usamos una ref para asegurarnos de que esto se ejecute solo una vez
  const hasResetCompletionRef = useRef(false);

  useEffect(() => {
    if (justCompletedOrder && !hasResetCompletionRef.current) {
      hasResetCompletionRef.current = true;
      resetOrderCompletion();
    }
  }, [justCompletedOrder, resetOrderCompletion]);

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
        <p className="text-xl mb-6">Tu carrito está vacío</p>
        <Link
          href="/catalogo"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tu Carrito</h1>
        <Link href="/catalogo" className="text-blue-500 hover:text-blue-700">
          ← Regresar al catálogo
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Producto</th>
              <th className="text-center py-2">Cantidad y Precio</th>
              <th className="text-right py-2">Acciones</th>
            </tr>
          </thead>{" "}
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4">
                  <div className="flex items-center">
                    {item.image ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_POCKETBASE_URL ||
                          "http://127.0.0.1:8090"
                        }/api/files/products/${item.id}/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 flex-shrink-0 object-cover rounded"
                        onError={(e) => {
                          // Si hay un error al cargar la imagen, mostrar un espacio en gris
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement?.classList.add(
                            "bg-gray-200"
                          );
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded"></div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        } else {
                          removeFromCart(item.id);
                          showToast("Producto eliminado del carrito", "info");
                        }
                      }}
                      className="bg-gray-200 px-2 py-1 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="bg-gray-200 px-2 py-1 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2">
                    ${item.price.toFixed(2)} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      showToast("Producto eliminado del carrito", "info");
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}{" "}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <button
          onClick={() => {
            clearCart();
            showToast("Carrito vaciado", "info");
          }}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mb-4 md:mb-0 hover:bg-gray-300 transition-colors"
        >
          Vaciar carrito
        </button>

        <div className="bg-gray-100 p-4 rounded">
          {" "}
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">${getCartTotal().toFixed(2)}</span>
          </div>
          <Link href="/checkout">
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Proceder al pago
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
