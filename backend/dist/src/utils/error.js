"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.RateLimitError = exports.NotFoundError = exports.ForbiddenError = exports.AuthError = exports.BadRequestError = exports.GenericError = void 0;
class GenericError extends Error {
    constructor(name, statusCode, message) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.GenericError = GenericError;
class BadRequestError extends GenericError {
    constructor(message) {
        super("BadRequestError", 400, message);
    }
}
exports.BadRequestError = BadRequestError;
class AuthError extends GenericError {
    constructor(message) {
        super("AuthError", 401, message);
    }
}
exports.AuthError = AuthError;
class ForbiddenError extends GenericError {
    constructor(message) {
        super("ForbiddenError", 403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends GenericError {
    constructor(message) {
        super("ResourceNotFound", 404, message);
    }
}
exports.NotFoundError = NotFoundError;
class RateLimitError extends GenericError {
    constructor(message) {
        super("RateLimitError", 429, message);
    }
}
exports.RateLimitError = RateLimitError;
class ServerError extends GenericError {
    constructor(message) {
        super("ServerError", 500, message);
    }
}
exports.ServerError = ServerError;
