import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterDto, RegisterResponseDto, ChangeForgotPasswordDto, LoginDto, ChangePasswordDto } from '../../dtos/autenticacao';

import { IAutenticacaoRepository } from '../../repositories/IAutenticacaoRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IMailProvider } from '../../dtos/mail';

import { User } from '../../entities/User';
import { UserType } from '../../dtos/usuario';


export class RegisterUseCase {
  constructor(
    private autenticacaoRepository: IAutenticacaoRepository,
    private usuarioRepository: IUserRepository
  ){}

  async executar(dados: RegisterDto){
    const usuarioExiste = await this.usuarioRepository.findByEmail(dados.email);
    if (usuarioExiste){
        throw new Error('Este email ja existe');
    }

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    
    const dadosSafe = {...dados, tipo_usuario: 'Usuario' as UserType, senha: senhaCriptografada}
    const novoUsuario = new User(dadosSafe);

    const usuarioSalvo = await this.autenticacaoRepository.register(novoUsuario);

    return usuarioSalvo;
  }
}


export class LoginUseCase {
    constructor(
        private autenticacaoRepo: IAutenticacaoRepository,
        private usuarioRepo: IUserRepository
           ) {}

    async executar(dados: LoginDto) {
        // 1. Busca o usuário
        const usuario = await this.usuarioRepo.findByEmail(dados.email);

        // 2. Erro genérico para evitar enumeração de usuários (Segurança)
        if (!usuario) {
            throw new Error("E-mail ou senha incorretos");
        }

        // 3. Compara os hashes
        const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
        if (!senhaValida) {
            throw new Error("E-mail ou senha incorretos");
        }

        // 4. Gera o Token (Validade de 1 dia, por exemplo)
        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo_usuario },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '1d' }
        );


        // 6. Retorno (Não envie a senha de volta!)
        return {
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            token

    }
  }
}


export class ForgotPassword {
  constructor(
    private autenticacaoRepository: IAutenticacaoRepository, 
    private userRepository: IUserRepository,
    private mailProvider: IMailProvider  
  ) {}

async executar(email: string) {
    const usuario = await this.userRepository.findByEmail(email);
    if (!usuario) return;

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracao = new Date(Date.now() + 30 * 60000);

    await this.autenticacaoRepository.updateRecoveryToken(usuario.id, codigo, expiracao);

    // Envia o e-mail de fato
    await this.mailProvider.sendMail({
      to: email,
      subject: 'Recuperação de Senha - Projeto PI',
      body: `Seu código de recuperação é: <b>${codigo}</b>. Ele expira em 30 minutos.`
    });
  }
}

export class ChangeForgotPassword {
  // Injetamos apenas o Repositório, pois o e-mail já foi enviado na etapa anterior
  constructor(
    private userRepository: IUserRepository,
    private autenticacaoRepository: IAutenticacaoRepository
  ) {}

  async executar(props: ChangeForgotPasswordDto): Promise<void> {
    // 1. Busca o usuário pelo e-mail
    const usuario = await this.userRepository.findByEmail(props.email);

    // 2. Validações de segurança
    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    if (!usuario.recovery_token || usuario.recovery_token !== props.codigo) {
      throw new Error("Código de verificação inválido.");
    }

    // 3. Valida se o código expirou (comparando com a data atual do seu Kali)
    if (usuario.recovery_token_expires && new Date() > usuario.recovery_token_expires) {
      throw new Error("O código de recuperação expirou. Solicite um novo.");
    }

    // 4. Criptografa a nova senha antes de salvar
    // Nunca salve a senha em texto limpo no Postgres!
    const saltRounds = 10;
    const senhaHashed = await bcrypt.hash(props.nova_senha, saltRounds);

    // 5. Persistência dos dados
    await this.autenticacaoRepository.changePassword(usuario.id, senhaHashed);
    
    // 6. Limpeza (Segurança): invalida o código para que ele não possa ser usado de novo
    await this.autenticacaoRepository.updateRecoveryToken(usuario.id, null, null);

    console.log(`[AUTH] Senha alterada com sucesso para: ${props.email}`);
  }
}


export class ChangePassword {
  constructor(
    private autenticacaoRepository: IAutenticacaoRepository, 
    private userRepository: IUserRepository,
  ) {}

async executar(props: ChangePasswordDto) {
    const usuario = await this.userRepository.findById(props.id);
    if (!usuario) throw new Error("Usuário não encontrado");

    // CORREÇÃO: Comparar hash em vez de string pura
    const senhaValida = await bcrypt.compare(props.senha_atual, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha atual não compatível');
    }

    // CORREÇÃO: Gerar hash da nova senha antes de mandar pro banco
    const novaSenhaHash = await bcrypt.hash(props.nova_senha, 10);
    await this.autenticacaoRepository.changePassword(usuario.id, novaSenhaHash);
}
}
