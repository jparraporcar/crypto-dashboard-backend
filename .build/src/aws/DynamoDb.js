"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const env_1 = __importDefault(require("../env"));
exports.client = new client_dynamodb_1.DynamoDBClient({
    region: env_1.default.AWS_DEFAULT_REGION,
});
//# sourceMappingURL=DynamoDb.js.map