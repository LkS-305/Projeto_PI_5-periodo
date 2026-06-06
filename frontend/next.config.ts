import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite carregar imagens de qualquer origem (uploads do backend e URLs
    // externas do populate) sem precisar listar cada domínio.
    unoptimized: true,
  },
};

export default nextConfig;
