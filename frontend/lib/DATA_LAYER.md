# Camada de dados (frontend)

## Direção preferida

- **Chamadas HTTP**: preferir `ClientGateway` (e outros gateways em `lib/gateways/`) com `apiClient` em `lib/api/client.ts` como fronteira única para a API REST.
- **Hooks de página**: podem encapsular estado e efeitos, mas a origem dos dados deve ser o gateway + tipos em `types/`.

## Gateways por domínio

- Para além de `ClientGateway`, use gateways em `lib/gateways/` (ex.: `AvaliacaoGateway`) quando o endpoint for específico; mantenham todos o mesmo padrão (`apiClient` + cabeçalhos de auth quando aplicável).
