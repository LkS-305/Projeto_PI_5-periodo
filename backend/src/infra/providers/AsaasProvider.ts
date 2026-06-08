import { AppError } from '../../core/errors/AppError';

/** Tipos de cobrança suportados na API Asaas v3 (criação de pagamento). */
export type AsaasBillingType = 'PIX' | 'BOLETO' | 'UNDEFINED';

export interface AsaasCobrancaResult {
  asaas_payment_id: string;
  invoiceUrl: string | null;
  pixQrCodeImage: string | null;
  pixCopyPaste: string | null;
  bankSlipUrl: string | null;
  identificationField: string | null;
}

export class AsaasProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.ASAAS_BASE_URL ?? 'https://sandbox.asaas.com/api/v3';
    this.apiKey  = process.env.ASAAS_API_KEY  ?? '';
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
    };
  }

  /**
   * Devolve o `id` do cliente no Asaas. Com CPF válido, pesquisa/cria por `cpfCnpj`;
   * sem CPF, tenta por e-mail e cria só com nome+e-mail (o Asaas pode exigir CPF para PIX em produção).
   */
  async criarOuBuscarCliente(cpf: string, nome: string, email: string): Promise<string> {
    const nomeTrim = (nome || '').trim() || 'Cliente';
    const emailTrim = (email || '').trim();
    if (!emailTrim) {
      throw new AppError('E-mail do pagador é obrigatório para o Asaas.', 400);
    }

    const cpfLimpo = (cpf || '').replace(/\D/g, '');

    if (cpfLimpo.length >= 11) {
      const searchCpf = await fetch(
        `${this.baseUrl}/customers?cpfCnpj=${encodeURIComponent(cpfLimpo)}`,
        { headers: this.headers() },
      );
      if (!searchCpf.ok) throw new AppError('Falha ao consultar clientes no Asaas', 502);
      const porCpf = await searchCpf.json();
      if (porCpf.data?.length > 0) return porCpf.data[0].id;
    }

    const searchEmail = await fetch(
      `${this.baseUrl}/customers?email=${encodeURIComponent(emailTrim)}`,
      { headers: this.headers() },
    );
    if (searchEmail.ok) {
      const porEmail = await searchEmail.json();
      if (porEmail.data?.length > 0) return porEmail.data[0].id;
    }

    const payload: Record<string, string> = {
      name: nomeTrim,
      email: emailTrim,
    };
    if (cpfLimpo.length >= 11) {
      payload.cpfCnpj = cpfLimpo;
    }

    const createRes = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    if (!createRes.ok) {
      const errBody = await createRes.json().catch(() => ({} as Record<string, unknown>));
      const first =
        Array.isArray((errBody as { errors?: { description?: string }[] }).errors) &&
        (errBody as { errors: { description?: string }[] }).errors[0]?.description;
      const msg =
        first ||
        (errBody as { message?: string }).message ||
        'Falha ao criar cliente no Asaas (verifica CPF, e-mail ou regras da conta no sandbox).';
      throw new AppError(String(msg), 502);
    }

    const customer = await createRes.json();
    return customer.id;
  }

  /**
   * Cria cobrança no Asaas: PIX (com QR), BOLEto (PDF + linha digitável) ou UNDEFINED
   * (fatura onde o pagador escolhe cartão, PIX ou boleto, conforme a conta Asaas).
   */
  async criarCobranca(
    customerId: string,
    valor: number,
    descricao: string,
    billingType: AsaasBillingType,
  ): Promise<AsaasCobrancaResult> {
    const dueDate = new Date();
    // Boleto costuma precisar de prazo; UNDEFINED/PIX seguem com vencimento curto
    const addDays = billingType === 'BOLETO' ? 5 : 1;
    dueDate.setDate(dueDate.getDate() + addDays);

    const payRes = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        customer: customerId,
        billingType,
        value: valor,
        dueDate: dueDate.toISOString().split('T')[0],
        description: descricao,
      }),
    });
    if (!payRes.ok) throw new AppError('Falha ao criar cobrança no Asaas', 502);
    const payment = await payRes.json();

    let pixQrCodeImage: string | null = null;
    let pixCopyPaste: string | null = null;
    if (billingType === 'PIX') {
      const pixRes = await fetch(
        `${this.baseUrl}/payments/${payment.id}/pixQrCode`,
        { headers: this.headers() },
      );
      const pixData = pixRes.ok ? await pixRes.json() : {};
      pixQrCodeImage = pixData.encodedImage ?? null;
      pixCopyPaste = pixData.payload ?? null;
    }

    return {
      asaas_payment_id: payment.id,
      invoiceUrl:       payment.invoiceUrl ?? null,
      pixQrCodeImage,
      pixCopyPaste,
      bankSlipUrl:         payment.bankSlipUrl ?? null,
      identificationField: payment.identificationField ?? null,
    };
  }

  async reembolsarCobranca(asaasPaymentId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/payments/${asaasPaymentId}/refund`, {
      method: 'POST',
      headers: this.headers(),
    });
    if (!res.ok) throw new AppError('Falha ao reembolsar cobrança no Asaas', 502);
  }

  async buscarStatus(asaasPaymentId: string): Promise<string> {
    const res = await fetch(
      `${this.baseUrl}/payments/${asaasPaymentId}`,
      { headers: this.headers() },
    );
    if (!res.ok) throw new AppError('Falha ao consultar status no Asaas', 502);
    const data = await res.json();
    return data.status;
  }
}
