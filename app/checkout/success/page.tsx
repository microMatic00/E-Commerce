"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { showToast } = useToast();
  const { justCompletedOrder, resetOrderCompletion } = useCart(); // Simplificamos la lógica para evitar bucles
  useEffect(() => {
    // Mostrar el toast solo si hay un orderId
    if (orderId) {
      showToast("¡Tu pedido ha sido registrado con éxito!", "success");
    }

    // Siempre resetear la bandera de orden completada
    if (justCompletedOrder) {
      resetOrderCompletion();
    }
  }, [orderId, showToast, justCompletedOrder, resetOrderCompletion]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>

        <p className="text-gray-700 mb-6">
          Tu pedido ha sido registrado con éxito.
          {orderId && (
            <>
              <br />
              <span className="font-medium">
                Número de pedido:{" "}
                <span className="text-blue-600">{orderId}</span>
              </span>
            </>
          )}
        </p>

        <p className="text-gray-600 mb-8">
          Te hemos enviado un correo electrónico con los detalles de tu pedido.
          Puedes consultar el estado de tu pedido en cualquier momento en la
          sección &quot;Mis Pedidos&quot;.
        </p>

        <div className="space-y-4">
          <Link
            href="/pedidos"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/catalogo"
            className="block w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
