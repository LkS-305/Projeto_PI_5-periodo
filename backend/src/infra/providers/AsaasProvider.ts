import { AppError } from '../../core/errors/AppError';

export interface AsaasPixResponse {
  asaas_payment_id: string;
  invoiceUrl: string;
  pixQrCodeImage: string | null;
  pixCopyPaste: string | null;
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

  // Returns existing Asaas customer id or creates a new one
  async criarOuBuscarCliente(cpf: string, nome: string, email: string): Promise<string> {
    const cpfLimpo = cpf.replace(/\D/g, '');

    const searchRes = await fetch(
      `${this.baseUrl}/customers?cpfCnpj=${cpfLimpo}`,
      { headers: this.headers() },
    );
    if (!searchRes.ok) throw new AppError('Falha ao consultar clientes no Asaas', 502);

    const searchData = await searchRes.json();
    if (searchData.data?.length > 0) return searchData.data[0].id;

    const createRes = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ name: nome, cpfCnpj: cpfLimpo, email }),
    });
    if (!createRes.ok) throw new AppError('Falha ao criar cliente no Asaas', 502);

    const customer = await createRes.json();
    return customer.id;
  }

  async criarCobrancaPix(
    customerId: string,
    valor: number,
    descricao: string,
  ): Promise<AsaasPixResponse> {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const payRes = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: valor,
        dueDate: dueDate.toISOString().split('T')[0],
        description: descricao,
      }),
    });
    if (!payRes.ok) throw new AppError('Falha ao criar cobrança no Asaas', 502);
    const payment = await payRes.json();

    // Fetch Pix QR code
    const pixRes = await fetch(
      `${this.baseUrl}/payments/${payment.id}/pixQrCode`,
      { headers: this.headers() },
    );
    const pixData = pixRes.ok ? await pixRes.json() : {};

    return {
      asaas_payment_id: payment.id,
      invoiceUrl:       payment.invoiceUrl ?? null,
      pixQrCodeImage:   pixData.encodedImage ?? null,
      pixCopyPaste:     pixData.payload      ?? null,
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
