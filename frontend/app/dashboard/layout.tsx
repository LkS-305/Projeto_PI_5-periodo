"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/contexts/SessionContext";
import { useRouter } from "next/navigation";
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
      const id = window.setTimeout(() => {
        router.push("/login");
      }, 0);
      return () => window.clearTimeout(id);
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
