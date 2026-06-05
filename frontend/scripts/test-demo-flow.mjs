/**
 * Teste de integração do fluxo demo DOMI contra a API Express.
 *
 * Pré-requisitos:
 *   - Backend rodando (ex.: http://localhost:3002)
 *   - Banco populado com usuários de demo (populate.sql):
 *       Cliente: joao@email.com / senha123 (u1)
 *       Prestador: pedro.encanador@email.com / senha123 (u3)
 *
 * Uso:
 *   cd frontend
 *   npm run test:api-flow
 *
 * Variáveis opcionais:
 *   API_URL=http://localhost:3002
 *   DEMO_CLIENT_EMAIL=joao@email.com
 *   DEMO_CLIENT_PASSWORD=senha123
 *   DEMO_PRESTADOR_EMAIL=pedro.encanador@email.com
 *   DEMO_PRESTADOR_PASSWORD=senha123
 *   PRESTADOR_ID=u3
 *   CATEGORIA_ID=cat3   (Encanador — alinhado ao Pedro no seed)
 */

const BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002").replace(/\/$/, "");

const CLIENT_EMAIL = process.env.DEMO_CLIENT_EMAIL || "joao@email.com";
const CLIENT_PASSWORD = process.env.DEMO_CLIENT_PASSWORD || "senha123";
const PRESTADOR_EMAIL = process.env.DEMO_PRESTADOR_EMAIL || "pedro.encanador@email.com";
const PRESTADOR_PASSWORD = process.env.DEMO_PRESTADOR_PASSWORD || "senha123";
const PRESTADOR_ID = process.env.PRESTADOR_ID || "u3";
const CATEGORIA_ID = process.env.CATEGORIA_ID || "cat3";

let passed = 0;
let failed = 0;
const warnings = [];

