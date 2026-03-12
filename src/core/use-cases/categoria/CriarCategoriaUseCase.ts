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
