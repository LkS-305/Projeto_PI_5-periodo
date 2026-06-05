import { describe, test, beforeAll, afterAll, expect } from "@jest/globals";
import {
  loginUser,
  signUpUser,
  fetchUserById,
  updateUser,
  deleteUser,
} from "../lib/use-cases/auth";
import {
  createPrestador,
  getPrestadorById,
  getPrestadorByUserId,
} from "../lib/use-cases/prestador";
import { Usuario, Prestador, SignUpRequest, LoginRequest } from "../lib/types";

declare global {
  var localStorage: Storage;
  var window: any;
}

describe("API Integration Tests", () => {
  let mockUser: Usuario | null = null;
  let mockPrestador: Prestador | null = null;
  const uniqueEmail = `test${Date.now()}@example.com`;

  beforeAll(async () => {
    if (typeof global.window === "undefined") {
      (global as any).window = global;
    }

    if (typeof global.localStorage === "undefined") {
      const store: Record<string, string> = {};
      (global as any).localStorage = {
        getItem(key: string) {
          return store[key] ?? null;
        },
        setItem(key: string, value: string) {
          store[key] = value;
        },
        removeItem(key: string) {
          delete store[key];
        },
        clear() {
          Object.keys(store).forEach((key) => delete store[key]);
        },
      } as Storage;
    }

    const signUpData: SignUpRequest = {
      nome: "Test User",
      email: uniqueEmail,
      password: "password123",
      cpf: "00000000000",
      telefone: "123456789",
    };
    mockUser = await signUpUser(signUpData);

    const loginData: LoginRequest = {
      email: uniqueEmail,
      password: "password123",
    };
    const loginResponse = await loginUser(loginData);

    global.localStorage.setItem("authToken", loginResponse.token);
  });

  afterAll(async () => {
    if (mockUser?.id) {
      await deleteUser(mockUser.id);
    }
  });

  describe("Authentication", () => {
    test("should sign up user", () => {
      expect(mockUser).toBeDefined();
      expect(mockUser.email).toBe(uniqueEmail);
      expect(mockUser.nome).toBe("Test User");
      expect(mockUser.tipo_usuario).toBeDefined();
    });

    test("should login user", async () => {
      const loginData: LoginRequest = {
        email: uniqueEmail,
        password: "password123",
      };
      const response = await loginUser(loginData);
      expect(response.token).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe(uniqueEmail);
    });
  });

  describe("User Management", () => {
    test("should fetch user by ID", async () => {
      const user = await fetchUserById(mockUser.id!);
      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(uniqueEmail);
    });

    test("should update user", async () => {
      const updateData = { nome: "Updated Test User" };
      const updatedUser = await updateUser(mockUser.id!, updateData);
      expect(updatedUser.nome).toBe("Updated Test User");
      expect(updatedUser.id).toBe(mockUser.id);
    });
  });

  describe("Provider Management", () => {
    test("should create provider", async () => {
      const prestadorData = { user_id: mockUser.id! };
      mockPrestador = await createPrestador(prestadorData);
      expect(mockPrestador).toBeDefined();
      expect(mockPrestador.user_id).toBe(mockUser.id);
      expect(mockPrestador.tipo_usuario).toBe("prestador");
    });

    test("should get provider by ID", async () => {
      const prestador = await getPrestadorById(mockPrestador.id!);
      expect(prestador.id).toBe(mockPrestador.id);
      expect(prestador.user_id).toBe(mockUser.id);
    });

    test("should get provider by user ID", async () => {
      const prestador = await getPrestadorByUserId(mockUser.id!);
      expect(prestador.user_id).toBe(mockUser.id);
      expect(prestador.tipo_usuario).toBe("prestador");
    });
  });
});
