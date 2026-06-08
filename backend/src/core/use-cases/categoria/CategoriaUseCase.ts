import { Categoria } from "../../entities/Categoria";
import { ICategoriaRepository } from "../../repositories/ICategoriaRepository";
import {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
} from "../../errors/AppError";
import {
  validarUUID,
  validarTexto,
  sanitizarTexto,
} from "../../utils/validate";
import { AtualizarCategoriaDto, CriarCategoriaDto } from "../../dtos/categoria";

export class CriarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async executar(dados: CriarCategoriaDto): Promise<Categoria> {
    validarTexto(dados.nome, "Nome", 2, 60);
    validarTexto(dados.slug, "Slug", 2, 60);
    dados.nome = sanitizarTexto(dados.nome);
    dados.slug = sanitizarTexto(dados.slug);

    const categoriaExiste = await this.categoriaRepository.findByName(
      dados.nome,
    );

    if (categoriaExiste) {
      throw new ResourceAlreadyExistsError("Esta categoria ja existe");
    }

    const novaCategoria = new Categoria({ ...dados });
    await this.categoriaRepository.create(novaCategoria);
    return novaCategoria;
  }
}

export class DeletarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async executar(id: string): Promise<boolean> {
    validarUUID(id, "ID da categoria");
    await this.categoriaRepository.delete(id);
    return true;
  }
}

export class AtualizarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async executar(dados: AtualizarCategoriaDto) {
    validarUUID(dados.id, "ID da categoria");
    if (dados.nome) {
      validarTexto(dados.nome, "Nome", 2, 60);
      dados.nome = sanitizarTexto(dados.nome);
    }
    if (dados.slug) {
      validarTexto(dados.slug, "Slug", 2, 60);
      dados.slug = sanitizarTexto(dados.slug);
    }

    const categoriaExiste = await this.categoriaRepository.findById(dados.id);

    if (!categoriaExiste) {
      throw new ResourceNotFoundError("Categoria");
    }

    const categoriaInstanciada = new Categoria(categoriaExiste);
    categoriaInstanciada.atualizarCategoria(dados);

    await this.categoriaRepository.update(categoriaInstanciada);
    return categoriaInstanciada;
  }
}

export class PesquisarPorId {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async executar(id: string) {
    validarUUID(id, "ID da categoria");
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) throw new ResourceNotFoundError("Categoria");
    return categoria;
  }
}

export class PesquisarTudo {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async executar() {
    return await this.categoriaRepository.findAll();
  }
}

export class PesquisarPorNome {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async executar(nome: string) {
    validarTexto(nome, "Nome", 2, 60);
    return await this.categoriaRepository.findByName(nome);
  }
}
