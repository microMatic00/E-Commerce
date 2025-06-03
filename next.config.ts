import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["127.0.0.1"], // Permite cargar imágenes desde PocketBase en desarrollo
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
      {
        // Configuración para producción - Actualiza cuando tengas tu URL real
        protocol: "https",
        hostname: "api.mitiendaecommerce.com", // Reemplaza con tu dominio real en producción
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
