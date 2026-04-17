import { UserType } from '../../core/dtos/usuario';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tipo: UserType;
      };
    }
  }
}
