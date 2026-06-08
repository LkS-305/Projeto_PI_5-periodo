import "./payments.css";
import { OPCOES_PAGAMENTO_SERVICO } from "@/lib/constants/pagamentoServico";

export default function Payments() {
  return (
    <div className="settings-section-card">
      <h3 className="settings-section-card__title">Pagamentos</h3>
      <p className="settings-section-card__text">
        Ao pagar um serviço acordado, o botão <strong>Pagar serviço</strong> fica em{" "}
        <strong>Mensagens</strong> — na faixa <strong>logo acima do campo de texto</strong> da conversa desse
        contrato (ou no painel «Acordo e pagamento»). Também podes abrir o contrato em <strong>Contratos</strong> e
        usar o atalho <strong>Ir pagar em Mensagens</strong>.
      </p>
      <ul className="settings-payments-list">
        {OPCOES_PAGAMENTO_SERVICO.map((op) => (
          <li key={op.id}>
            <strong>{op.label}</strong> — {op.descricao}
          </li>
        ))}
      </ul>
      <p className="settings-section-card__text settings-section-card__text--muted">
        É necessário CPF e e-mail na conta, chave de API Asaas configurada no servidor e conta Asaas com os meios de
        pagamento pretendidos ativos (sandbox para testes).
      </p>
    </div>
  );
}
