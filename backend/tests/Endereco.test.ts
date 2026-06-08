import { Endereco } from "../src/core/entities/Endereco";
import { IEnderecoRepository } from "../src/core/repositories/IEnderecoRepository";
import { IUserRepository } from "../src/core/repositories/IUserRepository";
import { User } from "../src/core/entities/User";
import {
  CriarEnderecoUseCase,
  DeletarEnderecoUseCase,
  AtualizarEnderecoUseCase,
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorCidade,
  SetarPrincipal,
  UnsetarPrincipal,
} from "../src/core/use-cases/endereco/EnderecoUseCase";
import { BuscarCepUseCase } from "../src/core/use-cases/endereco/BuscarCepUseCase";
import { CalcularDistanciaUseCase } from "../src/core/use-cases/endereco/CalcularDistanciaUseCase";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../src/core/errors/AppError";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const UUID_VALIDO = "123e4567-e89b-12d3-a456-426614174000";
const UUID_PRESTADOR = "223e4567-e89b-12d3-a456-426614174001";
const UUID_ENDERECO = "323e4567-e89b-12d3-a456-426614174002";

const DADOS_ENDERECO = {
  user_id: UUID_VALIDO,
  rotulo: "Casa",
  logradouro: "Avenida Paulista",
  numero: "1000",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
  cep: "01310100",
  is_principal: true,
};

const ENDERECO_MOCK = new Endereco(DADOS_ENDERECO, UUID_ENDERECO);
const USER_MOCK = new User({
  id: UUID_VALIDO,
  email: "u@t.com",
  senha: "hash",
  cpf: "12345678900",
});

// ─── Helpers de mock ─────────────────────────────────────────────────────────

function makeEnderecoRepo(
  overrides: Partial<Record<keyof IEnderecoRepository, jest.Mock>> = {},
): IEnderecoRepository {
  return {
    create: jest.fn().mockResolvedValue(ENDERECO_MOCK),
    update: jest.fn().mockResolvedValue(ENDERECO_MOCK),
    delete: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(null),
    findByUserId: jest.fn().mockResolvedValue(null),
    findByPrestadorId: jest.fn().mockResolvedValue(null),
    findByCity: jest.fn().mockResolvedValue(null),
    setIsPrincipal: jest.fn().mockResolvedValue(undefined),
    unsetIsPrincipal: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as IEnderecoRepository;
}

function makeUserRepo(
  overrides: Partial<Record<keyof IUserRepository, jest.Mock>> = {},
): IUserRepository {
  return {
    register: jest.fn(),
    login: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    updateRecoveryToken: jest.fn(),
    changePassword: jest.fn(),
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    ...overrides,
  } as unknown as IUserRepository;
}

// ─── BuscarCepUseCase ────────────────────────────────────────────────────────

describe("BuscarCepUseCase", () => {
  const VIACEP_RESPOSTA = {
    cep: "01310-100",
    logradouro: "Avenida Paulista",
    complemento: "",
    unidade: null,
    bairro: "Bela Vista",
    localidade: "São Paulo",
    uf: "SP",
    estado: "São Paulo",
    regiao: "Sudeste",
    ibge: "3550308",
    gia: "1004",
    ddd: "11",
    siafi: "7107",
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar os dados do endereço para um CEP válido", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(VIACEP_RESPOSTA),
    });
    const sut = new BuscarCepUseCase();

    const resultado = await sut.executar("01310100");

    expect(resultado).toMatchObject({
      logradouro: "Avenida Paulista",
      localidade: "São Paulo",
    });
  });

  it("deve aceitar CEP com máscara e sanitizar antes de consultar", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(VIACEP_RESPOSTA),
    });
    const sut = new BuscarCepUseCase();

    const resultado = await sut.executar("01310-100");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("01310100"),
    );
    expect(resultado).toMatchObject({ cep: "01310-100" });
  });

  it("deve lançar Error para CEP com menos de 8 dígitos", async () => {
    const sut = new BuscarCepUseCase();

    await expect(sut.executar("1234567")).rejects.toThrow("CEP inválido");
  });

  it("deve retornar string de erro quando CEP não é encontrado na API", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ erro: true }),
    });
    const sut = new BuscarCepUseCase();

    const resultado = await sut.executar("99999999");

    expect(resultado).toBe("CEP não encontrado");
  });

  it("deve retornar mensagem quando a API do ViaCEP está indisponível", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fetch failed"));
    const sut = new BuscarCepUseCase();

    const resultado = await sut.executar("01310100");

    expect(resultado).toBe("fetch failed");
  });
});

