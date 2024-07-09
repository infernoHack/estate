"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}
exports.default = AppError;
