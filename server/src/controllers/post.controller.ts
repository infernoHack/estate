import { Request, Response } from "express";

import prisma from "../lib/prisma";
import { catchAsync } from "../utils";
import cloudinary from "../cloudinary";
import AppError from "../AppError";
import { RequestWithUser } from "../RequestWithUser.types";

type Property = "apartment" | "house" | "condo" | "land";
type Transaction = "buy" | "rent";

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const {
    city,
    transaction,
    property,
    bedrooms,
    minPrice,
    maxPrice,
  }: {
    city?: string;
    transaction?: Transaction;
    property?: Property;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
  } = req.query;

  const posts = await prisma.post.findMany({
    where: {
      city,
      transaction,
      property,
      features: {
        is: {
          sizes: {
            is: {
              bedrooms: {
                gte: bedrooms ? parseInt(bedrooms) : undefined,
              },
            },
          },
        },
      },
      price: {
        gte: minPrice ? parseInt(minPrice) : undefined,
        lte: maxPrice ? parseInt(maxPrice) : undefined,
      },
    },
    select: {
      id: true,
      title: true,
      images: true,
      price: true,
      address: true,
      latitude: true,
      longitude: true,
      transaction: true,
      property: true,
      features: true,
      user: {
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
        },
      },
    },
  });

  res.status(200).send(posts);
});

export const getPost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          avatar: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    throw new AppError(404, "House not found");
  }

  res.status(200).send(post);
});

export const addPost = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const {
      title,
      price,
      city,
      address,
      latitude,
      longitude,
      description,
      transaction,
      property,
      images,
      features,
    } = req.body;

    const userId = req.user!;

    const newPost = await prisma.post.create({
      data: {
        title,
        price,
        images,
        latitude,
        longitude,
        city,
        address,
        description,
        transaction,
        property,
        features,
        userId,
      },
    });

    res.status(200).send(newPost);
  }
);

export const updatePost = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    const {
      title,
      price,
      images,
      latitude,
      longitude,
      city,
      address,
      description,
      transaction,
      property,
      features,
    } = req.body;

    // Verify the owner
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
        images: true,
      },
    });

    if (post?.userId !== req.user) {
      return res.status(403).send("You aren't authorized");
    }

    // if (images) {
    //   // Delete the previous one from cloudinary by first finding the avatar and then deleting it.

    //   if (user?.avatar?.filename) {
    //     cloudinary.uploader
    //       .destroy(user.avatar.public_id, { invalidate: true })
    //       .then((result) => console.log(result));
    //   }
    // }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        ...(title && { title }),
        ...(price && { price }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
        ...(city && { city }),
        ...(address && { address }),
        ...(description && { description }),
        ...(transaction && { transaction }),
        ...(property && { property }),
        ...(features && { features }),
      },
    });

    res.status(200).send(updatedPost);
  }
);

export const deletePost = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    // Verify the owner
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
        images: true,
      },
    });

    if (post?.userId !== req.user) {
      return res.status(403).send("You aren't authorized");
    }

    for (const image of post?.images || []) {
      cloudinary.uploader
        .destroy(image.public_id, { invalidate: true })
        .then((result) => console.log(result));
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    res.status(200).send("Post deleted successfully");
  }
);
