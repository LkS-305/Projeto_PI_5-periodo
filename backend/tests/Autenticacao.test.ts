import { InMemoryAutenticacaoRepository } from './repositories/InMemoryAutenticacaoRepository';
import { User } from '../src/core/entities/User';
import bcrypt from 'bcrypt';

describe('Fluxo de Autenticação e Recuperação de Senha', () => {
  let repo: InMemoryAutenticacaoRepository;

  // Antes de cada teste, limpamos o repositório
  beforeEach(() => {
    repo = new InMemoryAutenticacaoRepository();
  });

  it('deve registrar um usuário e retornar os dados sem a senha', async () => {
    const senhaHashed = await bcrypt.hash('senha123', 10);
    const usuario = new User({
      nome: 'Guillermo',
      email: 'guillermo@teste.com',
      senha: senhaHashed,
      cpf: '12345678900',
      role: 'Usuario'
    }, 'id-uuid-1');

    const resultado = await repo.register(usuario);

    expect(resultado).not.toHaveProperty('senha');
    expect(resultado.email).toBe('guillermo@teste.com');
  });

  it('deve encontrar um usuário pelo e-mail no login', async () => {
    const usuario = new User({
      nome: 'Teste',
      email: 'login@teste.com',
      senha: 'hash',
      cpf: '000',
      role: 'Usuario'
    });
    await repo.register(usuario);
    const props = {email: 'login@teste.com', senha: 'hash'}
    const userEncontrado = await repo.login(props);

    expect(userEncontrado).not.toBeNull();
    expect(userEncontrado?.id).toBe(usuario.id);
  });

  it('deve atualizar o token de recuperação (forgotPassword)', async () => {
    const email = 'forgot@teste.com';
    const usuario = new User({ nome: 'User', email, senha: '123', cpf: '1', role: 'Usuario' });
    await repo.register(usuario);

    const codigo = '123456';
    const expiracao = new Date(Date.now() + 30 * 60000);

    await repo.forgotPassword(email, codigo, expiracao);

    const props = {email, senha: '123'}
    // Buscamos de novo para ver se o estado mudou no array interno
    const userAtualizado = await repo.login(props);
    expect(userAtualizado?.recovery_token).toBe(codigo);
    expect(userAtualizado?.recovery_token_expires).toEqual(expiracao);
  });

  it('deve alterar a senha do usuário com sucesso', async () => {
    const usuario = new User({ nome: 'User', email: 'change@test.com', senha: 'antiga_hash', cpf: '2', role: 'Usuario' });
    await repo.register(usuario);

    const novaSenhaHash = await bcrypt.hash('nova_senha_123', 10);
    await repo.changePassword(usuario.id, novaSenhaHash);

    const props = {email: 'change@test.com', senha: novaSenhaHash}
    const userAtualizado = await repo.login(props);
    expect(userAtualizado?.senha).toBe(novaSenhaHash);
  });

  it('deve limpar o token de recuperação após o uso', async () => {
    const usuario = new User({ nome: 'User', email: 'clear@test.com', senha: '123', cpf: '3', role: 'Usuario' });
    await repo.register(usuario);
    
    // Simula que já havia um token
    await repo.updateRecoveryToken(usuario.id, '123456', new Date());
    
    // Limpa o token
    await repo.updateRecoveryToken(usuario.id, null, null);

    const props = {email: 'clear@test.com', senha: '123'}
    const userFinal = await repo.login(props);
    expect(userFinal?.recovery_token).toBeNull();
    expect(userFinal?.recovery_token_expires).toBeNull();
  });
});
