"use client";

import { useCart, Product } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

// Datos de ejemplo para productos
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripción detallada del producto 1",
    price: 99.99,
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripción detallada del producto 2",
    price: 149.99,
  },
  {
    id: 3,
    name: "Producto 3",
    description: "Descripción detallada del producto 3",
    price: 79.99,
  },
  {
    id: 4,
    name: "Producto 4",
    description: "Descripción detallada del producto 4",
    price: 199.99,
  },
  {
    id: 5,
    name: "Producto 5",
    description: "Descripción detallada del producto 5",
    price: 129.99,
  },
  {
    id: 6,
    name: "Producto 6",
    description: "Descripción detallada del producto 6",
    price: 89.99,
  },
];

export default function CatalogPlaceholder() {
  const { addToCart, getProductQuantity } = useCart();
  const { showToast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <div>
                  {getProductQuantity(product.id) > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                      {getProductQuantity(product.id)} en carrito
                    </span>
                  )}
                </div>
              </div>
              <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => {
                  addToCart(product);
                  showToast(`${product.name} agregado al carrito`, "success");
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
