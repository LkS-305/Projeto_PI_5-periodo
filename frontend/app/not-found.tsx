import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Página não encontrada. Volte para o painel ou para a página inicial.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir para início
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
          >
            Painel
          </Link>
        </div>
      </div>
    </main>
  );
}