function assertOk(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  [OK] ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed++;
    console.error(`  [FALHA] ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function request(method, path, { token, body, query } = {}) {
  const url = new URL(path.startsWith("http") ? path : `${BASE}${path}`);
  if (query && typeof query === "object") {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { ok: res.ok, status: res.status, data };
}

async function login(email, password) {
  const { ok, status, data } = await request("POST", "/user/login", {
    body: { email, senha: password },
  });
  if (!ok) {
    throw new Error(`Login ${email}: HTTP ${status} — ${JSON.stringify(data)}`);
  }
  const token = data?.token;
  const user = data?.user;
  if (!token || !user?.id) {
    throw new Error(`Login ${email}: resposta sem token ou user.id`);
  }
  return { token, user };
}

function futureIso(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

async function main() {
  console.log(`\n=== Teste fluxo DOMI ===`);
  console.log(`API: ${BASE}\n`);

  let tokenCliente;
  let tokenPrestador;
  let userCliente;
  let userPrestador;
  let servicoId;

  // 1) Health
  try {
    const { ok, status, data } = await request("GET", "/health");
    assertOk("GET /health", ok && status === 200 && data?.status === "online", `db=${data?.db_connection}`);
  } catch (e) {
    console.error(`  [FALHA] GET /health — ${e.cause?.code || e.message}`);
    console.error(`
  Não foi possível conectar em ${BASE}.
  Inicie o backend: cd backend && npm run dev
  Ou defina API_URL / NEXT_PUBLIC_API_URL apontando para a API.
`);
    process.exit(1);
  }

  // 2) Explore
  {
    const { ok, status, data } = await request("GET", "/explore");
    const hasCats = Array.isArray(data) && data.length > 0;
    assertOk("GET /explore", ok && hasCats, hasCats ? `${data.length} categorias` : `HTTP ${status}`);
  }

  // 3) Categorias (público)
  {
    const { ok, status, data } = await request("GET", "/categoria/buscarCategorias");
    const list = Array.isArray(data) ? data : [];
    assertOk("GET /categoria/buscarCategorias", ok && list.length > 0, `${list.length} itens`);
  }

  // 4–5) Logins
  try {
    const c = await login(CLIENT_EMAIL, CLIENT_PASSWORD);
    tokenCliente = c.token;
    userCliente = c.user;
    assertOk("POST /user/login (cliente)", !!tokenCliente, userCliente.id);
  } catch (e) {
    failed++;
    console.error(`  [FALHA] POST /user/login (cliente) — ${e.message}`);
    console.error("\nAbortando: configure credenciais e seed (populate.sql com bcrypt senha123).\n");
    process.exit(1);
  }

  try {
    const p = await login(PRESTADOR_EMAIL, PRESTADOR_PASSWORD);
    tokenPrestador = p.token;
    userPrestador = p.user;
    assertOk("POST /user/login (prestador)", !!tokenPrestador, userPrestador.id);
  } catch (e) {
    failed++;
    console.error(`  [FALHA] POST /user/login (prestador) — ${e.message}`);
    process.exit(1);
  }

  // 6) Prestador por user id (autenticado)
  {
    const { ok, status, data } = await request("POST", "/prestador/buscarPorUserId", {
      token: tokenPrestador,
      body: { user_id: PRESTADOR_ID },
    });
    assertOk(
      "POST /prestador/buscarPorUserId",
      ok && data?.user_id === PRESTADOR_ID,
      data?.nome || `HTTP ${status}`,
    );
  }

  // 6b) Vitrine pública (sem token)
  {
    const { ok, status, data } = await request(
      "GET",
      `/prestador/vitrina/${encodeURIComponent(PRESTADOR_ID)}`,
    );
    assertOk(
      "GET /prestador/vitrina/:user_id",
      ok && data?.user_id === PRESTADOR_ID,
      data?.nome || `HTTP ${status}`,
    );
  }

  // 7) Portfolio
  {
    const { ok, status, data } = await request("GET", "/portfolio", {
      query: { prestador_id: PRESTADOR_ID },
    });
    const n = Array.isArray(data) ? data.length : 0;
    assertOk("GET /portfolio", ok, `${n} itens (pode ser 0)`);
  }

  // 8) Criar serviço (abertura leve)
  {
    const titulo = `E2E fluxo ${Date.now()}`;
    const { ok, status, data } = await request("POST", "/servico/criarServico", {
      body: {
        user_id: userCliente.id,
        prestador_id: PRESTADOR_ID,
        categoria_id: CATEGORIA_ID,
        titulo,
        descricao: "Prioridade: media",
        prioridade: "media",
      },
    });
    servicoId = data?.id;
    assertOk("POST /servico/criarServico", ok && !!servicoId, servicoId || JSON.stringify(data));
    if (!servicoId) {
      console.error("\nAbortando: não foi possível criar serviço.\n");
      process.exit(1);
    }
  }

  // 9) Buscar por id
  {
    const { ok, data } = await request("GET", "/servico/buscarPorId", {
      query: { id: servicoId },
    });
    assertOk("GET /servico/buscarPorId", ok && data?.id === servicoId, data?.titulo?.slice(0, 40));
  }

  // 10–11) Listagens
  {
    const { ok, data } = await request("GET", "/servico/buscarPorUserId", {
      query: { id: userCliente.id },
    });
    const arr = Array.isArray(data) ? data : [];
    assertOk(
      "GET /servico/buscarPorUserId",
      ok && arr.some((s) => s.id === servicoId),
      `${arr.length} serviços`,
    );
  }
  {
    const { ok, data } = await request("GET", "/servico/buscarPorPrestadorId", {
      query: { id: PRESTADOR_ID },
    });
    const arr = Array.isArray(data) ? data : [];
    assertOk(
      "GET /servico/buscarPorPrestadorId",
      ok && arr.some((s) => s.id === servicoId),
      `${arr.length} serviços`,
    );
  }

  // 12) Stats
  {
    const { ok, data } = await request("GET", "/servico/stats");
    assertOk("GET /servico/stats", ok && data && typeof data.ativos === "number", `ativos=${data?.ativos}`);
  }

  // 13–14) Proposta (prestador): atualizar dados + status pendente
  {
    const { ok, data } = await request("PATCH", "/servico/atualizarServico", {
      body: {
        id: servicoId,
        preco_acordado: 150.5,
        data_inicio: futureIso(7),
        duracao: "2h",
        categoria: "Encanador",
      },
    });
    assertOk("PATCH /servico/atualizarServico (proposta)", ok, data?.erro || "ok");
  }
  {
    const { ok, data } = await request("PATCH", "/servico/atualizarStatus", {
      body: { id: servicoId, status: "pendente" },
    });
    assertOk("PATCH /servico/atualizarStatus → pendente", ok, data?.erro || "ok");
  }

  // 15) Cliente aceita
  {
    const { ok, data } = await request("PATCH", "/servico/atualizarStatus", {
      body: { id: servicoId, status: "aceito" },
    });
    assertOk("PATCH /servico/atualizarStatus → aceito", ok, data?.erro || "ok");
  }

  // 16) Transação por serviço (ainda pode não existir)
  {
    const { ok, status, data } = await request("GET", "/transacao/porServico", {
      query: { id: servicoId },
    });
    assertOk(
      "GET /transacao/porServico",
      ok || status === 400,
      ok ? `transacao ${data?.id || "?"}` : "sem transação (esperado antes do Pix)",
    );
  }

  // 17) Iniciar Pix (opcional — depende de ASAAS_API_KEY no backend)
  {
    const { ok, status, data } = await request("POST", "/transacao/iniciar", {
      token: tokenCliente,
      body: {
        servico_id: servicoId,
        user_id: userCliente.id,
        cpf: "11111111111",
        nome: "João Demo",
        email: CLIENT_EMAIL,
        valor: "150.50",
        metodo_pagamento: "Pix",
      },
    });
    if (ok && data?.pix) {
      assertOk("POST /transacao/iniciar (Pix)", true, "QR/cobrança retornados");
    } else {
      warnings.push(
        `POST /transacao/iniciar: HTTP ${status} — ${typeof data === "object" ? data?.erro || JSON.stringify(data) : data} (configure ASAAS_API_KEY no backend para testar Pix real)`,
      );
      console.log(`  [AVISO] POST /transacao/iniciar — ignorado (${status})`);
    }
  }

  // 18) Simular confirmação de pagamento (como no botão demo do frontend)
  {
    const { ok, data } = await request("PATCH", "/servico/atualizarStatus", {
      body: { id: servicoId, status: "emAndamento" },
    });
    assertOk("PATCH /servico/atualizarStatus → emAndamento", ok, data?.erro || "ok");
  }

  // 19–21) Mensagens
  {
    const { ok, data } = await request("GET", `/mensagem/servico/${servicoId}`, {
      token: tokenCliente,
    });
    const n = Array.isArray(data) ? data.length : 0;
    assertOk("GET /mensagem/servico/:id", ok, `${n} mensagens`);
  }
  {
    const { ok, status, data } = await request("POST", "/mensagem/enviar", {
      token: tokenCliente,
      body: {
        servico_id: servicoId,
        conteudo: "Mensagem de teste do script (cliente).",
        tipo_midia: "texto",
      },
    });
    assertOk("POST /mensagem/enviar (cliente)", ok && status === 201, data?.id || data?.erro);
  }
  {
    const { ok, status, data } = await request("POST", "/mensagem/enviar", {
      token: tokenPrestador,
      body: {
        servico_id: servicoId,
        conteudo: "Resposta de teste do script (prestador).",
        tipo_midia: "texto",
      },
    });
    assertOk("POST /mensagem/enviar (prestador)", ok && status === 201, data?.id || data?.erro);
  }

  // 22) Carteira cliente
  {
    const { ok, data } = await request("GET", "/carteira/acharPorUserId", {
      query: { id: userCliente.id },
    });
    assertOk("GET /carteira/acharPorUserId", ok && data, `saldo=${data?.saldo ?? "?"}`);
  }

  // Limpeza: marca serviço como cancelado para não acumular lixo com títulos de teste
  {
    const { ok } = await request("PATCH", "/servico/atualizarStatus", {
      body: { id: servicoId, status: "cancelado" },
    });
    assertOk("PATCH /servico/atualizarStatus → cancelado (limpeza)", ok, servicoId);
  }

  console.log(`\n--- Resumo ---`);
  console.log(`OK: ${passed}  Falhas: ${failed}`);
  if (warnings.length) {
    console.log(`\nAvisos:`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
  console.log("");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
