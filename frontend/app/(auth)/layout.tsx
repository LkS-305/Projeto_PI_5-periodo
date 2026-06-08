"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/SessionContext";
import { ROUTES } from "@/lib/routes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.hub);
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
