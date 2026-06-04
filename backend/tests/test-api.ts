const BASE_URL = 'http://localhost:3002';

async function testAPI() {
  console.log("🚀 Iniciando testes da API...\n");

  try {
    // 1. TESTE DE REGISTRO
    console.log("--- Testando Registro ---");
    const registerRes = await fetch(`${BASE_URL}/user/register`, {
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

    let countUsuarios = 0;




//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
    
    


    // teste de usuario
    console.log('\n------ Testando rotas do Usuario ----------');
    try {
      
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
    if (usuarioData.user_id === registerData.user.id) {
     console.log('Usuario criado com sucesso'); 
        countUsuarios++;
    } else {
        console.error('erro ao criar usuario');
      }

//------------------------------------------------------------------------------------

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

      if (usuarioDataDois.nome != 'GustavoDois') {
        console.error('erro ao editar usuario');
      } else {
     console.log('usuario editado com sucesso'); 
        countUsuarios++;
      }

//------------------------------------------------------------------------------------

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
    if (usuarioBuscadoData.user_id === registerData.user.id) {
    console.log('Busca feita com sucesso');
        countUsuarios++;
    } else { console.error('erro ao buscar usuario');}

//------------------------------------------------------------------------------------

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
    
      if(usuarioDeletado){countUsuarios++; console.log('usuario deletado com sucesso')} else {console.error('erro ao deletar usuario');};

      if (countUsuarios == 4) {
         console.log('TODOS OS TESTES DE USUARIO PASSARAM');
      }

    } catch (error: any) {
      console.error("\n❌ Erro durante os testes de usuario:");
      console.error(error.message);
    }


testAPI();

  }
