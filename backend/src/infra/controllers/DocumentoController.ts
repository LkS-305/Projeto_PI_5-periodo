import { Request, Response } from "express";
import fs from "fs";

import {
  CriarDocumentoUseCase,
  DeletarDocumentoUseCase,
  AtualizarDocumentoUseCase,
  AcharPorUserId,
  AtualizarStatus,
} from "../../core/use-cases/documento/DocumentoUseCase";
import { logControllerError } from "../../core/utils/httpLogger";

export class DocumentoController {
  constructor(
    private criarDocumento: CriarDocumentoUseCase,
    private deletarDocumento: DeletarDocumentoUseCase,
    private atualizarDocumento: AtualizarDocumentoUseCase,
    private acharPorUserId: AcharPorUserId,
    private atualizarStatus: AtualizarStatus,
  ) {}

  async upload(req: Request, res: Response) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const documentoFile = files?.documento?.[0];
    const selfieFile = files?.selfie?.[0];

    try {
      if (!documentoFile || !selfieFile) {
        return res.status(400).json({ erro: "Envie a foto do documento e a selfie." });
      }

      const resultado = await this.criarDocumento.executar({
        user_id: req.body.user_id,
        tipo: req.body.tipo ?? "RG",
        numero_documento: req.body.numero_documento,
        arquivo_url: `/uploads/documentos/${documentoFile.filename}`,
        selfie_url: `/uploads/documentos/${selfieFile.filename}`,
      });

      return res.status(201).json(resultado);
    } catch (erro: any) {
      if (documentoFile?.path && fs.existsSync(documentoFile.path)) {
        fs.unlinkSync(documentoFile.path);
      }
      if (selfieFile?.path && fs.existsSync(selfieFile.path)) {
        fs.unlinkSync(selfieFile.path);
      }
      logControllerError('DocumentoController', 'upload', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deletarDocumento.executar(req.body.id);
      return res.status(200).json({ mensagem: "Documento deletado." });
    } catch (erro: any) {
      logControllerError('DocumentoController', 'delete', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarDocumento.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('DocumentoController', 'update', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      const resultado = await this.acharPorUserId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('DocumentoController', 'findByUserId', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const raw = req.params.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ erro: "Status é obrigatório." });
      }
      if (!id) {
        return res.status(400).json({ erro: "Id do documento é obrigatório." });
      }

      await this.atualizarStatus.executar(id, status);
      return res.status(200).json({ mensagem: "Status atualizado com sucesso." });
    } catch (erro: any) {
      logControllerError('DocumentoController', 'updateStatus', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }
}
