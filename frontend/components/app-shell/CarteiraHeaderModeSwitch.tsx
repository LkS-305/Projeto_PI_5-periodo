"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import {
  resolveCarteiraPapelFromQuery,
  type CarteiraPapel,
} from "@/lib/carteiraPapel";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";

function mergeDashboardUrl(papel: CarteiraPapel, current: URLSearchParams): string {
  const p = new URLSearchParams(current.toString());
  p.set("papel", papel === "prestador" ? "prestador" : "cliente");
  const qs = p.toString();
  return qs ? `${ROUTES.dashboard}?${qs}` : `${ROUTES.dashboard}?papel=${papel}`;
}

/**
 * No `/dashboard`, replica o interruptor Contratante / Profissional do hub e sincroniza `?papel=`.
 */
export function CarteiraHeaderModeSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const homeHub = useHomeHub();

  const papelQuery = searchParams.get("papel");
  const hubTab = homeHub?.activeTab;

  const papel = useMemo(
    () => resolveCarteiraPapelFromQuery(papelQuery, hubTab),
    [papelQuery, hubTab],
  );

  const go = useCallback(
    async (next: CarteiraPapel) => {
      if (next === "prestador") {
        const uid = getCurrentUserId();
        if (uid) {
          try {
            await ClientGateway.getPrestador(uid);
          } catch {
            router.push(ROUTES.becomePrestador);
            return;
          }
        }
        homeHub?.setActiveTab("profissional");
      } else {
        homeHub?.setActiveTab("contratante");
      }
      router.replace(mergeDashboardUrl(next, searchParams), { scroll: false });
    },
    [homeHub, router, searchParams],
  );

  if (pathname !== ROUTES.dashboard) {
    return null;
  }

  return (
    <div className="home-mode-switch" role="group" aria-label="Modo da carteira">
      <div
        className={`home-mode-switch__pill ${
          papel === "prestador" ? "home-mode-switch__pill--right" : ""
        }`}
      />
      <button
        type="button"
        onClick={() => void go("cliente")}
        className={`home-mode-switch__button ${
          papel === "cliente" ? "home-mode-switch__button--active" : ""
        }`}
      >
        Contratante
      </button>
      <button
        type="button"
        onClick={() => void go("prestador")}
        className={`home-mode-switch__button ${
          papel === "prestador" ? "home-mode-switch__button--active" : ""
        }`}
      >
        Profissional
      </button>
    </div>
  );
}
