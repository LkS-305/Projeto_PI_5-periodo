"use client";

import { useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";

export default function AuthTestPage() {
  // Pegamos as funções e o estado do novo hook organizado
  const { login, register, logout, isPending, currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpf: "",
  });

  const [lastResponse, setLastResponse] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Laboratório de Autenticação</h1>
      <p className="text-gray-500 mb-8">Teste o fluxo completo: Hook → Gateway → API → Postgres</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COLUNA 1: FORMULÁRIO */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-lg mb-4">Dados de Entrada</h2>
          
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Cpf (Registro)</label>
            <input
              name="cpf"
              className="w-full p-2 border rounded mt-1 shadow-sm"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">E-mail</label>
            <input
              name="email"
              className="w-full p-2 border rounded mt-1 shadow-sm"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Senha</label>
            <input
              name="password"
              type="password"
              className="w-full p-2 border rounded mt-1 shadow-sm"
              onChange={handleInputChange}
            />
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button 
              onClick={async () => {
                const res = await login({ email: formData.email, senha: formData.password });
                setLastResponse(res);
              }}
              disabled={isPending}
              className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {isPending ? "Processando..." : "Executar Login"}
            </button>

            <button 
              onClick={async () => {
                const res = await register({ email: formData.email, senha: formData.password, cpf: formData.cpf });
                setLastResponse(res);
              }}
              disabled={isPending}
              className="bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              Executar Registro
            </button>

            <button 
              onClick={logout}
              className="border-2 border-red-500 text-red-500 p-3 rounded-lg font-bold hover:bg-red-50"
            >
              Logout (Limpar Sessão)
            </button>
          </div>
        </div>

        {/* COLUNA 2: ESTADO ATUAL E CONSOLE */}
        <div className="space-y-6">
          {/* ESTADO DO USUÁRIO NO CONTEXTO */}
          <div className={`p-6 rounded-xl border-2 ${currentUser ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <h2 className="font-bold mb-2">Usuário Logado no Contexto:</h2>
            {currentUser ? (
              <div className="text-sm">
                <p><strong>Cpf:</strong> {currentUser.cpf}</p>
                <p><strong>ID:</strong> {currentUser.id}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-bold">AUTENTICADO</span>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Nenhum usuário na sessão local.</p>
            )}
          </div>

          {/* ÚLTIMA RESPOSTA DA API */}
          <div className="bg-black text-green-400 p-6 rounded-xl font-mono text-xs overflow-auto shadow-2xl min-h-[200px]">
            <h2 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Console Output (JSON):</h2>
            {lastResponse ? (
              <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
            ) : (
              <p className="opacity-50">// Aguardando chamada...</p>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-gray-400 text-sm">
        💡 Verifique o terminal do Backend para ver os logs do Postgres.
      </p>
    </div>
  );
}
