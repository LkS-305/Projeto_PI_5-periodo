export interface CriarEnderecoDto {
    user_id: string,
    rotulo: string,
    logradouro: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,
    latitude?: number,
    longitude?: number,
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

