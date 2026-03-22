import { Request } from "express";

export interface AuthRequest extends Request {
  user?: any; // or proper User type if you have
}