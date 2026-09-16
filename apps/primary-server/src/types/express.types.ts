// types/express.types.ts (or similar)
import type { Session } from "better-auth/types"; 
import "express";

declare global {
  namespace Express {
    interface Request {
      session?: Session | unknown; 
    }
  }
}