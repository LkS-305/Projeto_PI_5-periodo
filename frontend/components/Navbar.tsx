"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialized } = useSession();

  return (
    <header className="border-b border-slate-200/75 backdrop-blur-xl bg-white/90 sticky top-0 z-40 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            ServiçoHub
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/services" className="transition hover:text-slate-900">
              Serviços
            </Link>
            <Link href="/dashboard" className="transition hover:text-slate-900">
              Painel
            </Link>
            <Link href="/profile" className="transition hover:text-slate-900">
              Perfil
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!initialized ? null : isAuthenticated ? (
            <>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                {user?.nome || "Usuário"}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Cadastro
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
