"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = exports.ServerError = exports.APIError = void 0;
class APIError extends Error {
    constructor(statusCode, name, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = name;
    }
}
exports.APIError = APIError;
class ServerError extends APIError {
    constructor(name, message) {
        super(500, name, message);
        this.name = name;
        this.message = message;
    }
}
exports.ServerError = ServerError;
class ClientError extends APIError {
    constructor(name, message) {
        super(400, name, message);
        this.name = name;
        this.message = message;
    }
}
exports.ClientError = ClientError;
//# sourceMappingURL=ApiError.js.map