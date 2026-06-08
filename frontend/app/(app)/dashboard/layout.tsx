"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push(ROUTES.login);
    }
  }, [isAuthenticated, loading, mounted, router]);

  if (!mounted || loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
