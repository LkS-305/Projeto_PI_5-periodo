// hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useSession } from "@/lib/contexts/SessionContext";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { UserGateway } from "@/lib/gateways/UserGateway"; // O seu Gateway aqui
import { LoginDto, RegisterDto } from "@/types/dtos/user";

export function useAuth() {
  const [isPending, setIsPending] = useState(false);
  const { saveSession, clearSession, user } = useSession();
  const { notify } = useNotification();

  const login = async (dados: LoginDto) => {
    setIsPending(true);
    try {
      // 1. CHAMA O GATEWAY (Lógica de rede pura)
      const response = await UserGateway.loginClient(dados);
      
      // 2. ATUALIZA O ESTADO GLOBAL (Contexto)
      saveSession(response.token, response.user);
      
      // 3. NOTIFICA O USUÁRIO (UI)
      notify("Bem-vindo de volta!", "success");
      return response.user;
    } catch (err: any) {
      notify(err.message || "Falha no login", "error");
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const register = async (dados: RegisterDto) => {
    setIsPending(true);
    try {
      // Chama o gateway para criar o usuário
      console.log('Estou no hook, chamando o gateway');
      const response = await UserGateway.registerClient(dados);
      notify("Conta criada com sucesso!", "success");
      return response;
    } catch (err: any) {
      notify(err.message || "Falha ao registrar", "error");
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const logout = () => {
    clearSession();
    notify("Você saiu do sistema", "info");
  };

  return { 
    login, 
    register, 
    logout, 
    isPending, 
    currentUser: user 
  };
}
