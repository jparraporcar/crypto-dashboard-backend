"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionError = exports.BinanceError = void 0;
class BinanceError {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
        this.name = 'BINANCE_ERROR';
    }
}
exports.BinanceError = BinanceError;
class ConnectionError {
    constructor(message) {
        this.message = message;
        this.name = 'ENOTFOUND';
        this.statusCode = 404;
    }
}
exports.ConnectionError = ConnectionError;
//# sourceMappingURL=ServerErrors.js.map