import { Response } from "express";

import prisma from "../lib/prisma";
import { catchAsync } from "../utils";
import { RequestWithUser } from "../RequestWithUser.types";

export const getChats = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const chats = await prisma.chat.findMany({
      where: {
        userIds: {
          hasSome: [req.user!],
        },
      },
    });

    const modifiedChats = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIds.find((id) => id !== req.user);

        const receiver = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
          select: {
            id: true,
            username: true,
            avatar: {
              select: {
                url: true,
              },
            },
          },
        });

        return { ...chat, receiver };
      })
    );

    res.status(200).send(modifiedChats);
  }
);

export const getChat = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    const chat = await prisma.chat.findUnique({
      where: {
        id,
        userIds: {
          hasSome: [req.user!],
        },
      },
      select: {
        id: true,
        userIds: true,
        seenBy: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        createdAt: true,
      },
    });

    const receiverId = chat!.userIds.find((id) => id !== req.user);

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatar: {
          select: {
            url: true,
          },
        },
      },
    });

    if (chat?.seenBy.includes(req.user!) === true) {
      return res.status(200).send({ ...chat, receiver });
    }

    // Return updated chat
    const updatedChat = await prisma.chat.update({
      where: {
        id,
      },
      data: {
        seenBy: {
          push: req.user,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).send({ ...updatedChat, receiver });
  }
);

export const addChat = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { receiverId } = req.body;

    const newChat = await prisma.chat.create({
      data: {
        userIds: [req.user!, receiverId],
      },
    });

    res.status(200).send(newChat);
  }
);

export const readChat = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    const chat = await prisma.chat.findUnique({
      where: {
        id,
        userIds: {
          hasSome: [req.user!],
        },
      },
    });

    if (chat?.seenBy.includes(req.user!)) {
      return res.status(200).send(chat);
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id,
        userIds: {
          hasSome: [req.user!],
        },
      },
      data: {
        seenBy: {
          push: req.user,
        },
      },
    });

    res.status(200).send(updatedChat);
  }
);
