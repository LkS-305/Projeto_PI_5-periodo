"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/SessionContext";

// Rotas acessíveis sem login. Todo o resto exige autenticação.
const PUBLIC_PATHS = ["/", "/login", "/register", "/termos", "/privacidade"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

export function RouteGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const allowed = isPublic(pathname) || isAuthenticated;

  useEffect(() => {
    if (loading) return;
    if (!isPublic(pathname) && !isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Enquanto carrega a sessão ou redireciona uma rota protegida, não renderiza o conteúdo.
  if (loading && !isPublic(pathname)) return null;
  if (!allowed) return null;

  return <>{children}</>;
}
