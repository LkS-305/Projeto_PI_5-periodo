"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
