import { Request, Response, NextFunction } from 'express';

export async function ErrorHandling(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await next();
  console.log(`Request...`);
}
