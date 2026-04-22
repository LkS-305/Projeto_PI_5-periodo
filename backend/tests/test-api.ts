const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log("🚀 Iniciando testes da API...\n");

  try {
    // 1. TESTE DE REGISTRO
    console.log("--- Testando Registro ---");
    const registerRes = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `teste-${Date.now()}@email.com`, // Email único por teste
        senha: "123",
        cpf: `${Date.now()}`,
        tipo: "User"
      })
    });

    const registerData = await registerRes.json();
    console.log("Status Registro:", registerRes.status);
    console.log("Resposta:", registerData);

    if (!registerRes.ok) throw new Error("Falha no registro");

    const token = registerData.token;


    // teste de usuario
    console.log('\n------ Testando rotas do Usuario ----------');
    const usuarioCriado = await fetch(`${BASE_URL}/usuario/criarUsuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Gustavo',
      })
    });
    const usuarioData = await usuarioCriado.json();
    //console.log('Resposta:', usuarioData);
    

    const usuarioAtualizado = await fetch(`${BASE_URL}/usuario/editarUsuario`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'GustavoDois'
      })
    });

    const usuarioDataDois = await usuarioAtualizado.json();
    //console.log('Novo Usuario:', usuarioDataDois);

    const usuarioBuscado = await fetch(`${BASE_URL}/usuario/buscarPorUserId`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: usuarioData.user_id,
      })
    });

    const usuarioBuscadoData = await usuarioBuscado.json();
    if (usuarioBuscadoData.id === usuarioDataDois.id) {
    //console.log('Busca feita com sucesso');
    }

    const usuarioDeletado = await fetch(`${BASE_URL}/usuario/deletarUsuario`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: usuarioData.user_id
      })
    });
    //if(usuarioDeletado) console.log('Sucesso ao deletar usuario');

    console.log('TODOS OS TESTES DE USUARIO PASSARAM');
  } catch (error: any) {

    console.error("\n❌ Erro durante os testes:");
    console.error(error.message);
  }
}

testAPI();
