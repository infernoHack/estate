"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const chat_route_1 = __importDefault(require("./routes/chat.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const app = (0, express_1.default)();
const { CLIENT_URL, PORT = 8080 } = process.env;
app.use((0, cors_1.default)({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_route_1.default);
app.use("/api/users", user_route_1.default);
app.use("/api/posts", post_route_1.default);
app.use("/api/chats", chat_route_1.default);
app.use("/api/messages", message_route_1.default);
app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).send(message);
});
app.listen(PORT, () => {
    console.log("LISTENING AT PORT ", +PORT);
});
