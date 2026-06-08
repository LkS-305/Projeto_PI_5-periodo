"use client";

import { useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { useUsuario } from "@/utils/hooks/useUsuario"; // Ajuste o path conforme seu projeto
import { usePrestador } from "@/utils/hooks/usePrestador"; // Ajuste o path conforme seu projeto

export default function AuthTestPage() {
  const { login, register, logout, isPending, currentUser } = useAuth();
  const usuarioHook = useUsuario();
  const prestadorHook = usePrestador();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpf: "",
    nome: "", // Novo campo para testes de entidade
    bio: "",
  });

  const [lastResponse, setLastResponse] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Laboratório de Autenticação & Entidades</h1>
      <p className="text-gray-500 mb-8">Fluxo: Auth → Usuario/Prestador → Postgres</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: AUTH & INPUTS */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-lg mb-4 border-b pb-2">1. Credenciais</h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Nome (Para Criar Perfil)</label>
              <input name="nome" className="w-full p-2 border rounded mt-1" onChange={handleInputChange} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Cpf</label>
              <input name="cpf" className="w-full p-2 border rounded mt-1" onChange={handleInputChange} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">E-mail</label>
              <input name="email" className="w-full p-2 border rounded mt-1" onChange={handleInputChange} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Senha</label>
              <input name="password" type="password" className="w-full p-2 border rounded mt-1" onChange={handleInputChange} />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button 
              onClick={async () => {
                const res = await login({ email: formData.email, senha: formData.password });
                setLastResponse(res);
              }}
              className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
              disabled={isPending}
            >
              Executar Login
            </button>
            <button 
              onClick={async () => {
                const res = await register({ email: formData.email, senha: formData.password, cpf: formData.cpf });
                setLastResponse(res);
              }}
              className="bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700"
            >
              Executar Registro
            </button>
          </div>
        </div>

        {/* COLUNA 2: TESTES DE ENTIDADES (USUÁRIO / PRESTADOR) */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-lg mb-4 border-b pb-2">2. Operações de Perfil</h2>
          
          {!currentUser ? (
            <p className="text-amber-600 text-sm italic">Faça login para habilitar testes de entidade.</p>
          ) : (
            <div className="space-y-6">
              {/* TESTES USUÁRIO */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-gray-500 uppercase">Domínio: Usuário</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={async () => {
                      const res = await usuarioHook.create({ user_id: currentUser.id, nome: formData.nome });
                      setLastResponse(res);
                    }}
                    className="text-xs bg-white border border-gray-300 p-2 rounded hover:bg-gray-100"
                  >
                    Criar Perfil Usuário
                  </button>
                  <button 
                    onClick={async () => {
                      const res = await usuarioHook.fetchByUserId(currentUser.id);
                      setLastResponse(res);
                    }}
                    className="text-xs bg-white border border-gray-300 p-2 rounded hover:bg-gray-100"
                  >
                    Buscar Meu Usuário
                  </button>
                </div>
              </div>

              {/* TESTES PRESTADOR */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-gray-500 uppercase">Domínio: Prestador</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={async () => {
                      const res = await prestadorHook.create({ user_id: currentUser.id, nome: formData.nome, bio: formData.bio });
                      setLastResponse(res);
                    }}
                    className="text-xs bg-white border border-gray-300 p-2 rounded hover:bg-gray-100"
                  >
                    Criar Perfil Prestador
                  </button>
                  <button 
                    onClick={async () => {
                      const res = await prestadorHook.fetchByUserId(currentUser.id);
                      setLastResponse(res);
                    }}
                    className="text-xs bg-white border border-gray-300 p-2 rounded hover:bg-gray-100"
                  >
                    Buscar Meu Prestador
                  </button>
                </div>
              </div>

              <button 
                onClick={logout}
                className="w-full border-2 border-red-500 text-red-500 p-2 rounded-lg font-bold text-sm mt-4"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* COLUNA 3: STATUS & CONSOLE */}
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border-2 ${currentUser ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <h2 className="font-bold mb-2">Sessão Atual:</h2>
            {currentUser ? (
              <div className="text-sm">
                <p><strong>ID:</strong> {currentUser.id}</p>
                <p><strong>CPF:</strong> {currentUser.cpf}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-200 text-green-800 text-[10px] rounded-full font-bold">LOGADO</span>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Offline</p>
            )}
          </div>

          <div className="bg-black text-green-400 p-6 rounded-xl font-mono text-[10px] overflow-auto shadow-2xl min-h-[300px]">
            <h2 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">JSON Debugger:</h2>
            {(usuarioHook.loading || prestadorHook.loading) && <p className="animate-pulse text-white">// Carregando dados do banco...</p>}
            {(usuarioHook.error || prestadorHook.error) && <p className="text-red-500">// Erro: {usuarioHook.error || prestadorHook.error}</p>}
            {lastResponse ? (
              <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
            ) : (
              <p className="opacity-50">// Sem dados para exibir.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
