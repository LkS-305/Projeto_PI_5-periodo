import { Request, Response } from 'express';
import { Endereco } from '../../entities/Endereco';
import { IEnderecoRepository } from '../../repositories/IEnderecoRepository';
import { AtualizarEnderecoDto, CriarEnderecoDto } from '../../dtos/endereco';
import { IUserRepository } from '../../repositories/IUserRepository';

export class CriarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository, private usuarioRepository: IUserRepository){}

    async executar(dados: CriarEnderecoDto): Promise<Endereco>{
      const usuario = await this.usuarioRepository.findById(dados.user_id);

      if (!usuario) {
        throw new Error('Erro ao criar endereco, usuario inexistente');
    }
     const endereco = new Endereco(dados);

     if (!endereco) {
      throw new Error('Erro ao instanciar endereco');
    }
    
     const enderecoCriado = await this.enderecoRepository.create(endereco);
     
    if (!enderecoCriado) {
      throw new Error('Erro ao criar endereco');
    }
    return enderecoCriado
  }
}


export class DeletarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<void>{
     await this.enderecoRepository.delete(id);
  }
}


export class AtualizarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(dados: AtualizarEnderecoDto): Promise<Endereco>{

     const endereco = await this.enderecoRepository.findById(dados.id);

      if(!endereco) {
      throw new Error('Este endereco nao existe.');
    }

     endereco.editEndereco(dados);
     const enderecoAtualizado = await this.enderecoRepository.update(endereco);


     if (!enderecoAtualizado) {
      throw new Error('Erro ao atualizar endereco');

    }
      return enderecoAtualizado;

  }
}


export class AcharPorUserId {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<Endereco>{
     const enderecoUsuario = await this.enderecoRepository.findByUserId(id);

     if (!enderecoUsuario) {
      throw new Error('Erro ao achar endereco pelo user id');

    }

    return enderecoUsuario;
 

  }
}


export class AcharPorPrestadorId {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<Endereco>{
     const enderecoPrestador = await this.enderecoRepository.findByPrestadorId(id);

     if (!enderecoPrestador) {
      throw new Error('Erro ao achar o endereco pelo prestador id');

    }

    return enderecoPrestador;
 

  }
}


export class AcharPorCidade {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(cidade: string): Promise<Endereco[] | null>{
     const enderecosCidade = await this.enderecoRepository.findByCity(cidade);

     if (!enderecosCidade) {
      throw new Error('Erro ao procurar endereco por cidade');

    }
      return enderecosCidade;

  }
}


export class SetarPrincipal {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<void>{
     await this.enderecoRepository.setIsPrincipal(id);
  }
}


export class UnsetarPrincipal {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(id: string): Promise<void>{
      await this.enderecoRepository.unsetIsPrincipal(id);
  }
}
