import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50/80 py-10 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">ServiçoHub</p>
          <p className="max-w-xl text-sm text-slate-600">
            Uma plataforma de serviços pensada para profissionais e clientes
            encontrarem trabalho e apoio com segurança.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/services" className="transition hover:text-slate-900">
            Serviços
          </Link>
          <Link href="/dashboard" className="transition hover:text-slate-900">
            Painel
          </Link>
          <Link href="/profile" className="transition hover:text-slate-900">
            Perfil
          </Link>
          <Link href="/login" className="transition hover:text-slate-900">
            Entrar
          </Link>
        </div>
      </div>
    </footer>
  );
}
