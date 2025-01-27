import { IAdmin } from '../models/admin';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
    }
  }
}