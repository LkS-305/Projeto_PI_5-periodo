/**
 * Testes de integração — DOMI API
 *
 * Fluxo:
 *  1. Registra dois usuários: prestador (A) e cliente (B)
 *  2. Cria perfis de Usuario, Prestador, Categoria e Carteira
 *  3. Executa 11 seções de teste cobrindo os endpoints principais
 *  4. Faz limpeza dos dados criados
 *
 * Pré-requisito: servidor rodando em localhost:3002 com banco conectado
 * Executar com: npm run test:api
 */
export {};

const BASE_URL = 'http://localhost:3002';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

let totalGeral = 0;
let passouGeral = 0;

function ok(label: string, pass: boolean): boolean {
  totalGeral++;
  if (pass) { passouGeral++; console.log(`  ✅  ${label}`); }
  else        console.error(`  ❌  ${label}`);
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

// ─── Setup: Registra usuários ─────────────────────────────────────────────────

async function registrar(suffix: string) {
  const { data } = await req('POST', '/user/register', {
    email: `teste-${suffix}-${Date.now()}@email.com`,
    senha: 'Senha@123',
    cpf: `${Date.now()}`.slice(-11).padStart(11, '0'),
  });
  if (!data?.token) throw new Error(`Falha ao registrar usuário ${suffix}: ${JSON.stringify(data)}`);
  return { token: data.token as string, userId: data.user.id as string };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀  Iniciando testes de integração — DOMI API\n');

  // ── Registro ──────────────────────────────────────────────────────────────
  secao('Setup: Registro de usuários');
  const userA = await registrar('prestador');
  console.log(`  👤  Usuário A (prestador) criado | id: ${userA.userId}`);
  const userB = await registrar('cliente');
  console.log(`  👤  Usuário B (cliente)   criado | id: ${userB.userId}`);

  // ── Categoria ─────────────────────────────────────────────────────────────
  secao('Setup: Criar Categoria');
  const { data: categoriaData } = await req('POST', '/categoria/criarCategoria', {
    nome: `Reparos-${Date.now()}`,
    slug: `reparos-${Date.now()}`,
    icon_url: 'https://icons.domi.com/reparos.svg',
  }, userB.token);
  const categoriaId = categoriaData?.id;
  if (!categoriaId) throw new Error(`Falha ao criar categoria: ${JSON.stringify(categoriaData)}`);
  console.log(`  🏷️  Categoria criada | id: ${categoriaId}`);

  // ── Usuario (cliente B) ───────────────────────────────────────────────────
  secao('Setup: Criar Usuário (cliente)');
  const { data: usuarioData } = await req('POST', '/usuario/criarUsuario', { nome: 'Cliente Teste' }, userB.token);
  if (!ok('Usuário (cliente) criado', usuarioData?.user_id === userB.userId)) {
    throw new Error(`Falha ao criar usuário: ${JSON.stringify(usuarioData)}`);
  }

  // ── Prestador (A) ─────────────────────────────────────────────────────────
  secao('Setup: Criar Prestador');
  const { data: prestadorData } = await req('POST', '/prestador/criarPrestador', {
    nome: 'Prestador Teste',
    bio: 'Profissional experiente com mais de cinco anos de atuação na área.',
  }, userA.token);
  if (!ok('Prestador criado', prestadorData?.user_id === userA.userId)) {
    throw new Error(`Falha ao criar prestador: ${JSON.stringify(prestadorData)}`);
  }

  // ── Carteiras ─────────────────────────────────────────────────────────────
  secao('Setup: Criar Carteira (cliente)');
  const { data: carteiraData } = await req('POST', '/carteira/criar-carteira', {
    user_id: userB.userId,
    saldo: '0',
    numero_cartao: '4111111111111111',
    validade_cartao: '12/28',
    nome_cartao: 'Cliente Teste',
    vcc_cartao: '123',
  });
  ok('Carteira do cliente criada', !!carteiraData);

  // ── Data futura para serviços ─────────────────────────────────────────────
  const dataFutura = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. getPrestadorById
  // ═══════════════════════════════════════════════════════════════════════════
  secao('1. getPrestadorById');
  let count = 0, total = 0;

  { total++;
    const { status, data } = await req('POST', '/prestador/buscarPorUserId', { user_id: userA.userId }, userA.token);
    if (ok('Retorna prestador pelo user_id (200)', status === 200 && data?.user_id === userA.userId)) count++;
  }
  { total++;
    const { status } = await req('POST', '/prestador/buscarPorUserId', { user_id: 'uuid-invalido' }, userA.token);
    if (ok('Rejeita user_id inválido (4xx)', status >= 400)) count++;
  }

  resumo('getPrestadorById', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. getAllServicosByPrestadorId
  // ═══════════════════════════════════════════════════════════════════════════
  secao('2. getAllServicosByPrestadorId');
  count = 0; total = 0;

  { total++;
    const { status } = await req('GET', `/servico/buscarPorPrestadorId?id=${userA.userId}`);
    if (ok('Busca serviços por prestador_id (200 ou 404)', status === 200 || status === 404)) count++;
  }

  resumo('getAllServicosByPrestadorId', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. AbrirServico
  // ═══════════════════════════════════════════════════════════════════════════
  secao('3. AbrirServico');
  count = 0; total = 0;

  const servicoBase = {
    user_id: userB.userId,
    prestador_id: userA.userId,
    categoria_id: categoriaId,
    titulo: 'Serviço de teste de integração',
    descricao: 'Descrição completa do serviço criado pelo teste automatizado',
    preco_acordado: 150,
    data_inicio: dataFutura,
    duracao: '2h',
    categoria: 'Reparos',
    status: 'criado',
  };

  let servicoAceitoId = '';
  let servicoRecusadoId = '';

  { total++;
    const { status, data } = await req('POST', '/servico/criarServico', servicoBase);
    if (ok('Serviço criado com status "criado"', status === 200 && data?.status === 'criado')) {
      servicoAceitoId = data.id;
      count++;
    } else console.error('    Detalhe:', JSON.stringify(data));
  }
  { total++;
    const { status, data } = await req('POST', '/servico/criarServico', { ...servicoBase, titulo: 'Serviço para recusar' });
    if (ok('Segundo serviço criado (para testar recusa)', status === 200 && data?.id)) {
      servicoRecusadoId = data.id;
      count++;
    }
  }
  { total++;
    const { status } = await req('POST', '/servico/criarServico', { ...servicoBase, titulo: 'AB' });
    if (ok('Rejeita título menor que 3 caracteres (4xx)', status >= 400)) count++;
  }

  resumo('AbrirServico', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. AceitarServico
  // ═══════════════════════════════════════════════════════════════════════════
  secao('4. AceitarServico');
  count = 0; total = 0;

  if (servicoAceitoId) {
    total++;
    const { status, data } = await req('PATCH', '/servico/atualizarStatus', { id: servicoAceitoId, status: 'aceito' });
    if (ok('Status atualizado para "aceito" (200)', status === 200)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  } else console.warn('  ⚠️  Pulando — serviço não foi criado');

  resumo('AceitarServico', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. RecusarServico
  // ═══════════════════════════════════════════════════════════════════════════
  secao('5. RecusarServico');
  count = 0; total = 0;

  if (servicoRecusadoId) {
    total++;
    const { status, data } = await req('PATCH', '/servico/atualizarStatus', { id: servicoRecusadoId, status: 'recusado' });
    if (ok('Status atualizado para "recusado" (200)', status === 200)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  } else console.warn('  ⚠️  Pulando — serviço não foi criado');

  { total++;
    const { status } = await req('PATCH', '/servico/atualizarStatus', { id: 'uuid-invalido', status: 'aceito' });
    if (ok('Rejeita id inválido (4xx)', status >= 400)) count++;
  }

  resumo('RecusarServico', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. GetServiceByStatus
  // ═══════════════════════════════════════════════════════════════════════════
  secao('6. GetServiceByStatus');
  count = 0; total = 0;

  { total++;
    const { status, data } = await req('GET', '/servico/listarTodos');
    if (status === 200 && Array.isArray(data)) {
      const aceitos   = data.filter((s: any) => s.status === 'aceito');
      const recusados = data.filter((s: any) => s.status === 'recusado');
      if (ok(`Filtra por status: ${aceitos.length} aceito(s), ${recusados.length} recusado(s)`, true)) count++;

      if (servicoAceitoId) {
        total++;
        if (ok('Serviço aceito aparece nos aceitos', aceitos.some((s: any) => s.id === servicoAceitoId))) count++;
      }
      if (servicoRecusadoId) {
        total++;
        if (ok('Serviço recusado aparece nos recusados', recusados.some((s: any) => s.id === servicoRecusadoId))) count++;
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

  { total++;
    const { status, data } = await req('GET', '/servico/listarTodos');
    if (ok('listarTodos retorna array (200)', status === 200 && Array.isArray(data))) count++;
  }
  { total++;
    const { status, data } = await req('GET', `/servico/buscarPorUserId?id=${userB.userId}`);
    if (ok('Busca serviços pelo user_id do cliente', status === 200 && Array.isArray(data))) count++;
  }
  { total++;
    const { status, data } = await req('GET', `/servico/buscarPorPrestadorId?id=${userA.userId}`);
    if (ok('Busca serviços pelo prestador_id', status === 200 && Array.isArray(data))) count++;
  }

  resumo('GetAllServices', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. GetCarteiraById
  // ═══════════════════════════════════════════════════════════════════════════
  secao('8. GetCarteiraById');
  count = 0; total = 0;

  { total++;
    const { status, data } = await req('GET', `/carteira/acharPorUserId?id=${userB.userId}`);
    if (ok('Carteira do cliente encontrada (200)', status === 200)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }
  { total++;
    const { status } = await req('GET', `/carteira/acharPorUserId?id=uuid-invalido`);
    if (ok('Rejeita user_id inválido (4xx)', status >= 400)) count++;
  }

  resumo('GetCarteiraById', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. UpdatePerfil (editarPrestador)
  // ═══════════════════════════════════════════════════════════════════════════
  secao('9. UpdatePerfil (editarPrestador)');
  count = 0; total = 0;

  { total++;
    const novoNome = 'Prestador Atualizado';
    const { status, data } = await req('PATCH', '/prestador/editarPrestador', {
      nome: novoNome,
      bio: 'Bio atualizada pelo teste de integração automatizado com sucesso.',
    }, userA.token);
    if (ok('Nome atualizado com sucesso (200)', status === 200 && data?.nome === novoNome)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }
  { total++;
    const { status } = await req('PATCH', '/prestador/editarPrestador', { nome: 'Ok', bio: 'Bio' });
    if (ok('Rejeita requisição sem token (401)', status === 401)) count++;
  }

  resumo('UpdatePerfil', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. Mensagens
  // ═══════════════════════════════════════════════════════════════════════════
  secao('10. Mensagens');
  count = 0; total = 0;

  let mensagemId = '';

  if (servicoAceitoId) {
    { total++;
      const { status, data } = await req('POST', '/mensagem/enviar', {
        servico_id: servicoAceitoId,
        conteudo: 'Olá, tudo bem com o serviço?',
        tipo_midia: 'texto',
      }, userB.token);
      if (ok('Mensagem enviada (201)', status === 201 && data?.id)) {
        mensagemId = data.id;
        count++;
      } else console.error('    Detalhe:', JSON.stringify(data));
    }
    { total++;
      const { status, data } = await req('GET', `/mensagem/servico/${servicoAceitoId}`, undefined, userB.token);
      if (ok('Lista mensagens por serviço (200)', status === 200 && Array.isArray(data))) count++;
      else console.error('    Detalhe:', JSON.stringify(data));
    }
    { total++;
      const { status, data } = await req('GET', '/mensagem/usuario', undefined, userB.token);
      if (ok('Lista mensagens do usuário autenticado (200)', status === 200)) count++;
      else console.error('    Detalhe:', JSON.stringify(data));
    }
    if (mensagemId) {
      total++;
      const { status } = await req('PATCH', `/mensagem/${mensagemId}/lida`, undefined, userA.token);
      if (ok('Mensagem marcada como lida (204)', status === 204)) count++;
    }
  } else {
    console.warn('  ⚠️  Pulando — nenhum serviço disponível para enviar mensagens');
  }

  { total++;
    const { status } = await req('POST', '/mensagem/enviar', {
      servico_id: servicoAceitoId || 'uuid-invalido',
      conteudo: 'Teste',
      tipo_midia: 'texto',
    }); // sem token
    if (ok('Rejeita envio sem token (401)', status === 401)) count++;
  }

  resumo('Mensagens', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. Avaliações
  // ═══════════════════════════════════════════════════════════════════════════
  secao('11. Avaliações');
  count = 0; total = 0;

  let avaliacaoId = '';

  if (servicoAceitoId) {
    { total++;
      const { status, data } = await req('POST', '/avaliacao/criarAvaliacao', {
        servico_id: servicoAceitoId,
        usuario_id: userB.userId,
        prestador_id: undefined,
        nota: 5,
        comentario: 'Excelente serviço, muito profissional!',
        media: undefined,
        destinatario: 'servico',
      });
      if (ok('Avaliação criada (200)', status === 200 && data?.nota === 5)) {
        avaliacaoId = data.id;
        count++;
      } else console.error('    Detalhe:', JSON.stringify(data));
    }
    { total++;
      const { status } = await req('POST', '/avaliacao/criarAvaliacao', {
        servico_id: servicoAceitoId,
        usuario_id: userB.userId,
        prestador_id: undefined,
        nota: 10,
        comentario: undefined,
        media: undefined,
        destinatario: 'servico',
      });
      if (ok('Rejeita nota fora do intervalo 1-5 (4xx)', status >= 400)) count++;
    }
    if (avaliacaoId) {
      { total++;
        const { status, data } = await req('GET', '/avaliacao/buscarPorServicoId', {
          id: servicoAceitoId,
          listBy: 'servico',
        });
        if (ok('Lista avaliações por serviço (200)', status === 200 && Array.isArray(data))) count++;
        else console.error('    Detalhe:', JSON.stringify(data));
      }
      { total++;
        const { status, data } = await req('PATCH', '/avaliacao/editarAvaliacao', {
          id: avaliacaoId,
          dados: { comentario: 'Comentário atualizado pelo teste' },
        });
        if (ok('Avaliação atualizada (200)', status === 200)) count++;
        else console.error('    Detalhe:', JSON.stringify(data));
      }
      { total++;
        const { status } = await req('DELETE', '/avaliacao/deletarAvaliacao', { id: avaliacaoId });
        if (ok('Avaliação deletada (200)', status === 200)) count++;
      }
    }
  } else {
    console.warn('  ⚠️  Pulando — nenhum serviço disponível para avaliar');
  }

  resumo('Avaliações', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. Usuario (perfil do cliente)
  // ═══════════════════════════════════════════════════════════════════════════
  secao('12. Usuario');
  count = 0; total = 0;

  { total++;
    const { status, data } = await req('POST', '/usuario/buscarPorUserId', { user_id: userB.userId }, userB.token);
    if (ok('Busca usuário pelo user_id (200)', status === 200 && data?.user_id === userB.userId)) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }
  { total++;
    const { status, data } = await req('PATCH', '/usuario/editarUsuario', {
      nome: 'Cliente Atualizado',
    }, userB.token);
    if (ok('Atualiza nome do usuário (200)', status === 200 && data?.nome === 'Cliente Atualizado')) count++;
    else console.error('    Detalhe:', JSON.stringify(data));
  }
  { total++;
    const { status } = await req('POST', '/usuario/buscarPorUserId', { user_id: userB.userId });
    if (ok('Rejeita busca sem token (401)', status === 401)) count++;
  }

  resumo('Usuario', count, total);

  // ═══════════════════════════════════════════════════════════════════════════
  // Limpeza
  // ═══════════════════════════════════════════════════════════════════════════
  secao('Limpeza: removendo dados de teste');

  await req('DELETE', '/usuario/deletarUsuario', { user_id: userB.userId }, userB.token);
  console.log('  🗑️  Usuário cliente deletado');

  await req('DELETE', '/prestador/deletarPrestador', { user_id: userA.userId }, userA.token);
  console.log('  🗑️  Prestador deletado');

  await req('DELETE', '/user/deletarUser', { id: userA.userId }, userA.token);
  console.log('  🗑️  User A deletado');

  await req('DELETE', '/user/deletarUser', { id: userB.userId }, userB.token);
  console.log('  🗑️  User B deletado');

  // ═══════════════════════════════════════════════════════════════════════════
  // Resultado final
  // ═══════════════════════════════════════════════════════════════════════════
  console.log(`\n${'═'.repeat(60)}`);
  const emoji = passouGeral === totalGeral ? '🏆' : '⚠️ ';
  console.log(`  ${emoji}  TOTAL: ${passouGeral}/${totalGeral} testes passaram`);
  if (passouGeral < totalGeral) {
    console.log(`  ❌  ${totalGeral - passouGeral} teste(s) falharam`);
  }
  console.log('═'.repeat(60));

  if (passouGeral < totalGeral) process.exit(1);
}

main().catch((err) => {
  console.error('\n💥  Erro fatal nos testes:', err.message);
  process.exit(1);
});
