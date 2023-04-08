"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryStringError = exports.ExistingResource = exports.ValidationError = void 0;
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
class QueryStringError {
    constructor(message) {
        this.message = message;
        this.statusCode = 400;
        this.name = 'QUERYSTRING_ERROR';
    }
}
exports.QueryStringError = QueryStringError;
// DynamoDb query errors...
//# sourceMappingURL=ClientErrors.js.map