import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a Nuestra Tienda</h1>
      <p className="text-xl mb-8">Descubre nuestros productos exclusivos</p>
      <Link 
        href="/catalogo" 
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Ver Catálogo
      </Link>
    </div>
  );
}
