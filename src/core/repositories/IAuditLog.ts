import { AuditLog } from '../entities/AuditLog';

export interface IAuditLog {
  save(auditLog: AuditLog): Promise<void>;
  findById(id: string): Promise<AuditLog | null>;

}
