import { Response } from "express";

import prisma from "../lib/prisma";
import { catchAsync } from "../utils";
import { RequestWithUser } from "../RequestWithUser.types";

export const addMessage = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { text } = req.body;
    const { id: chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIds: {
          hasSome: [req.user!],
        },
      },
    });

    if (!chat) {
      return res.status(404).send("Chat not found");
    }

    const newMessage = await prisma.message.create({
      data: {
        userId: req.user!,
        text,
        chatId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          set: [req.user!],
        },
        lastMessage: text,
      },
    });

    res.status(200).send(newMessage);
  }
);
