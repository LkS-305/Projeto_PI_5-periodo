const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const DocumentoGateway = {
  async enviarDocumentos(
    dados: {
      user_id: string;
      tipo: 'RG' | 'CNH' | 'Antecedentes';
      numero_documento?: string;
      documento: File;
      selfie: File;
    },
    token: string,
  ) {
    const formData = new FormData();
    formData.append('user_id', dados.user_id);
    formData.append('tipo', dados.tipo);
    formData.append('numero_documento', dados.numero_documento ?? '');
    formData.append('documento', dados.documento);
    formData.append('selfie', dados.selfie);

    const response = await fetch(`${API_URL}/documento/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // SEM Content-Type — o browser define automaticamente com o boundary correto
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.erro || error.message || 'Erro ao enviar documentos.');
    }

    return response.json();
  },
};
