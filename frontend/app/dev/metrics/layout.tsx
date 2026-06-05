import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Métricas da API | DOMI",
  description: "Painel de contadores HTTP do backend (desenvolvimento).",
};

export default function DevMetricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
