import { IEnderecoRepository } from "../../repositories/IEnderecoRepository";
import { ResourceNotFoundError, ValidationError } from "../../errors/AppError";
import { validarUUID } from "../../utils/validate";
import { haversine } from "../../utils/haversine";

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

async function geocodificarCep(
  cep: string,
): Promise<{ lat: number; lon: number }> {
  const sanitized = cep.replace(/\D/g, "");

  const viaCepRes = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
  if (!viaCepRes.ok) throw new ValidationError("Falha ao consultar ViaCEP.");
  const viaCep: ViaCepResponse = await viaCepRes.json();
  if (viaCep.erro) throw new ValidationError(`CEP ${cep} não encontrado.`);

  const headers = { "User-Agent": "ProjetoPI/1.0" };

  const queryCompleto = encodeURIComponent(
    `${viaCep.logradouro}, ${viaCep.bairro}, ${viaCep.localidade}, ${viaCep.uf}, Brasil`,
  );
  const resCompleto = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${queryCompleto}&format=json&limit=1`,
    { headers },
  );
  if (!resCompleto.ok)
    throw new ValidationError("Falha ao consultar geocodificação.");
  let data: NominatimResult[] = await resCompleto.json();

  if (!data.length) {
    const queryCidade = encodeURIComponent(
      `${viaCep.localidade}, ${viaCep.uf}, Brasil`,
    );
    const resCidade = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${queryCidade}&format=json&limit=1`,
      { headers },
    );
    if (!resCidade.ok)
      throw new ValidationError("Falha ao consultar geocodificação.");
    data = await resCidade.json();
  }

  if (!data.length)
    throw new ValidationError(
      `Endereço do CEP ${cep} não encontrado na geocodificação.`,
    );

  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export class CalcularDistanciaUseCase {
  constructor(private enderecoRepository: IEnderecoRepository) {}

  async executar(
    user_id: string,
    prestador_id: string,
  ): Promise<{ distancia_km: number }> {
    validarUUID(user_id, "ID do usuário");
    validarUUID(prestador_id, "ID do prestador");

    const enderecoUsuario = await this.enderecoRepository.findByUserId(user_id);
    if (!enderecoUsuario)
      throw new ResourceNotFoundError("Endereço do usuário");

    const enderecoPrestador =
      await this.enderecoRepository.findByPrestadorId(prestador_id);
    if (!enderecoPrestador)
      throw new ResourceNotFoundError("Endereço do prestador");

    const [coordsUsuario, coordsPrestador] = await Promise.all([
      geocodificarCep(enderecoUsuario.cep),
      geocodificarCep(enderecoPrestador.cep),
    ]);

    const distancia_km = parseFloat(
      haversine(
        coordsUsuario.lat,
        coordsUsuario.lon,
        coordsPrestador.lat,
        coordsPrestador.lon,
      ).toFixed(1),
    );

    return { distancia_km };
  }
}
