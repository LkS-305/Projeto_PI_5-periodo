"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Alias comum: `/setting` → `/settings`. */
export default function SettingAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTES.settings);
  }, [router]);
  return (
    <p style={{ padding: 24, color: "#666" }} role="status">
      A abrir definições…
    </p>
  );
}
