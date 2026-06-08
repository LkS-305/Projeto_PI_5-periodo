"use client";

import { HomeHubProvider } from "@/components/app-shell/HomeHubContext";
import { AppShell } from "@/components/app-shell/AppShell";

export default function AppGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HomeHubProvider>
      <AppShell>{children}</AppShell>
    </HomeHubProvider>
  );
}
