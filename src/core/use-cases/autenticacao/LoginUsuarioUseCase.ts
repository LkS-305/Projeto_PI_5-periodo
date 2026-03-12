import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDto } from '../../dtos/usuario';

import { IUserRepository } from '../../repositories/IUserRepository';
import { IAuditLogRepository } from '../../repositories/IAuditLogRepository';

export class LoginUseCase {
    constructor(
        private usuarioRepo: IUserRepository,
        private auditRepo: IAuditLogRepository
    ) {}

    async executar(dados: LoginDto) {
        // 1. Busca o usuário
        const usuario = await this.usuarioRepo.findByEmail(dados.email);

        // 2. Erro genérico para evitar enumeração de usuários (Segurança)
        if (!usuario) {
            throw new Error("E-mail ou senha incorretos");
        }

        // 3. Compara os hashes
        const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
        if (!senhaValida) {
            throw new Error("E-mail ou senha incorretos");
        }

        // 4. Gera o Token (Validade de 1 dia, por exemplo)
        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo_usuario },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '1d' }
        );

        // 5. Auditoria de Segurança
        await this.auditRepo.save({
            usuario_id: usuario.id!,
            acao: 'LOGIN',
            recurso: 'usuarios',
            recurso_id: usuario.id!,
        });

        // 6. Retorno (Não envie a senha de volta!)
        return {
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            token

    }
}
}
