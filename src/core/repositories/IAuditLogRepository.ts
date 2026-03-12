import { AuditLog } from '../entities/AuditLog';

export interface IAuditLogRepository {
  save(auditLog: AuditLog): Promise<void>;
  findById(id: string): Promise<AuditLog | null>;

}
