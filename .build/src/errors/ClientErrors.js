"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistingResource = exports.ValidationError = void 0;
class ValidationError {
    constructor(message) {
        this.message = message;
        this.statusCode = 400;
        this.name = 'VALIDATION_ERROR';
    }
}
exports.ValidationError = ValidationError;
class ExistingResource {
    constructor(message) {
        this.message = message;
        this.statusCode = 409;
        this.name = 'EXISTING_RESOURCE_ERROR';
    }
}
exports.ExistingResource = ExistingResource;
//# sourceMappingURL=ClientErrors.js.map