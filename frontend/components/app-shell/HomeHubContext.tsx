"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { ROUTES } from "@/lib/routes";

type HubTab = "contratante" | "profissional";

type HomeHubContextValue = {
  activeTab: HubTab;
  tabVisible: boolean;
  setActiveTab: (t: HubTab) => void;
  handleTabChange: (tab: HubTab) => Promise<void>;
};

const HomeHubContext = createContext<HomeHubContextValue | null>(null);

export function HomeHubProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeTab, setActiveTabState] = useState<HubTab>("contratante");
  const [tabVisible, setTabVisible] = useState(true);

  const handleTabChange = useCallback(
    async (tab: HubTab) => {
      if (tab === activeTab) return;

      if (tab === "profissional") {
        const userId = getCurrentUserId();
        if (userId) {
          try {
            await ClientGateway.getPrestador(userId);
          } catch {
            router.push(ROUTES.becomePrestador);
            return;
          }
        }
      }

      setTabVisible(false);
      setTimeout(() => {
        setActiveTabState(tab);
        setTabVisible(true);
      }, 300);
    },
    [activeTab, router],
  );

  const value = useMemo(
    () => ({
      activeTab,
      tabVisible,
      setActiveTab: setActiveTabState,
      handleTabChange,
    }),
    [activeTab, tabVisible, handleTabChange],
  );

  return (
    <HomeHubContext.Provider value={value}>{children}</HomeHubContext.Provider>
  );
}

export function useHomeHub(): HomeHubContextValue | null {
  return useContext(HomeHubContext);
}
