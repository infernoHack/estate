import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../lib/prisma";
import { catchAsync } from "../utils";
import cloudinary from "../cloudinary";
import { RequestWithUser } from "../RequestWithUser.types";

type User = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  chatIds: string[];
  createdAt: Date;
  avatar: {
    id: string;
    url: string;
    filename: string;
    public_id: string;
    userId: string;
    createdAt: Date;
  } | null;
  savedPosts: {
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    address: string;
    transaction: string;
    property: string;
    images: {
      filename: string;
      url: string;
      public_id: string;
    }[];
    features: {
      sizes: {
        house: number;
        bedrooms: number;
        bathrooms: number;
      };
    };
  }[];
};

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { avatar: true } });

  const usersWithoutPassword = users.map((user: User) => {
    return {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      avatar: {
        id: user.avatar?.id,
        filename: user.avatar?.filename,
        url: user.avatar?.url,
        public_id: user.avatar?.public_id,
      },
    };
  });

  res.status(200).send(usersWithoutPassword);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      fullname: true,
      email: true,
      avatar: {
        select: {
          id: true,
          filename: true,
          url: true,
          public_id: true,
        },
      },
      posts: {
        select: {
          id: true,
          title: true,
          price: true,
          latitude: true,
          longitude: true,
          address: true,
          transaction: true,
          property: true,
          images: true,
          features: {
            select: {
              sizes: true,
            },
          },
        },
      },
      savedPosts: {
        select: {
          id: true,
          title: true,
          price: true,
          latitude: true,
          longitude: true,
          address: true,
          transaction: true,
          property: true,
          images: true,
          features: {
            select: {
              sizes: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(200).send("User not found");
  }

  res.status(200).send(user);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { fullname, email, password, avatar } = req.body;

  let newPassword = null;
  if (password) {
    newPassword = await bcrypt.hash(password, 12);
  }

  if (avatar) {
    // Delete the previous one from cloudinary by first finding the avatar and then deleting it.
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        avatar: true,
      },
    });

    if (user?.avatar?.filename) {
      cloudinary.uploader
        .destroy(user.avatar.public_id, { invalidate: true })
        .then((result) => console.log(result));
    }
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      fullname,
      email,
      ...(newPassword && { password: newPassword }),
      ...(avatar && {
        avatar: {
          update: avatar,
        },
      }),
    },
    select: {
      id: true,
      username: true,
      fullname: true,
      email: true,
      avatar: {
        select: {
          id: true,
          filename: true,
          url: true,
          public_id: true,
        },
      },
    },
  });

  res.status(200).send(user);
});

export const updateUserSavedPosts = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { id } = req.body;

    const foundUser = await prisma.user.findUnique({
      where: {
        id: req.user,
      },
      select: {
        savedPosts: {
          select: {
            id: true,
          },
        },
      },
    });

    if (foundUser!.savedPosts.some((item: { id: string }) => item.id === id)) {
      const updatedUser = await prisma.user.update({
        where: {
          id: req.user,
        },
        data: {
          savedPosts: {
            deleteMany: {
              where: {
                id,
              },
            },
          },
        },
        select: {
          savedPosts: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      return res
        .status(200)
        .send({ ...updatedUser, message: "Post deleted successfully" });
    } else {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });

      if (!post) {
        return res.status(404).send("Post not found");
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: req.user,
        },
        data: {
          savedPosts: {
            push: [
              {
                id: post?.id,
                title: post?.title,
                images: post.images,
                price: post?.price,
                latitude: post?.latitude,
                longitude: post?.longitude,
                address: post?.address,
                transaction: post?.transaction,
                property: post?.property,
                features: post?.features,
              },
            ],
          },
        },
        select: {
          savedPosts: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      return res
        .status(200)
        .send({ ...updatedUser, message: "Post saved successfully" });
    }
  }
);

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: {
      id,
    },
  });

  res.status(200).send("User deleted successfully");
});