// ─── CriarEnderecoUseCase ─────────────────────────────────────────────────────

describe("CriarEnderecoUseCase", () => {
  it("deve criar o endereço quando todos os dados são válidos", async () => {
    const enderecoRepo = makeEnderecoRepo();
    const userRepo = makeUserRepo({
      findById: jest.fn().mockResolvedValue(USER_MOCK),
    });
    const sut = new CriarEnderecoUseCase(enderecoRepo, userRepo);

    const resultado = await sut.executar(DADOS_ENDERECO);

    expect(enderecoRepo.create).toHaveBeenCalled();
    expect(resultado).toBeInstanceOf(Endereco);
  });

  it("deve lançar ValidationError para UUID inválido", async () => {
    const sut = new CriarEnderecoUseCase(makeEnderecoRepo(), makeUserRepo());

    await expect(
      sut.executar({ ...DADOS_ENDERECO, user_id: "id-invalido" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ValidationError para CEP com dígitos insuficientes", async () => {
    const sut = new CriarEnderecoUseCase(makeEnderecoRepo(), makeUserRepo());

    await expect(
      sut.executar({ ...DADOS_ENDERECO, cep: "1234" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ValidationError para logradouro com menos de 3 caracteres", async () => {
    const sut = new CriarEnderecoUseCase(makeEnderecoRepo(), makeUserRepo());

    await expect(
      sut.executar({ ...DADOS_ENDERECO, logradouro: "Av" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ValidationError para cidade com menos de 2 caracteres", async () => {
    const sut = new CriarEnderecoUseCase(makeEnderecoRepo(), makeUserRepo());

    await expect(
      sut.executar({ ...DADOS_ENDERECO, cidade: "X" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ResourceNotFoundError quando o usuário não existe", async () => {
    const sut = new CriarEnderecoUseCase(makeEnderecoRepo(), makeUserRepo());

    await expect(sut.executar(DADOS_ENDERECO)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});

// ─── DeletarEnderecoUseCase ───────────────────────────────────────────────────

describe("DeletarEnderecoUseCase", () => {
  it("deve deletar o endereço quando o ID é válido", async () => {
    const enderecoRepo = makeEnderecoRepo();
    const sut = new DeletarEnderecoUseCase(enderecoRepo);

    await sut.executar(UUID_ENDERECO);

    expect(enderecoRepo.delete).toHaveBeenCalledWith(UUID_ENDERECO);
  });

  it("deve lançar ValidationError para UUID inválido", async () => {
    const sut = new DeletarEnderecoUseCase(makeEnderecoRepo());

    await expect(sut.executar("invalido")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});

// ─── AtualizarEnderecoUseCase ─────────────────────────────────────────────────

describe("AtualizarEnderecoUseCase", () => {
  it("deve atualizar o endereço quando encontrado", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findById: jest.fn().mockResolvedValue(ENDERECO_MOCK),
    });
    const sut = new AtualizarEnderecoUseCase(enderecoRepo);

    const resultado = await sut.executar({
      id: UUID_ENDERECO,
      cidade: "Campinas",
      is_principal: false,
    });

    expect(enderecoRepo.update).toHaveBeenCalled();
    expect(resultado).toBeInstanceOf(Endereco);
  });

  it("deve lançar ResourceNotFoundError quando o endereço não existe", async () => {
    const sut = new AtualizarEnderecoUseCase(makeEnderecoRepo());

    await expect(
      sut.executar({
        id: UUID_ENDERECO,
        cidade: "Campinas",
        is_principal: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("deve lançar ValidationError para UUID inválido", async () => {
    const sut = new AtualizarEnderecoUseCase(makeEnderecoRepo());

    await expect(
      sut.executar({ id: "invalido", is_principal: false }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ValidationError para CEP inválido na atualização", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findById: jest.fn().mockResolvedValue(ENDERECO_MOCK),
    });
    const sut = new AtualizarEnderecoUseCase(enderecoRepo);

    await expect(
      sut.executar({ id: UUID_ENDERECO, cep: "123", is_principal: false }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

// ─── AcharPorUserId ───────────────────────────────────────────────────────────

describe("AcharPorUserId", () => {
  it("deve retornar o endereço do usuário quando encontrado", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findByUserId: jest.fn().mockResolvedValue(ENDERECO_MOCK),
    });
    const sut = new AcharPorUserId(enderecoRepo);

    const resultado = await sut.executar(UUID_VALIDO);

    expect(resultado).toBeInstanceOf(Endereco);
  });

  it("deve lançar ResourceNotFoundError quando não existe endereço para o usuário", async () => {
    const sut = new AcharPorUserId(makeEnderecoRepo());

    await expect(sut.executar(UUID_VALIDO)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it("deve lançar ValidationError para UUID inválido", async () => {
    const sut = new AcharPorUserId(makeEnderecoRepo());

    await expect(sut.executar("invalido")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});

// ─── AcharPorPrestadorId ──────────────────────────────────────────────────────

describe("AcharPorPrestadorId", () => {
  it("deve retornar o endereço do prestador quando encontrado", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findByPrestadorId: jest.fn().mockResolvedValue(ENDERECO_MOCK),
    });
    const sut = new AcharPorPrestadorId(enderecoRepo);

    const resultado = await sut.executar(UUID_PRESTADOR);

    expect(resultado).toBeInstanceOf(Endereco);
  });

  it("deve lançar ResourceNotFoundError quando não existe endereço para o prestador", async () => {
    const sut = new AcharPorPrestadorId(makeEnderecoRepo());

    await expect(sut.executar(UUID_PRESTADOR)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});

// ─── AcharPorCidade ───────────────────────────────────────────────────────────

describe("AcharPorCidade", () => {
  it("deve retornar endereços de uma cidade", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findByCity: jest.fn().mockResolvedValue([ENDERECO_MOCK]),
    });
    const sut = new AcharPorCidade(enderecoRepo);

    const resultado = await sut.executar("São Paulo");

    expect(resultado).toHaveLength(1);
  });

  it("deve lançar ValidationError para cidade com menos de 2 caracteres", async () => {
    const sut = new AcharPorCidade(makeEnderecoRepo());

    await expect(sut.executar("X")).rejects.toBeInstanceOf(ValidationError);
  });
});

// ─── SetarPrincipal / UnsetarPrincipal ────────────────────────────────────────

describe("SetarPrincipal", () => {
  it("deve marcar o endereço como principal", async () => {
    const enderecoRepo = makeEnderecoRepo();
    const sut = new SetarPrincipal(enderecoRepo);

    await sut.executar(UUID_ENDERECO);

    expect(enderecoRepo.setIsPrincipal).toHaveBeenCalledWith(UUID_ENDERECO);
  });

  it("deve lançar ValidationError para UUID inválido", async () => {
    const sut = new SetarPrincipal(makeEnderecoRepo());

    await expect(sut.executar("invalido")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});

describe("UnsetarPrincipal", () => {
  it("deve desmarcar o endereço como principal", async () => {
    const enderecoRepo = makeEnderecoRepo();
    const sut = new UnsetarPrincipal(enderecoRepo);

    await sut.executar(UUID_ENDERECO);

    expect(enderecoRepo.unsetIsPrincipal).toHaveBeenCalledWith(UUID_ENDERECO);
  });
});

// ─── CalcularDistanciaUseCase ─────────────────────────────────────────────────

describe("CalcularDistanciaUseCase", () => {
  const END_USUARIO = new Endereco(
    { ...DADOS_ENDERECO, cep: "01310100" },
    UUID_ENDERECO,
  );
  const END_PRESTADOR = new Endereco(
    { ...DADOS_ENDERECO, user_id: UUID_PRESTADOR, cep: "20040020" },
    UUID_PRESTADOR,
  );

  const VIACEP_SP = {
    logradouro: "Av Paulista",
    bairro: "Bela Vista",
    localidade: "São Paulo",
    uf: "SP",
  };
  const VIACEP_RJ = {
    logradouro: "Av Rio Branco",
    bairro: "Centro",
    localidade: "Rio de Janeiro",
    uf: "RJ",
  };
  const COORDS_SP = [{ lat: "-23.5629", lon: "-46.6544" }];
  const COORDS_RJ = [{ lat: "-22.9068", lon: "-43.1729" }];

  // Mocka fetch por conteúdo de URL — necessário porque geocodificarCep é chamado
  // em Promise.all (paralelo), então a ordem das chamadas não é determinística.
  function mockFetchPorUrl({
    viacepUser = VIACEP_SP,
    viacepPrestador = VIACEP_RJ,
    nominatimFull = (url: string) =>
      url.includes("Paulista") || url.includes("Branco") ? [] : [],
    nominatimFallback = COORDS_SP,
    coordsUser = COORDS_SP,
    coordsPrestador = COORDS_RJ,
  }: {
    viacepUser?: object;
    viacepPrestador?: object;
    nominatimFull?: (url: string) => object[];
    nominatimFallback?: object[];
    coordsUser?: object[];
    coordsPrestador?: object[];
  } = {}) {
    (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
      if (url.includes("viacep.com.br/ws/01310100"))
        return { ok: true, json: async () => viacepUser };
      if (url.includes("viacep.com.br/ws/20040020"))
        return { ok: true, json: async () => viacepPrestador };
      if (url.includes("nominatim")) {
        // Heurística: se a URL contém o logradouro, é a query completa; senão é a query por cidade
        if (url.includes("Paulista") || url.includes("Bela"))
          return { ok: true, json: async () => coordsUser };
        if (url.includes("Branco") || url.includes("Centro"))
          return { ok: true, json: async () => coordsPrestador };
        return { ok: true, json: async () => nominatimFallback };
      }
      return { ok: true, json: async () => [] };
    });
  }

  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve calcular a distância em km entre dois endereços", async () => {
    mockFetchPorUrl();
    const enderecoRepo = makeEnderecoRepo({
      findByUserId: jest.fn().mockResolvedValue(END_USUARIO),
      findByPrestadorId: jest.fn().mockResolvedValue(END_PRESTADOR),
    });
    const sut = new CalcularDistanciaUseCase(enderecoRepo);

    const resultado = await sut.executar(UUID_VALIDO, UUID_PRESTADOR);

    expect(resultado).toHaveProperty("distancia_km");
    expect(typeof resultado.distancia_km).toBe("number");
    expect(resultado.distancia_km).toBeGreaterThan(0);
  });

  it("deve lançar ValidationError para UUID de usuário inválido", async () => {
    const sut = new CalcularDistanciaUseCase(makeEnderecoRepo());

    await expect(
      sut.executar("invalido", UUID_PRESTADOR),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ValidationError para UUID de prestador inválido", async () => {
    const sut = new CalcularDistanciaUseCase(makeEnderecoRepo());

    await expect(sut.executar(UUID_VALIDO, "invalido")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("deve lançar ResourceNotFoundError quando endereço do usuário não existe", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findByUserId: jest.fn().mockResolvedValue(null),
    });
    const sut = new CalcularDistanciaUseCase(enderecoRepo);

    await expect(
      sut.executar(UUID_VALIDO, UUID_PRESTADOR),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("deve lançar ResourceNotFoundError quando endereço do prestador não existe", async () => {
    const enderecoRepo = makeEnderecoRepo({
      findByUserId: jest.fn().mockResolvedValue(END_USUARIO),
      findByPrestadorId: jest.fn().mockResolvedValue(null),
    });
    const sut = new CalcularDistanciaUseCase(enderecoRepo);

    await expect(
      sut.executar(UUID_VALIDO, UUID_PRESTADOR),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("deve lançar ValidationError quando o ViaCEP retorna erro para ambos os CEPs", async () => {
    (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
      if (url.includes("viacep.com.br"))
        return { ok: true, json: async () => ({ erro: true }) };
      return { ok: true, json: async () => [] };
    });
    const enderecoRepo = makeEnderecoRepo({
      findByUserId: jest.fn().mockResolvedValue(END_USUARIO),
      findByPrestadorId: jest.fn().mockResolvedValue(END_PRESTADOR),
    });
    const sut = new CalcularDistanciaUseCase(enderecoRepo);

    await expect(
      sut.executar(UUID_VALIDO, UUID_PRESTADOR),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve usar fallback por cidade quando Nominatim não encontra o endereço completo", async () => {
    // Nominatim retorna array vazio na query completa → usa fallback por cidade
    mockFetchPorUrl({ coordsUser: [], coordsPrestador: [] });
    (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
      if (url.includes("viacep.com.br/ws/01310100"))
        return { ok: true, json: async () => VIACEP_SP };
      if (url.includes("viacep.com.br/ws/20040020"))
        return { ok: true, json: async () => VIACEP_RJ };
      // Nominatim: query completa (tem logradouro) → vazio; query cidade (só localidade) → coords
      if (url.includes("Paulista") || url.includes("Branco"))
        return { ok: true, json: async () => [] };
      if (url.includes("nominatim"))
        return { ok: true, json: async () => COORDS_SP };
      return { ok: true, json: async () => [] };
    });
    const enderecoRepo = makeEnderecoRepo({
      findByUserId: jest.fn().mockResolvedValue(END_USUARIO),
      findByPrestadorId: jest.fn().mockResolvedValue(END_PRESTADOR),
    });
    const sut = new CalcularDistanciaUseCase(enderecoRepo);

    const resultado = await sut.executar(UUID_VALIDO, UUID_PRESTADOR);

    expect(resultado.distancia_km).toBeGreaterThanOrEqual(0);
  });
});
