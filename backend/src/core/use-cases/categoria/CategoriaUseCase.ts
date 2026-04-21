import { Categoria } from '../../entities/Categoria';
import { ICategoriaRepository } from '../../repositories/ICategoriaRepository';
import { ResourceAlreadyExistsError, ResourceNotFoundError } from '../../errors/AppError';
import { validarUUID, validarTexto, sanitizarTexto } from '../../utils/validate';

export class CriarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(dados: any) {
    validarTexto(dados.nome, 'Nome', 2, 60);
    validarTexto(dados.slug, 'Slug', 2, 60);
    dados.nome = sanitizarTexto(dados.nome);
    dados.slug = sanitizarTexto(dados.slug);

    const categoriaExiste = await this.categoriaRepository.findByName(dados.nome);
    if (categoriaExiste) {
      throw new ResourceAlreadyExistsError('Esta categoria ja existe');
    }
    const novaCategoria = new Categoria({...dados});
    return await this.categoriaRepository.create(novaCategoria);
  }
}

export class DeletarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(id: string) {
    validarUUID(id, 'ID da categoria');
    return await this.categoriaRepository.delete(id);
  }
}

export class AtualizarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(id: string, categ: Categoria) {
    validarUUID(id, 'ID da categoria');
    if (categ.nome) { validarTexto(categ.nome, 'Nome', 2, 60); categ.nome = sanitizarTexto(categ.nome); }
    if (categ.slug) { validarTexto(categ.slug, 'Slug', 2, 60); categ.slug = sanitizarTexto(categ.slug); }
    return await this.categoriaRepository.update(id, categ);
  }
}

export class PesquisarPorId {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(id: string) {
    validarUUID(id, 'ID da categoria');
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) throw new ResourceNotFoundError('Categoria');
    return categoria;
  }
}

export class PesquisarTudo {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar() {
    return await this.categoriaRepository.findAll();
  }
}

export class PesquisarPorNome {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(nome: string) {
    validarTexto(nome, 'Nome', 2, 60);
    return await this.categoriaRepository.findByName(nome);
  }
}
