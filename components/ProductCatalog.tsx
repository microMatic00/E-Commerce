"use client";

import { useEffect, useState } from "react";
import { useCart, Product } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { productService } from "@/services/pocketbaseService";

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const { addToCart, getProductQuantity } = useCart();
  const { showToast } = useToast();
  useEffect(() => {
    // Crear un AbortController para cada solicitud
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Determinar el criterio de ordenamiento
        let sort = "name";
        switch (sortOption) {
          case "price-asc":
            sort = "price";
            break;
          case "price-desc":
            sort = "-price"; // El guión indica orden descendente
            break;
          case "name-desc":
            sort = "-name";
            break;
          default:
            sort = "name"; // Por defecto, ordenar por nombre ascendente
        }

        // Construir filtro si hay término de búsqueda o categoría
        let filter = "";
        if (searchTerm) {
          filter = `name~"${searchTerm}" || description~"${searchTerm}"`;
        }

        if (categoryFilter) {
          const categoryCondition = `category="${categoryFilter}"`;
          filter = filter
            ? `(${filter}) && ${categoryCondition}`
            : categoryCondition;
        }

        // Realizar la consulta a PocketBase con las opciones y el AbortSignal
        const result = await productService.getAll({
          sort,
          filter: filter || undefined,
          signal, // Pasar la señal de abort
        });
        // Mapea la respuesta de PocketBase al formato de Product
        const productList = result.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price:
            typeof item.price === "string"
              ? parseFloat(item.price)
              : item.price,
          image: item.image,
          stock: item.stock,
          category: item.category,
        }));

        setProducts(productList);

        // Extraer categorías únicas para el filtro
        if (productList.length > 0) {
          const uniqueCategories = [
            ...new Set(
              productList.map((p) => p.category).filter(Boolean) as string[]
            ),
          ];
          setCategories(uniqueCategories);
        }
        setError(null);
      } catch (err) {
        // No mostrar error si la solicitud fue cancelada intencionalmente
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error al cargar productos:", err);
          setError(
            "Error al cargar los productos. Inténtalo de nuevo más tarde."
          );
        }
      } finally {
        // Solo cambiar el estado de carga si no se ha cancelado la solicitud
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Función de limpieza para cancelar solicitudes pendientes cuando el componente se desmonta
    // o cuando cambian las dependencias
    return () => {
      console.log("Cancelando solicitud de productos pendiente");
      abortController.abort();
    };
  }, [sortOption, searchTerm, categoryFilter]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`${product.name} añadido al carrito`, "success");
  };
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Catálogo de Productos</h2>

        {/* Controles deshabilitados durante la carga */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 opacity-50">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>
          <div className="md:w-1/4">
            <select className="w-full p-2 border rounded-md" disabled>
              <option>Cargando categorías...</option>
            </select>
          </div>
          <div className="md:w-1/4">
            <select className="w-full p-2 border rounded-md" disabled>
              <option>Ordenar por</option>
            </select>
          </div>
        </div>

        {/* Skeleton loader para productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow animate-pulse"
            >
              <div className="bg-gray-200 w-full h-48"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Catálogo de Productos</h2>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-medium">Error al cargar el catálogo</p>
          <p className="mt-1">{error}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reintentar
          </button>
          <button
            onClick={() => {
              setError(null);
              setSearchTerm("");
              setCategoryFilter("");
              setSortOption("name");
            }}
            className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Catálogo de Productos</h2>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          {" "}
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full p-2 border rounded-md"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro de categoría */}
        <div className="md:w-1/4">
          {" "}
          <select
            className="w-full p-2 border rounded-md"
            value={categoryFilter || ""}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de orden */}
        <div className="md:w-1/4">
          {" "}
          <select
            className="w-full p-2 border rounded-md"
            value={sortOption || "name"}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio (menor a mayor)</option>
            <option value="price-desc">Precio (mayor a menor)</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No hay productos disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {" "}
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {" "}
              <div className="w-full h-48">
                {" "}
                {product.image ? (
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_POCKETBASE_URL ||
                      "http://127.0.0.1:8090"
                    }/api/files/products/${product.id}/${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      // Si hay un error al cargar la imagen, muestra un espacio en gris
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement?.classList.add(
                        "bg-gray-200"
                      );
                    }}
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-48 flex items-center justify-center">
                    {/* No mostrar ningún texto, solo el espacio en gris */}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {product.price.toFixed(2)}€
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Añadir
                  </button>
                </div>

                {getProductQuantity(product.id) > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    {getProductQuantity(product.id)} en carrito
                  </div>
                )}

                {product.stock !== undefined && product.stock <= 5 && (
                  <div className="mt-2 text-sm text-amber-600">
                    ¡Solo quedan {product.stock} unidades!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
