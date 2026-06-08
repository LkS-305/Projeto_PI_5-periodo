"use client";

import { Suspense, useState } from "react";
import { AppHeader } from "@/components/app-shell/AppHeader";
import { AppSlideMenu } from "@/components/app-shell/AppSlideMenu";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell-root">
      <Suspense
        fallback={
          <AppHeader
            menuOpen={menuOpen}
            onOpenMenu={() => setMenuOpen(true)}
            carteiraSwitchFallback
          />
        }
      >
        <AppHeader
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
        />
      </Suspense>
      <AppSlideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
