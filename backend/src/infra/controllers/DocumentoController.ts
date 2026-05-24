import { Request, Response } from "express";

import {
  CriarDocumentoUseCase,
  DeletarDocumentoUseCase,
  AtualizarDocumentoUseCase,
  AcharPorUserId,
  AtualizarStatus,
  ListarDocumentosPendentes,
} from "../../core/use-cases/documento/DocumentoUseCase";

export class DocumentoController {
  constructor(
    private criarDocumento: CriarDocumentoUseCase,
    private deletarDocumento: DeletarDocumentoUseCase,
    private atualizarDocumento: AtualizarDocumentoUseCase,
    private acharPorUserId: AcharPorUserId,
    private atualizarStatus: AtualizarStatus,
    private listarPendentes: ListarDocumentosPendentes,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      const resultado = await this.criarDocumento.executar(req.body);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async upload(req: Request, res: Response) {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const documentoFile = files?.documento?.[0];
      const selfieFile = files?.selfie?.[0];

      if (!documentoFile || !selfieFile) {
        return res.status(400).json({
          erro: "Envie a foto do documento e a selfie.",
        });
      }

      const resultado = await this.criarDocumento.executar({
        user_id: req.body.user_id,
        tipo: req.body.tipo ?? "RG",
        numero_documento: req.body.numero_documento,
        arquivo_url: `/uploads/documentos/${documentoFile.filename}`,
        selfie_url: `/uploads/documentos/${selfieFile.filename}`,
        status: "pendente",
      });

      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deletarDocumento.executar(req.body.id);
      return res.status(200).json({ mensagem: "Documento deletado." });
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarDocumento.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const id = req.body.id || req.query.id;
      const resultado = await this.acharPorUserId.executar(String(id));
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findPendentes(req: Request, res: Response) {
    try {
      const resultado = await this.listarPendentes.executar();
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const status = req.body.status as "pendente" | "aprovado" | "rejeitado";

    if (!id) {
      return res.status(400).json({ erro: "ID do documento é obrigatório." });
    }

    await this.atualizarStatus.executar(id, status);

    return res.status(200).json({
      mensagem: "Status do documento atualizado com sucesso.",
    });
  } catch (erro: any) {
    return res.status(400).json({ erro: erro.message });
  }
}
}