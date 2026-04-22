import { AccessPayload } from "../your-path";

declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}