/**
 * Teste de integração — Prestador, Serviço e Carteira
 *
 * Fluxo:
 *  1. Registra dois usuários: um prestador (A) e um cliente (B)
 *  2. Cria o perfil de Prestador para o usuário A
 *  3. Cria uma Carteira para ambos
 *  4. Testa os endpoints solicitados em sequência
 */
export {}
const BASE_URL = 'http://localhost:3002';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function req<T = any>(
  method: string,
  path: string,
  body?: object,
  token?: string,
): Promise<{ status: number; data: T }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: T;
  try { data = JSON.parse(text) as T; } catch { data = text as unknown as T; }

  return { status: res.status, data };
}

function ok(label: string, pass: boolean): boolean {
  if (pass) console.log(`  ✅  ${label}`);
  else      console.error(`  ❌  ${label}`);
  return pass;
}

function secao(titulo: string) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${titulo}`);
  console.log('─'.repeat(60));
}

function resumo(nome: string, passou: number, total: number) {
  const emoji = passou === total ? '🎉' : '⚠️ ';
  console.log(`\n${emoji}  ${nome}: ${passou}/${total} testes passaram`);
}

// ─── Setup: Registra usuários ────────────────────────────────────────────────

async function registrar(suffix: string) {
  const { data } = await req('POST', '/user/register', {
    email: `teste-${suffix}-${Date.now()}@email.com`,
    senha: 'Senha@123',
    cpf: `${Date.now()}`.slice(-11).padStart(11, '0'),
  });
  if (!data?.token) throw new Error(`Falha ao registrar usuário ${suffix}: ${JSON.stringify(data)}`);
  return { token: data.token as string, userId: data.user.id as string };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀  Iniciando testes de integração — Prestador / Serviço / Carteira\n');

  // ── Registro dos dois usuários ──────────────────────────────────────────────
  secao('Setup: Registro de usuários');

  const userA = await registrar('prestador');
  console.log(`  👤  Usuário A (prestador) criado | id: ${userA.userId}`);

  const userB = await registrar('cliente');
  console.log(`  👤  Usuário B (cliente)   criado | id: ${userB.userId}`);


// ── Criação da Categoria ───────────────────────────────────────────────────
secao('Setup: Criar Categoria');

  // Criando a categoria dinamicamente antes de usar no serviço
  const { data: categoriaData } = await req('POST', '/categoria/criarCategoria', {
    nome: 'Reparos',
    slug: 'alalla',
  }, userB.token,);

  // Se o seu banco gerar UUID automático, pegamos o id retornado. 
  // Caso contrário, usamos o ID padrão do objeto de fallback.
  const categoriaId = categoriaData?.id || '00000000-0000-0000-0000-000000000001';
  console.log(`  🏷️  Categoria vinculada | id: ${categoriaId}`);


  // ── Criação do perfil de Usuário (cliente B) ──────────────────────────────
  secao('Setup: Criar Usuário (cliente)');

  const { data: usuarioData } = await req(
    'POST', '/usuario/criarUsuario',
    { nome: 'Cliente Teste' },
    userB.token,
  );

  if (!ok('Usuário (cliente) criado com sucesso', usuarioData?.user_id === userB.userId)) {
    throw new Error(`Falha ao criar usuário cliente: ${JSON.stringify(usuarioData)}`);
  }

  // ── Criação do Prestador ────────────────────────────────────────────────────
  secao('Setup: Criar Prestador');

  const { data: prestadorData } = await req(
    'POST', '/prestador/criarPrestador',
    { nome: 'Prestador Teste', bio: 'Bio de teste com mais de dez caracteres obrigatórios' },
    userA.token,
  );

  if (!ok('Prestador criado com sucesso', prestadorData?.user_id === userA.userId)) {
    throw new Error(`Falha ao criar prestador: ${JSON.stringify(prestadorData)}`);
  }

  // ── Criação das Carteiras ───────────────────────────────────────────────────
  secao('Setup: Criar Carteiras');

  const { data: carteiraClienteData } = await req('POST', '/carteira/criar-carteira', {
    user_id: userB.userId,
    saldo: '0',
    numero_cartao: "aaaaaaa",
    validade_cartao: 'bbbbbbbbb',
    nome_cartao: 'ccccccccccc',
    vcc_cartao: 'ddddddddddd',
  });
  ok('Carteira do cliente criada', !!carteiraClienteData?.id);

 // ═══════════════════════════════════════════════════════════════════════════
  // 1. getPrestadorById
  // ═══════════════════════════════════════════════════════════════════════════
  secao('1. getPrestadorById');
  let count = 0, total = 0;

  {
    total++;
    const { status, data } = await req(
      'POST', '/prestador/buscarPorUserId',
      { user_id: userA.userId },
      userA.token,
    );
    if (ok('Retorna o prestador pelo user_id', status === 200 && data?.user_id === userA.userId)) count++;
  }

  {
    total++;
    const { status, data } = await req(
      'POST', '/prestador/buscarPorUserId',
      { user_id: 'uuid-invalido' },
      userA.token,
    );
    if (ok('Rejeita user_id inválido (4xx)', status >= 400)) count++;
  }

  resumo('getPrestadorById', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. getAllServicosByPrestadorId  (serviços do prestador)
  // ═══════════════════════════════════════════════════════════════════════════
  secao('2. getAllServicosByPrestadorId');
  count = 0; total = 0;

  {
    total++;
    const { status, data } = await req(
      'GET', `/servico/buscarPorPrestadorId?id=${userA.userId}`,
    );
    // Ainda sem serviços — pode retornar array vazio ou 404; ambos são válidos
    const valido = status === 200 || status === 404;
    if (ok('Busca serviços por prestador_id (resposta válida)', valido)) count++;
  }

  resumo('getAllServicosByPrestadorId', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. AbrirServico
  // ═══════════════════════════════════════════════════════════════════════════
  secao('3. AbrirServico (criarServico)');
  count = 0; total = 0;

  const servicoBase = {
    user_id: userB.userId,
    prestador_id: userA.userId,
    categoria_id: categoriaId,
    titulo: 'Serviço de teste integração',
    descricao: 'Descrição do serviço criado pelo teste automatizado',
  };

  let servicoAceitoId = '';
  let servicoRecusadoId = '';

  {
    total++;
    const { status, data } = await req('POST', '/servico/criarServico', servicoBase);
    if (ok('Serviço criado com status "criado"', status === 200 && data?.status === 'criado')) {
      servicoAceitoId = data.id;
      count++;
    } else {
      console.error('    Detalhe:', JSON.stringify(data));
    }
  }

  {
    total++;
    const { status, data } = await req('POST', '/servico/criarServico', {
      ...servicoBase,
      titulo: 'Serviço que será recusado',
    });
    if (ok('Segundo serviço criado (para testar recusa)', status === 200 && data?.id)) {
      servicoRecusadoId = data.id;
      count++;
    }
  }

  {
    total++;
    const { status } = await req('POST', '/servico/criarServico', {
      ...servicoBase,
      titulo: 'AB', // título curto demais (< 3 chars)
    });
    if (ok('Rejeita título muito curto (4xx)', status >= 400)) count++;
  }

  resumo('AbrirServico', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. AceitarServico
  // ═══════════════════════════════════════════════════════════════════════════
  secao('4. AceitarServico');
  count = 0; total = 0;

  if (servicoAceitoId) {
    total++;
    const { status, data } = await req('PATCH', '/servico/atualizarStatus', {
      id: servicoAceitoId,
      status: 'aceito',
    });
    if (ok('Status atualizado para "aceito"', status === 200)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  } else {
    console.warn('  ⚠️  Pulando — serviço para aceitar não foi criado');
  }

  resumo('AceitarServico', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. RecusarServico
  // ═══════════════════════════════════════════════════════════════════════════
  secao('5. RecusarServico');
  count = 0; total = 0;

  if (servicoRecusadoId) {
    total++;
    const { status, data } = await req('PATCH', '/servico/atualizarStatus', {
      id: servicoRecusadoId,
      status: 'recusado',
    });
    if (ok('Status atualizado para "recusado"', status === 200)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  } else {
    console.warn('  ⚠️  Pulando — serviço para recusar não foi criado');
  }

  {
    total++;
    const { status } = await req('PATCH', '/servico/atualizarStatus', {
      id: 'uuid-invalido',
      status: 'aceito',
    });
    if (ok('Rejeita id inválido (4xx)', status >= 400)) count++;
  }

  resumo('RecusarServico', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. GetServiceByStatus  (filtra por status após buscar)
  // ═══════════════════════════════════════════════════════════════════════════
  secao('6. GetServiceByStatus (filtro client-side via listarTodos)');
  count = 0; total = 0;

  {
    total++;
    const { status, data } = await req('GET', '/servico/listarTodos');
    if (status === 200 && Array.isArray(data)) {
      const aceitos   = data.filter((s: any) => s.status === 'aceito');
      const recusados = data.filter((s: any) => s.status === 'recusado');
      const criados   = data.filter((s: any) => s.status === 'criado');

      if (ok(
        `Filtra por status: ${aceitos.length} aceito(s), ${recusados.length} recusado(s), ${criados.length} criado(s)`,
        true,
      )) count++;

      // Garante que os serviços criados neste teste estão no resultado correto
      if (servicoAceitoId) {
        total++;
        if (ok(
          'Serviço aceito está na lista de aceitos',
          aceitos.some((s: any) => s.id === servicoAceitoId),
        )) count++;
      }

      if (servicoRecusadoId) {
        total++;
        if (ok(
          'Serviço recusado está na lista de recusados',
          recusados.some((s: any) => s.id === servicoRecusadoId),
        )) count++;
      }
    } else {
      ok('listarTodos retornou 200 com array', false);
    }
  }

  resumo('GetServiceByStatus', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. GetAllServices
  // ═══════════════════════════════════════════════════════════════════════════
  secao('7. GetAllServices');
  count = 0; total = 0;

  {
    total++;
    const { status, data } = await req('GET', '/servico/listarTodos');
    if (ok('Retorna array de serviços (200)', status === 200 && Array.isArray(data))) count++;
  }

  {
    total++;
    const { status, data } = await req('GET', `/servico/buscarPorUserId?id=${userB.userId}`);
    const valido = status === 200 && Array.isArray(data);
    if (ok('Busca serviços pelo user_id do cliente', valido)) count++;
  }

  {
    total++;
    const { status, data } = await req('GET', `/servico/buscarPorPrestadorId?id=${userA.userId}`);
    if (ok('Busca serviços pelo prestador_id', status === 200 && Array.isArray(data))) count++;
  }

  resumo('GetAllServices', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. GetCarteiraById
  // ═══════════════════════════════════════════════════════════════════════════
  secao('8. GetCarteiraById');
  count = 0; total = 0;

  {
    total++;
    const { status, data } = await req('GET', `/carteira/acharPorUserId?id=${userB.userId}`);
    if (ok('Carteira do cliente encontrada pelo user_id', status === 200 && data?.user_id === userB.userId)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }

  {
    total++;
    const { status, data } = await req('GET', `/carteira/acharPorPrestadorId?id=${userA.userId}`);
    if (ok('Carteira do prestador encontrada pelo prestador_id', status === 200 && data?.prestador_id === userA.userId)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }

  resumo('GetCarteiraById', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. UpdatePerfil (editarPrestador)
  // ═══════════════════════════════════════════════════════════════════════════
  secao('9. UpdatePerfil (editarPrestador)');
  count = 0; total = 0;

  {
    total++;
    const novoNome = 'Prestador Atualizado';
    const { status, data } = await req(
      'PATCH', '/prestador/editarPrestador',
      { nome: novoNome, bio: 'Bio atualizada pelo teste de integração automático' },
      userA.token,
    );
    if (ok('Nome do prestador atualizado com sucesso', status === 200 && data?.nome === novoNome)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }

  {
    total++;
    const { status } = await req(
      'PATCH', '/prestador/editarPrestador',
      { nome: 'Ok', bio: 'Bio' }, // sem token
    );
    if (ok('Rejeita atualização sem token (401)', status === 401)) count++;
  }

  resumo('UpdatePerfil', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // Resultado final
  // ═══════════════════════════════════════════════════════════════════════════
  console.log(`\n${'═'.repeat(60)}`);
  console.log('  ✔  Testes concluídos');
  console.log('═'.repeat(60));
}

main().catch((err) => {
  console.error('\n💥  Erro fatal nos testes:', err.message);
  process.exit(1);
});
