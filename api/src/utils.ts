/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncFunction): AsyncFunction => {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    return fn(req, res, next).catch((e) => next(e));
  };
};
