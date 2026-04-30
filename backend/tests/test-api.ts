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


//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
    let countPrestadores = 0;
    try {

        // teste de prestador
    console.log('\n------ Testando rotas do Prestador ----------');
    const  prestadorCriado = await fetch(`${BASE_URL}/prestador/criarPrestador`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Gustavo',
        bio: 'Ola eu soy o gustavo e tenho no mininmo 10 fucking caracteres'
      })
    });
    
    
    const prestadorData = await prestadorCriado.json();
    if (prestadorData.user_id === registerData.user.id) {
     console.log('Prestador criado com sucesso'); 
        countPrestadores++;
    } else {
        console.error('erro ao criar prestador');
      }
    
//------------------------------------------------------------------------------------

    const prestadorAtualizado = await fetch(`${BASE_URL}/prestador/editarPrestador`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'GustavoDois',
      })
    });

    const prestadorDataDois = await prestadorAtualizado.json();
           if (prestadorDataDois.nome === 'GustavoDois') {
     console.log('Prestador editado com sucesso'); 
        countPrestadores++;
    } else {
        console.error('erro ao editado prestador');
      }
    

//------------------------------------------------------------------------------------
    
    const prestadorBuscado = await fetch(`${BASE_URL}/prestador/buscarPorUserId`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: prestadorData.user_id,
      })
    });

    const prestadorBuscadoData = await prestadorBuscado.json();
    if (prestadorBuscadoData.user_id === registerData.user.id) {
    console.log('busca feita com sucesso');
      countPrestadores++;
    } else {console.error('erro ao buscar prestador');}

//------------------------------------------------------------------------------------
    
    const prestadorDeletado = await fetch(`${BASE_URL}/prestador/deletarPrestador`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: prestadorData.user_id
      })
    });
    const prestadorDeletadoData = await prestadorDeletado.json();
    if(prestadorDeletadoData){ console.log('prestador deletado com sucesso'); countPrestadores++;} else {console.error('erro ao deletar prestador');};

    console.log('TODOS OS TESTES DE PRESTADOR PASSARAM');
  } catch (error: any) {

    console.error("\n❌ Erro durante os testes de prestador:");
    console.error(error.message);
  }

// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

  // TESTE DE CATEGORIAS
    console.log('\n----------------- Teste de Categorias ------------------');

    let countCategorias = 0;
    
  try {
    const  categoriaCriado = await fetch(`${BASE_URL}/categoria/criarCategoria`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Pedreiro',
        slug: 'Trabalho com pedras'
      })
    });
    
    
    const categoriaData = await categoriaCriado.json();
    if (categoriaData.nome === 'Pedreiro') {
     console.log('Categoria criada com sucesso'); 
        countCategorias++;
    } else {
        console.error('erro ao criar categoria');
      }
    
//------------------------------------------------------------------------------------

    const categoriaAtualizada = await fetch(`${BASE_URL}/categoria/editarCategoria`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: categoriaData.id,
        nome: 'Pedreira',
      })
    });

    const categoriaDataDois = await categoriaAtualizada.json();
    if (categoriaDataDois.nome === 'Pedreira') {
      console.log('Categoria editada com sucesso'); 
      countCategorias++;
    } else {
        console.error('erro ao editar categoria');
      }
    

//------------------------------------------------------------------------------------
    
    const categoriaBuscado = await fetch(`${BASE_URL}/categoria/buscarPorId`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: categoriaData.id,
      })
    });

    const categoriaBuscadoData = await categoriaBuscado.json();
    if (categoriaBuscadoData.id === categoriaData.id) {
    console.log('busca feita com sucesso');
      countCategorias++;
    } else {console.error('erro ao buscar categoria');}

//------------------------------------------------------------------------------------
    
    const categoriaDeletado = await fetch(`${BASE_URL}/categoria/deletarCategoria`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: categoriaData.id
      })
    });
    const categoriaDeletadoData = await categoriaDeletado.json();
    if(categoriaDeletadoData){ console.log('categoria deletado com sucesso'); countCategorias++;} else {console.error('erro ao deletar categoria');};

    console.log('TODOS OS TESTES DE CATEGORIAS PASSARAM');



 } catch (error: any) {
    
    console.error("\n❌ Erro durante os testes de categoria:");
    console.error(error.message);
  }


 } catch (erro: any) {
    console.error("\n❌ Erro durante os testes");
    console.error(erro.message);
  }}
testAPI();
