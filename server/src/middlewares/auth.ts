import { NextFunction, Response } from "express";
import Jwt from "jsonwebtoken";

import { catchAsync } from "../utils";
import AppError from "../AppError";
import { RequestWithUser } from "../RequestWithUser.types";
import prisma from "../lib/prisma";

export const verifyToken = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { authorization } = req.cookies;

    if (!authorization) {
      throw new AppError(401, "Not authenticated");
    }

    Jwt.verify(
      authorization,
      process.env.JWT_SECRET!,
      async function (
        err: Jwt.VerifyErrors | null,
        decoded: Jwt.JwtPayload | string | undefined
      ) {
        if (err) {
          throw new AppError(403, "Token is not valid");
        }

        if (typeof decoded !== "string" && decoded?.id) {
          req.user = decoded.id;
        } else {
          throw new AppError(403, "Token format is incorrect");
        }

        next();
      }
    );
  }
);

export const authorizeUser = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (req.user !== id) {
      throw new AppError(401, "Not authorized");
    }

    next();
  }
);

export const authorizePostOwner = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user!;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (userId !== post?.userId) {
      throw new AppError(403, "You aren't authorized to update this.");
    }

    next();
  }
);

export const authorizeChatParticipant = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user!;

    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
      select: {
        userIds: true,
      },
    });

    if (chat?.userIds.includes(userId) === false) {
      throw new AppError(403, "You aren't authorized to read this.");
    }

    next();
  }
);
