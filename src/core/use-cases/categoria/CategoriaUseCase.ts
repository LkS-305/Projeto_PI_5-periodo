import { Categoria } from '../../entities/Categoria';
import { ICategoriaRepository } from '../../repositories/ICategoriaRepository';

export class CriarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(dados: any) {
   const categoriaExiste = await this.categoriaRepository.findByName(dados.nome);
   if (categoriaExiste) {
      throw new Error('Esta categoria ja existe');
    }
   const novaCategoria = new Categoria({...dados});
   const categoriaSalva = await this.categoriaRepository.create(novaCategoria);
   return categoriaSalva;
  }
}

export class DeletarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(id: string) {
   const bool = await this.categoriaRepository.delete(id);
   return bool;
  }
}



export class AtualizarCategoriaUseCase {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(id: string, categ: Categoria) {
   const categoria = await this.categoriaRepository.update(id, categ);
   return categoria;
  }
}

export class PesquisarPorId {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(id: string) {
   const categoria = await this.categoriaRepository.findById(id);
   return categoria;
  }
}

export class PesquisarTudo {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar() {
   const categorias = await this.categoriaRepository.findAll();
   return categorias;
  }
}

export class PesquisarPorNome {
  constructor(private categoriaRepository: ICategoriaRepository){}

  async executar(nome: string) {
   const categoria = await this.categoriaRepository.findByName(nome);
   return categoria;
  }
}
