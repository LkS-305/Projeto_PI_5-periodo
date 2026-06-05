"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/SessionContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = window.setTimeout(() => {
      router.push("/home");
    }, 0);
    return () => window.clearTimeout(id);
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
