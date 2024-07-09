"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const utils_1 = require("../utils");
const COOKIE_AGE = 1000 * 60 * 60 * 24;
const { JWT_SECRET } = process.env;
exports.register = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, fullname, email, password, avatar } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const newUser = yield prisma_1.default.user.create({
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
    const token = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET, {
        expiresIn: COOKIE_AGE,
    });
    res
        .status(200)
        .cookie("authorization", token, {
        maxAge: COOKIE_AGE,
        httpOnly: true,
        sameSite: true,
    })
        .send(newUser);
}));
exports.login = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma_1.default.user.findUnique({
        where: { username },
        include: { avatar: true },
    });
    if (!user) {
        return res.status(401).send("Invalid credentials");
    }
    const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).send("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: COOKIE_AGE,
    });
    // Remove the password from the response
    const { password: userPassword } = user, others = __rest(user, ["password"]);
    res
        .status(200)
        .cookie("authorization", token, {
        maxAge: COOKIE_AGE,
        httpOnly: true,
        sameSite: true,
    })
        .send(others);
}));
const logout = (req, res) => {
    res.status(200).clearCookie("authorization").send("Logged out successfully");
};
exports.logout = logout;
