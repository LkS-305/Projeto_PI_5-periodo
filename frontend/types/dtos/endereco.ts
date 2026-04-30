export interface CriarEnderecoDto {
    user_id: string,
    rotulo: string,
    logradouro: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,
    is_principal: boolean,

    complemento?: string, 
}

export interface AtualizarEnderecoDto {
    id: string,
    rotulo?: string,
    logradouro?: string,
    numero?: string,
    bairro?: string,
    cidade?: string,
    estado?: string,
    cep?: string,
    latitude?: number,
    longitude?: number,
    is_principal: boolean,

    complemento?: string, 
}


export interface RetornoApi {
  cep: string,
  logradouro: string,
  complemento: string | null,
  unidade: string | null, //numero
  bairro: string,
  localidade: string, //cidade
  uf: string, //fds
  estado:  string,
  regiao: string,
  ibge: string, //fds
  gia: string, //fds
  ddd: string, //fds
  siafi: string, //fds
  erro?: boolean,
}


