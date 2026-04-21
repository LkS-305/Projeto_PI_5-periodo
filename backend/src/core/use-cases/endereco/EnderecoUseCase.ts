import { Endereco } from '../../entities/Endereco';
import { IEnderecoRepository } from '../../repositories/IEnderecoRepository';
import { AtualizarEnderecoDto, CriarEnderecoDto } from '../../dtos/endereco';
import { IUserRepository } from '../../repositories/IUserRepository';
import { ResourceNotFoundError, ValidationError } from '../../errors/AppError';
import { validarUUID, validarTexto, validarCEP, sanitizarTexto } from '../../utils/validate';

export class CriarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository, private userRepository: IUserRepository){}

    async executar(dados: CriarEnderecoDto): Promise<Endereco>{
      validarUUID(dados.user_id, 'ID do usuário');
      validarCEP(dados.cep);
      validarTexto(dados.logradouro, 'Logradouro', 3, 150);
      validarTexto(dados.bairro, 'Bairro', 2, 100);
      validarTexto(dados.cidade, 'Cidade', 2, 100);
      validarTexto(dados.estado, 'Estado', 2, 50);
      dados.logradouro = sanitizarTexto(dados.logradouro);
      dados.bairro     = sanitizarTexto(dados.bairro);
      dados.cidade     = sanitizarTexto(dados.cidade);

      const usuario = await this.usuarioRepository.findById(dados.user_id);
      if (!usuario) throw new ResourceNotFoundError('Usuário');

      const endereco = new Endereco(dados);
      const enderecoCriado = await this.enderecoRepository.create(endereco);
      if (!enderecoCriado) throw new ValidationError('Erro ao criar endereço.');
      return enderecoCriado;
  }
}


export class DeletarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<void>{
      validarUUID(id, 'ID do endereço');
      await this.enderecoRepository.delete(id);
  }
}

export class AtualizarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(dados: AtualizarEnderecoDto): Promise<Endereco>{
      validarUUID(dados.id, 'ID do endereço');
      if (dados.cep)        validarCEP(dados.cep);
      if (dados.logradouro) { validarTexto(dados.logradouro, 'Logradouro', 3, 150); dados.logradouro = sanitizarTexto(dados.logradouro); }
      if (dados.bairro)     { validarTexto(dados.bairro, 'Bairro', 2, 100);          dados.bairro     = sanitizarTexto(dados.bairro); }
      if (dados.cidade)     { validarTexto(dados.cidade, 'Cidade', 2, 100);          dados.cidade     = sanitizarTexto(dados.cidade); }

      const endereco = await this.enderecoRepository.findById(dados.id);
      if (!endereco) throw new ResourceNotFoundError('Endereço');

      endereco.editEndereco(dados);
      const enderecoAtualizado = await this.enderecoRepository.update(endereco);
      if (!enderecoAtualizado) throw new ResourceNotFoundError('Endereço');
      return enderecoAtualizado;
  }
}

export class AcharPorUserId {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<Endereco>{
      validarUUID(id, 'ID do usuário');
      const enderecoUsuario = await this.enderecoRepository.findByUserId(id);
      if (!enderecoUsuario) throw new ResourceNotFoundError('Endereço');
      return enderecoUsuario;
  }
}

export class AcharPorPrestadorId {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<Endereco>{
      validarUUID(id, 'ID do prestador');
      const enderecoPrestador = await this.enderecoRepository.findByPrestadorId(id);
      if (!enderecoPrestador) throw new ResourceNotFoundError('Endereço');
      return enderecoPrestador;
  }
}

export class AcharPorCidade {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(cidade: string): Promise<Endereco[] | null>{
      validarTexto(cidade, 'Cidade', 2, 100);
      const enderecosCidade = await this.enderecoRepository.findByCity(cidade);
      if (!enderecosCidade) throw new ResourceNotFoundError('Endereços');
      return enderecosCidade;
  }
}

export class SetarPrincipal {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<void>{
      validarUUID(id, 'ID do endereço');
      await this.enderecoRepository.setIsPrincipal(id);
  }
}

export class UnsetarPrincipal {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<void>{
      validarUUID(id, 'ID do endereço');
      await this.enderecoRepository.unsetIsPrincipal(id);
  }
}
