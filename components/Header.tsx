"use client";

import Link from "next/link";
import CartCounter from "./CartCounter";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            E-Commerce
          </Link>
          <nav className="flex space-x-8">
            <Link href="/" className="hover:text-gray-600">
              Inicio
            </Link>
            <Link href="/catalogo" className="hover:text-gray-600">
              Catálogo
            </Link>
            <Link
              href="/carrito"
              className="hover:text-gray-600 flex items-center gap-1"
            >
              Carrito
              <CartCounter />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
