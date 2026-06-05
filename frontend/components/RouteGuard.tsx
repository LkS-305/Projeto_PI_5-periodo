"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/SessionContext";

// Rotas acessíveis sem login. Todo o resto exige autenticação.
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/termos",
  "/privacidade",
  "/dev/metrics",
  "/explore",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Perfil público na vitrine (API de prestador exige login; página mostra CTA para entrar)
  if (pathname.startsWith("/prestador/")) return true;
  return false;
}

export function RouteGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const allowed = isPublic(pathname) || isAuthenticated;

  useEffect(() => {
    if (loading) return;
    if (!isPublic(pathname) && !isAuthenticated) {
      // Evita "Router action dispatched before initialization" no primeiro paint/hidratação
      const id = window.setTimeout(() => {
        router.replace("/");
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Enquanto carrega a sessão ou redireciona uma rota protegida, não renderiza o conteúdo.
  if (loading && !isPublic(pathname)) return null;
  if (!allowed) return null;

  return <>{children}</>;
}
