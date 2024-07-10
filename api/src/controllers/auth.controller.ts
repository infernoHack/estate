import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

import prisma from "../lib/prisma";
import { catchAsync } from "../utils";

const COOKIE_AGE = 1000 * 60 * 60 * 24;
const { JWT_SECRET } = process.env;

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, fullname, email, password, avatar } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      username,
      fullname,
      email,
      password: hashedPassword,
      avatar: {
        create: {
          url: avatar.url,
          filename: avatar.filename,
          public_id: avatar.public_id,
        },
      },
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

  const token = Jwt.sign({ id: newUser.id }, JWT_SECRET!, {
    expiresIn: COOKIE_AGE,
  });

  res
    .status(200)
    .cookie("authorization", token, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
      sameSite: false,
      secure: true,
    })
    .send(newUser);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { avatar: true },
  });

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).send("Invalid credentials");
  }

  const token = Jwt.sign({ id: user.id }, JWT_SECRET!, {
    expiresIn: COOKIE_AGE,
  });

  // Remove the password from the response
  const { password: userPassword, ...others } = user;

  res
    .status(200)
    .cookie("authorization", token, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
      sameSite: false,
      secure: true,
    })
    .send(others);
});

export const logout = (req: Request, res: Response) => {
  res.status(200).clearCookie("authorization").send("Logged out successfully");
};
