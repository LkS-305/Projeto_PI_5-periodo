import { UserType } from '../../core/dtos/user';

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
