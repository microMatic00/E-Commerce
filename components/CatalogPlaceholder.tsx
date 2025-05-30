export default function CatalogPlaceholder() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md p-4">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Producto {item}</h3>
            <p className="text-gray-600 mb-2">Descripción del producto</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$99.99</span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
