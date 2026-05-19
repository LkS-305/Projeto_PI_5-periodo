import { Documento } from '../../entities/Documento';
import { IDocumentoRepository } from '../../repositories/IDocumentoRepository';
import { AtualizarDocumentoDto, CriarDocumentoDto, verificacaoStatus } from '../../dtos/documento';
import { IUserRepository } from '../../repositories/IUserRepository';
import { ResourceNotFoundError, ValidationError } from '../../errors/AppError';
import { validarUUID, validarTexto, validarCEP, sanitizarTexto } from '../../utils/validate';

export class CriarDocumentoUseCase {
    constructor(private documentoRepository: IDocumentoRepository, private userRepository: IUserRepository){}

    async executar(dados: CriarDocumentoDto): Promise<Documento>{
      const usuario = await this.userRepository.findById(dados.user_id);

      if (!usuario) throw new ResourceNotFoundError('Usuário');

      const documento = new Documento(dados);
      await this.documentoRepository.create(documento);
      return documento;
  }
}


export class DeletarDocumentoUseCase {
    constructor(private documentoRepository: IDocumentoRepository){}

    async executar(id: string): Promise<void>{
      validarUUID(id, 'ID do endereço');
      await this.documentoRepository.delete(id);
  }
}

export class AtualizarDocumentoUseCase {
    constructor(private documentoRepository: IDocumentoRepository){}

    async executar(dados: AtualizarDocumentoDto): Promise<Documento>{
     
      const documento = await this.documentoRepository.findByUserId(dados.user_id);
     
    if (!documento) throw new ResourceNotFoundError('Endereço');

      const documentoInstanciado = new Documento(documento);
      documentoInstanciado.atualizarDocumento(dados);
      await this.documentoRepository.update(documentoInstanciado);
      return documentoInstanciado;
  }
}

export class AcharPorUserId {
    constructor(private documentoRepository: IDocumentoRepository){}

    async executar(id: string): Promise<Documento>{
      validarUUID(id, 'ID do usuário');
      const documentoUsuario = await this.documentoRepository.findByUserId(id);
      if (!documentoUsuario) throw new ResourceNotFoundError('Endereço');
      return documentoUsuario;
  }
}

export class AtualizarStatus {
    constructor(private documentoRepository: IDocumentoRepository){}

    async executar(id: string, novoStatus: verificacaoStatus): Promise<void>{
      validarUUID(id, 'ID do endereço');
    const documento =  await this.documentoRepository.findByUserId(id);
    
    if (!documento) throw new ResourceNotFoundError('documento em atualizar status');
    
    const documentoInstanciado = new Documento(documento);
    documentoInstanciado.atualizarStatus(novoStatus);
  }
}
